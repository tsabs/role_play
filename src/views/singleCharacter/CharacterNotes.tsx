import { useCallback, useRef, useState } from 'react';
import {
    InputAccessoryView,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import Animated, { FadeIn } from 'react-native-reanimated';

import { callAddNote } from '../../store/character/slice';
import { useAppDispatch } from '../../store';
import { theme } from '../../../style/theme';
import { AuthProps, useAuth } from '../../navigation/hook/useAuth';
import CustomButton from '../../components/atom/CustomButton';
import { Note } from '../../types/note';

const inputAccessoryViewID = 'customAccessory';

const CharacterNotes = ({ characterId }: { characterId: string }) => {
    const editorContentRef = useRef(null);
    const editorTitleRef = useRef(null);
    const auth: AuthProps = useAuth();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [isScrolling, setIsScrolling] = useState(false);
    const dispatch = useAppDispatch();

    const saveNote = useCallback(async () => {
        console.log('saving note');
        const note: Note = {
            id: Date.now().toString(),
            title,
            description: content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        callAddNote(auth.user.email, characterId, note, dispatch);

        setContent('');
        setTitle('');
        editorContentRef.current?.setContentHTML('');
        editorTitleRef.current?.setContentHTML('');
    }, [characterId, content, title]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
            >
                <Animated.View
                    style={styles.container}
                    entering={FadeIn.duration(400)}
                >
                    <TextInput
                        ref={editorTitleRef}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Titre de la note"
                    />
                    <TextInput
                        ref={editorContentRef}
                        accessible={false}
                        editable={!(!Keyboard.isVisible() && isScrolling)}
                        onTouchEnd={() => setIsScrolling(false)}
                        onTouchMove={() =>
                            setTimeout(() => setIsScrolling(true), 150)
                        }
                        onChangeText={setContent}
                        value={content}
                        multiline={true}
                        placeholder="Ecrivez votre note ici..."
                        style={styles.editor}
                        inputAccessoryViewID={inputAccessoryViewID}
                    />
                    {Platform.OS === 'ios' && (
                        <InputAccessoryView nativeID={inputAccessoryViewID}>
                            <View style={styles.hideKeyboardButton}>
                                <CustomButton
                                    text="Hide Keyboard"
                                    onPress={Keyboard.dismiss}
                                />
                            </View>
                        </InputAccessoryView>
                    )}
                    <CustomButton
                        style={{ marginHorizontal: 20 }}
                        text="Save note"
                        disabled={!title || !content}
                        onPress={saveNote}
                    />
                </Animated.View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.space.xl,
        flexDirection: 'column',
        gap: theme.space.sm,
    },
    editor: {
        flex: 1,
        borderWidth: 1,
        borderColor: theme.colors.light,
        marginBottom: theme.space.md,
    },
    toolbar: { borderTopWidth: 1, borderColor: theme.colors.light },
    hideKeyboardButton: {
        backgroundColor: theme.colors.light,
        padding: theme.space.md,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    saveButton: {
        padding: theme.space.md,
        backgroundColor: theme.colors.primary,
    },
});

export default CharacterNotes;
