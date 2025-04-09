import { useCallback, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

import Animated, { FadeIn } from 'react-native-reanimated';
import { callAddNote, Note } from '../../store/character/slice';
import { useAppDispatch } from '../../store';
import { theme } from '../../../style/theme';
import { AuthProps, useAuth } from '../../navigation/hook/useAuth';
import CustomButton from '../../components/atom/CustomButton';

const CharacterNotes = ({ characterId }: { characterId: string }) => {
    const editorContentRef = useRef(null);
    const editorTitleRef = useRef(null);
    const auth: AuthProps = useAuth();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const dispatch = useAppDispatch();

    const saveNote = useCallback(async () => {
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
        <Animated.View style={styles.container} entering={FadeIn.duration(500)}>
            <TextInput
                ref={editorTitleRef}
                value={title}
                onChangeText={setTitle}
                placeholder="Titre de la note"
            />
            <TextInput
                ref={editorContentRef}
                onChangeText={setContent}
                value={content}
                multiline={true}
                placeholder="Ecrivez votre note ici..."
                style={styles.editor}
            />
            <CustomButton
                style={{ marginHorizontal: 20 }}
                text="Save note"
                disabled={!title || !content}
                onPress={saveNote}
            />
        </Animated.View>
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
    saveButton: {
        padding: theme.space.md,
        backgroundColor: theme.colors.primary,
    },
});

export default CharacterNotes;
