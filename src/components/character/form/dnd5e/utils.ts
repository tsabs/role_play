import { OPENAI_API_KEY } from '@env';
import storage from '@react-native-firebase/storage';
import { v4 as uuidv4 } from 'uuid';

import { theme } from '../../../../../style/theme';

const generateImage = async (prompt: string): Promise<string | null> => {
    console.log('api key: ', OPENAI_API_KEY);
    try {
        const res = await fetch(
            'https://api.openai.com/v1/images/generations',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'dall-e-3',
                    prompt: prompt,
                    n: 1,
                    size: '1024x1024',
                    quality: 'standard',
                }),
            }
        );

        const json = await res.json();
        return json.data?.[0]?.url ?? null;
    } catch (error) {
        console.error('Image generation failed:', error);
        return null;
    }
};

export const uploadImageFromUrl = async (
    imageUrl: string
): Promise<string | null> => {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const imageId = uuidv4();
        const storageRef = storage().ref(`images/${imageId}.png`);

        await storageRef.put(blob as any);

        return await storageRef.getDownloadURL();
    } catch (error) {
        console.error('Error uploading image to Firebase Storage:', error);
        return null;
    }
};

const combatsStyle = (className: string) => [
    {
        value: 'archery',
        label: `character.classes.${className}.combatsStyle.archery.index`,
        description: `character.classes.${className}.combatsStyle.archery.character`,
    },
    {
        value: 'defense',
        label: `character.classes.${className}.combatsStyle.defense.index`,
        description: `character.classes.${className}.combatsStyle.defense.character`,
    },
    {
        value: 'dueling',
        label: `character.classes.${className}.combatsStyle.dueling.index`,
        description: `character.classes.${className}.combatsStyle.dueling.character`,
    },
    {
        value: 'twoWeapon',
        label: `character.classes.${className}.combatsStyle.twoWeapon.index`,
        description: `character.classes.${className}.combatsStyle.twoWeapon.character`,
    },
    {
        value: 'blind',
        label: `character.classes.${className}.combatsStyle.blind.index`,
        description: `character.classes.${className}.combatsStyle.blind.character`,
    },
    {
        value: 'druidicWarrior',
        label: `character.classes.${className}.combatsStyle.druidicWarrior.index`,
        description: `character.classes.${className}.combatsStyle.druidicWarrior.character`,
    },
    {
        value: 'thrownWeapon',
        label: `character.classes.${className}.combatsStyle.thrownWeapon.index`,
        description: `character.classes.${className}.combatsStyle.thrownWeapon.character`,
    },
];

const getSpellColor = (spellSchool: string) => {
    switch (spellSchool) {
        case 'conjuration':
            return '#4B0082';
        case 'abjuration':
            return '#556B2F';
        case 'divination':
            return '#9400D3';
        case 'enchantment':
            return '#DB7093';
        case 'evocation':
            return '#FF6347';
        case 'illusion':
            return '#1E90FF';
        case 'necromancy':
            return '#8B0000';
        case 'transmutation':
            return '#228B22';
        default:
            return theme.colors.primary;
    }
};

export { generateImage, combatsStyle, getSpellColor };
