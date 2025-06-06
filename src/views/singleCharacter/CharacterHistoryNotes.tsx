import { Fragment, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { List, Text } from 'react-native-paper';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useAppSelector } from '../../store';
import { selectNotes } from '../../store/character/selectors';
import { theme } from '../../../style/theme';
import CustomText from '../../components/atom/CustomText';
import { Note } from '../../types/note';

const CharacterHistoryNotes = ({ characterId }: { characterId: string }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const isFocused = useIsFocused();

    const notesFromSelector = useAppSelector(selectNotes(characterId));

    useEffect(() => {
        if (notesFromSelector?.length !== notes?.length) {
            setNotes(notesFromSelector);
        }
    }, [notesFromSelector, notes]);

    if (!isFocused) return <Fragment />;

    const renderItem = ({ item, index }: { item: Note; index: number }) => {
        return (
            <List.Accordion id={index} title={item.title}>
                <Animated.View
                    style={styles.accordionContainer}
                    entering={FadeIn.duration(400)}
                >
                    <CustomText text={item.description} />
                </Animated.View>
            </List.Accordion>
        );
    };

    return (
        <Animated.View style={styles.container} entering={FadeIn.duration(500)}>
            <List.AccordionGroup>
                {!notes?.length ? (
                    <Text style={styles.noNotes}>Pas encore de notes</Text>
                ) : (
                    <FlatList data={notes} renderItem={renderItem} />
                )}
            </List.AccordionGroup>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: theme.space.xl,
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

export default CharacterHistoryNotes;
