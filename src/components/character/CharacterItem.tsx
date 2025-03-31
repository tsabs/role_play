import { Card, Text } from 'react-native-paper';
import { characterSlice, GenericCharacter } from '../../store/character/slice';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { theme } from '../../../style/theme';
import { DND_CHARACTER_DEFAULT } from '../../../assets';
import { useCallback } from 'react';
import { useAppDispatch } from '../../store';
import { useNavigation } from '@react-navigation/native';

interface CharacterItemProps {
    character: GenericCharacter;
    index: number;
}

const { height, width } = Dimensions.get('screen');
const HEADER_HEIGHT = 100;
const BOTTOM_NAV_HEIGHT = 50;
const FLATLIST_HEIGHT = height - HEADER_HEIGHT - BOTTOM_NAV_HEIGHT - 120;
const FLATLIST_WIDTH = width - 32 - 24;

const CharacterItem = ({ character, index }: CharacterItemProps) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    const removeCharacter = useCallback(async () => {
        try {
            dispatch(
                characterSlice.actions.removeCharacter({ name: character.name })
            );
        } catch (error) {
            console.error('error when deleting character', error);
        }
    }, []);

    return (
        <Animated.View
            style={{ padding: theme.space.xl }}
            entering={FadeInRight.delay(index * 200)}
        >
            <TouchableOpacity
                delayPressIn={50}
                onLongPress={removeCharacter}
                onPress={() => {
                    console.log('Touched character:', character.name);
                    navigation.navigate('BottomCharacterTabs');
                }}
            >
                <Card style={styles.card}>
                    <Card.Cover
                        source={DND_CHARACTER_DEFAULT}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <Card.Content style={styles.content}>
                        <Text style={styles.name}>{character.name}</Text>
                        <Text style={styles.info}>
                            {character.race} - {character.className}
                        </Text>
                        <Text style={styles.description}>
                            {character.description}
                        </Text>
                        <Text style={styles.gameInfo}>
                            Game: {character.gameType}
                        </Text>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: FLATLIST_WIDTH,
        height: FLATLIST_HEIGHT,
        borderRadius: 20,
        paddingBottom: theme.space.md, // Extra space to prevent clipping
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    image: {
        alignSelf: 'stretch', // Ensure image fills width
        height: '60%', // Take up half of the card height
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    content: {
        alignItems: 'flex-start',
        paddingTop: theme.space.md,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
        marginTop: theme.space.md,
    },
    info: {
        fontSize: 18,
        color: theme.colors.textSecondary,
        marginVertical: theme.space.sm,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: theme.colors.textSecondary,
        paddingHorizontal: theme.space.l,
    },
    gameInfo: {
        fontSize: 14,
        marginTop: theme.space.sm,
        // color: theme.colors.textMuted,
    },
});

export default CharacterItem;
