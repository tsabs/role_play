import * as FileSystem from 'expo-file-system';
import { encode as btoa } from 'base-64';
import {
    LLM_BASIC_AUTH_PASS,
    LLM_BASIC_AUTH_USER,
    LLM_FIREBASE_TOKEN_ACCESS,
    LLM_PI_ENDPOINT,
} from '@env';
import { initLlama } from 'llama.rn';

// const OLD_MODEL_PATH = 'tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf';
// const MODEL_FILENAME = 'Llama-3.2-3B-Instruct-Q4_K_M.gguf';
// const MODEL_FILENAME = 'openbuddy-mistral-7b-v13-base.Q4_K_M.gguf';
const MODEL_FILENAME = 'mistral-7b-instruct-v0.1.Q4_K_M.gguf';
// const MODEL_URL = `https://firebasestorage.googleapis.com/v0/b/role-play-ea5f2.appspot.com/o/models%2F${MODEL_FILENAME}?alt=media&token=${LLM_FIREBASE_TOKEN_ACCESS}`;
const MODEL_URL = `https://firebasestorage.googleapis.com/v0/b/role-play-ea5f2.appspot.com/o/models%2F${MODEL_FILENAME}?alt=media&token=${LLM_FIREBASE_TOKEN_ACCESS}`;

const MODEL_PATH = FileSystem.documentDirectory + MODEL_FILENAME;

export const deleteOldModels = async () => {
    try {
        const allFiles = await FileSystem.readDirectoryAsync(
            FileSystem.documentDirectory || ''
        );

        for (const file of allFiles) {
            const fullPath = FileSystem.documentDirectory + file;

            if (file.endsWith('gguf')) {
                try {
                    await FileSystem.deleteAsync(fullPath, {
                        idempotent: true,
                    });
                    console.log(`✅ Deleted old model: ${file}`);
                } catch (e) {
                    console.warn(`⚠️ Failed to delete ${file}:`, e);
                }
            }
        }
    } catch (err) {
        console.error('Failed to read or delete models:', err);
    }
};

export const ensureModelDownloaded = async (): Promise<string> => {
    const fileInfo = await FileSystem.getInfoAsync(MODEL_PATH);
    console.log(fileInfo);

    if (!fileInfo.exists || fileInfo.size < 1024 * 1000) {
        console.log(
            'Model file is missing or too small – possibly incomplete download'
        );
    }

    if (!fileInfo.exists) {
        console.log('Model not found. Downloading...');

        const downloadResumable = FileSystem.createDownloadResumable(
            MODEL_URL,
            MODEL_PATH,
            {},
            (downloadProgress) => {
                const progress =
                    downloadProgress.totalBytesWritten /
                    downloadProgress.totalBytesExpectedToWrite;
                console.log(
                    `Downloading model: ${(progress * 100).toFixed(2)}%`
                );
            }
        );

        try {
            const result = await downloadResumable.downloadAsync();
            console.log('Download complete:', result.uri);
        } catch (e) {
            console.error('Model download failed:', e);
        }
    } else {
        console.log('Model already exists locally.');
    }

    return MODEL_PATH;
};

export const askLLM = async (question: string, context: string) => {
    const stopWords = [
        '</s>',
        '<|end|>',
        '<|eot_id|>',
        '<|end_of_text|>',
        '<|im_end|>',
        '<|EOT|>',
        '<|END_OF_TURN_TOKEN|>',
        '<|end_of_turn|>',
        '<|endoftext|>',
    ];

    try {
        const modelPath = await ensureModelDownloaded();

        console.time('initLlama');
        const llamaContext = await initLlama({
            model: modelPath,
            use_mlock: false,
            n_ctx: 2048,
            n_threads: 6,
        });
        console.timeEnd('initLlama');

        console.time('inference');
        const response = await llamaContext.completion({
            messages: [
                {
                    role: 'system',
                    content: `Vous êtes un expert de D&D 5e. Répondez en français, de façon précise et concise, selon les règles du jeu.`,
                },
                {
                    role: 'user',
                    content: `### Contexte du personnage:\n${context}\n\n### Question:\n${question}`,
                },
            ],
            n_predict: 128,
            temperature: 0.7,
            top_p: 0.9,
            penalty_repeat: 1.1,
            stop: stopWords,
        });
        console.timeEnd('inference');

        // console.log('LLM response:', response.text);
        return response.text.trim();
    } catch (error) {
        console.error('askLLM failed:', error);
        return 'Erreur: échec de la génération de réponse.';
    }
};

export const askLLMFromPi = async (question: string, context: string) => {
    const credentials = btoa(`${LLM_BASIC_AUTH_USER}:${LLM_BASIC_AUTH_PASS}`);

    try {
        const response = await fetch(LLM_PI_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${credentials}`,
            },
            body: JSON.stringify({
                prompt: `\n${context}\n\nQuestion:\n${question}`,
                n_predict: 50,
            }),
        });

        if (!response.ok) {
            return new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.content?.trim() || data.response?.trim() || 'Réponse vide';
    } catch (error) {
        console.error('askLLM (Public Server) failed:', error);
        return 'Erreur lors de la communication avec le serveur LLM.';
    }
};
