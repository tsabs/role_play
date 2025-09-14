import React, {
    useState,
    useRef,
    useMemo,
    useCallback,
    useEffect,
} from 'react';
import {
    View,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from 'react-native';
import {
    TextInput,
    Card,
    Text,
    ActivityIndicator,
    useTheme,
    Chip,
} from 'react-native-paper';

import CustomButton from '@components/atom/CustomButton';
import { categories, DataCategory, findItemByName } from '@utils/d2d5';

import { askLLMFromPi } from '../../services/llmService';
import { theme as customtheme } from '../../../style/theme';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'bot';
};

interface ChatBotProps {
    race: string;
    className: string;
    subClassName: string;
    level: number;
}

const ChatBot = ({ race, className, subClassName, level }: ChatBotProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [fuseSuggestions, setFuseSuggestions] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] =
        useState<DataCategory | null>(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const theme = useTheme();

    const context = useMemo(() => {
        const subClass = subClassName ? subClassName : 'Non renseigné';
        return 'Tu es un expert du jeu de role donjons et dragons. Tu réponds en français de manière courte. Si tu ne connais pas la réponse ou que celle-ci est potentiellement trop éloigné de la vérité réponds que tu ne sais pas.';
        //     `We are talking about rule or character specifications, context: Race: ${race}\n
        // Classe: ${className}\n
        // Sous-classe: ${subClass}\n
        // Niveau: ${level}\n`
    }, [subClassName]);

    // console.log(context);

    const sendMessage = useCallback(async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        console.log('category: ', selectedCategory);
        const results = selectedCategory
            ? findItemByName(selectedCategory, input)
            : [];

        console.log('results: ', results);

        if (results.length > 0) {
            setFuseSuggestions(results);
            setIsLoading(false);
            return;
        }

        // Uncomment the following line to download the model if not already done
        // const modelPath = await ensureModelDownloaded();
        let botText = '';

        try {
            // const botText = modelPath
            //     ? await askLLM(input, context)
            //     : await askLLMFromPi(input, context);

            botText = await askLLMFromPi(input, context);

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: botText,
                sender: 'bot',
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Erreur lors de la génération de réponse.',
                sender: 'bot',
            };
            console.log('Error:', error);
            setMessages((prev) => [...prev, errorMessage]);
        }

        setIsLoading(false);
    }, [context, input, selectedCategory]);

    const handleSuggestionPick = useCallback((item: any) => {
        setFuseSuggestions([]);
        const botMessage: Message = {
            id: Date.now().toString(),
            text: `📘 ${item.name} : ${item.desc}`,
            sender: 'bot',
        };
        setMessages((prev) => [...prev, botMessage]);
    }, []);

    useEffect(() => {
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                text: `🧠 Merci de taper uniquement le nom ou mot-clé concernant votre question.`,
                sender: 'bot',
            },
        ]);
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: Message }) => (
            <View
                style={{
                    alignSelf:
                        item.sender === 'user' ? 'flex-end' : 'flex-start',
                    marginVertical: 4,
                    maxWidth: '80%',
                }}
            >
                <Card
                    style={{
                        backgroundColor:
                            item.sender === 'user'
                                ? theme.colors.primary
                                : theme.colors.surface,
                    }}
                >
                    <Card.Content>
                        <Text
                            style={{
                                color:
                                    item.sender === 'user'
                                        ? 'white'
                                        : theme.colors.onSurface,
                            }}
                        >
                            {item.text}
                        </Text>
                    </Card.Content>
                </Card>
            </View>
        ),
        []
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.flatListContent}
                onContentSizeChange={() =>
                    flatListRef.current?.scrollToEnd({ animated: true })
                }
            />

            {isLoading && (
                <ActivityIndicator
                    animating
                    style={{ margin: customtheme.space.l }}
                />
            )}

            {fuseSuggestions.length > 0 && (
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginLeft: customtheme.space.l,
                    }}
                >
                    {fuseSuggestions.map((fuse, index) => {
                        return (
                            <CustomButton
                                key={index}
                                text={fuse.item.name}
                                onPress={() => handleSuggestionPick(fuse.item)}
                                style={styles.suggestionButton}
                            />
                        );
                    })}
                </View>
            )}

            <View style={styles.categoriesContainer}>
                {categories.map((cat) => (
                    <Chip
                        key={cat.value}
                        selected={selectedCategory === cat.value}
                        onPress={() => {
                            setSelectedCategory(cat.value);
                        }}
                        style={styles.category}
                    >
                        {cat.label}
                    </Chip>
                ))}
            </View>

            <View style={styles.textInputContainer}>
                <TextInput
                    mode="outlined"
                    outlineStyle={styles.textInput}
                    placeholder="Type your message"
                    value={input}
                    onChangeText={setInput}
                    style={{ flex: 1, marginRight: customtheme.space.l }}
                />
                <CustomButton
                    style={styles.sendCategoryButton}
                    disabled={!input.trim() || !selectedCategory}
                    onPress={sendMessage}
                    text="Envoyer"
                />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    //
    container: {
        flex: 1,
    },
    flatListContent: { padding: customtheme.space.l },
    suggestionButton: {
        marginBottom: customtheme.space.l,
        marginRight: customtheme.space.xs,
        justifyContent: 'center',
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: customtheme.space.l,
        marginTop: customtheme.space.xs,
        gap: customtheme.space.md,
    },
    category: { marginBottom: customtheme.space.sm },
    textInputContainer: {
        flexDirection: 'row',
        padding: customtheme.space.l,
        alignItems: 'center',
    },
    textInput: { borderColor: customtheme.colors.primary },
    sendCategoryButton: { padding: 5, borderRadius: customtheme.radius.xl },
});

export default ChatBot;
