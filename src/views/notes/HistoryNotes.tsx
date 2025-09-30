import { Dispatch, useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { IconButton, List, TextInput } from 'react-native-paper';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Note } from 'types/note';

import CustomText from '@components/atom/CustomText';
import { useAppDispatch, useAppSelector } from '@store/index';
import { selectNotes } from '@store/character/selectors';
import { selectNotes as selectSessionNotes } from '@store/session/selectors';
import { AuthProps, useAuth } from '@navigation/hook/useAuth';

import { theme } from '../../../style/theme';

const HistoryNotes = ({
    entityId,
    onEditNote,
    onRemoveNote,
    collectionName,
}: {
    entityId: string;
    onEditNote: (
        entityId: string,
        note: Note,
        dispatch: Dispatch<any>
    ) => Promise<void>;
    onRemoveNote: (
        entityId: string,
        noteId: string,
        dispatch: Dispatch<any>
    ) => Promise<void>;
    collectionName: string;
}) => {
    const auth: AuthProps = useAuth();
    const isFocused = useIsFocused();
    const dispatch = useAppDispatch();
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [editedNote, setEditedNote] = useState<string>(undefined);

    const notesFromSelector = useAppSelector(
        collectionName === 'characters'
            ? selectNotes(entityId)
            : selectSessionNotes(entityId)
    );

    const handleChangeMode = useCallback((value: boolean) => {
        setIsEditMode(value);
    }, []);

    const handleEditNote = useCallback(
        async (item: Note) => {
            setIsEditMode(false);
            const newNote: Note = {
                ...item,
                description: editedNote,
            };
            await onEditNote(entityId, newNote, dispatch).finally(() => {
                setEditedNote(undefined);
            });
        },
        [editedNote, onEditNote, entityId, dispatch]
    );

    const removeNote = useCallback(
        async (noteId: string) => {
            await onRemoveNote(entityId, noteId, dispatch);
        },
        [onRemoveNote, entityId, dispatch]
    );
    console.log('notesFromSelector', notesFromSelector);

    const renderItem = useCallback(
        ({ item, index }: { item: Note; index: number }) => {
            return (
                <List.Accordion id={index} title={item.title}>
                    <Animated.View
                        style={styles.accordionContainer}
                        entering={FadeIn.duration(400)}
                    >
                        {isEditMode ? (
                            <TextInput
                                mode="outlined"
                                multiline
                                numberOfLines={10}
                                onChangeText={setEditedNote}
                                // label=""
                                value={editedNote}
                                defaultValue={item.description}
                            />
                        ) : (
                            <CustomText text={item.description} />
                        )}
                        <View style={styles.content}>
                            <View style={styles.editButton}>
                                <IconButton
                                    size={18}
                                    iconColor={theme.colors.primary}
                                    icon="pen"
                                    onPress={() =>
                                        handleChangeMode(!isEditMode)
                                    }
                                />
                                {isEditMode && (
                                    <IconButton
                                        size={18}
                                        iconColor={theme.colors.success}
                                        icon="check"
                                        onPress={() => {
                                            handleEditNote(item);
                                        }}
                                    />
                                )}
                            </View>
                            <View style={styles.deleteButton}>
                                <IconButton
                                    size={18}
                                    iconColor={theme.colors.danger}
                                    icon="delete"
                                    onPress={() => removeNote(item.id)}
                                    style={styles.deleteIcon}
                                />
                            </View>
                        </View>
                    </Animated.View>
                </List.Accordion>
            );
        },
        [editedNote, handleChangeMode, handleEditNote, isEditMode, removeNote]
    );

    if (!isFocused) return null;

    return (
        <Animated.View style={styles.container} entering={FadeIn.duration(500)}>
            <List.AccordionGroup>
                {!notesFromSelector?.length ? (
                    <CustomText
                        text={'Pas encore de notes'}
                        style={styles.noNotes}
                    />
                ) : (
                    <FlatList
                        data={notesFromSelector}
                        renderItem={renderItem}
                    />
                )}
            </List.AccordionGroup>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: theme.space.xl,
    },
    content: {
        flexDirection: 'row',
        flex: 1,
    },
    editButton: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        gap: theme.space.md,
        flex: 1,
    },
    deleteButton: { justifyContent: 'flex-end', flex: 1 },
    deleteIcon: {
        alignSelf: 'flex-end',
    },
    accordionContainer: {
        margin: theme.space.xl,
    },
    noNotes: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HistoryNotes;
