import { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Text } from 'react-native-paper';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import {
    callRemoveCharacter,
    GenericCharacter,
} from '../../store/character/slice';
import { theme } from '../../../style/theme';
import { DND_CHARACTER_DEFAULT } from '../../../assets';
import { useAppDispatch } from '../../store';
import Separator from '../library/Separator';
import CustomDialog from '../library/CustomDialog';

interface CharacterItemProps {
    character: GenericCharacter;
    index: number;
}

const { height, width } = Dimensions.get('screen');
const HEADER_HEIGHT = 100;
const BOTTOM_NAV_HEIGHT = 50;
const FLATLIST_HEIGHT = height - HEADER_HEIGHT - BOTTOM_NAV_HEIGHT - 120;
const FLATLIST_WIDTH = width - 32 - 24;

const LabeledElement = ({ label, val }: { label: string; val: string }) => {
    return (
        <View style={styles.contentElement}>
            <Text style={styles.contentElementLabel}>{label}</Text>
            <Text style={styles.contentElementText}>{val}</Text>
        </View>
    );
};

const CharacterItem = ({ character, index }: CharacterItemProps) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const { t } = useTranslation();

    const [isVisible, setIsVisible] = useState(false);

    const handleRemoveCharacter = useCallback(() => {
        callRemoveCharacter(character.userEmail, character.id, dispatch);
    }, []);

    return (
        <Animated.View
            style={{ padding: theme.space.xl }}
            entering={FadeInRight.delay(index * 200)}
        >
            <TouchableOpacity
                delayPressIn={50}
                onLongPress={() => setIsVisible(true)}
                onPress={() => {
                    navigation.navigate('BottomCharacterTabs', {
                        character: character,
                    });
                }}
            >
                <CustomDialog
                    title={t('character.removeCharacter', {
                        name: character.name,
                    })}
                    description={t('character.removeCharacterDescription')}
                    isVisible={isVisible}
                    triggerAction={handleRemoveCharacter}
                    setIsVisible={setIsVisible}
                />
                <Card style={styles.card}>
                    <Card.Cover
                        source={DND_CHARACTER_DEFAULT}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <Card.Content style={styles.content}>
                        <View style={styles.contentHeader}>
                            <Text style={styles.name}>{character.name}</Text>
                            <Text style={styles.info}>
                                {t(`character.races.${character.race}`)} -{' '}
                                {t(`character.classes.${character.className}`)}
                            </Text>
                        </View>
                        <LabeledElement
                            label={'Historique: '}
                            val={t(
                                `character.backgrounds.${character.background}.name`
                            )}
                        />
                        <LabeledElement
                            label={'Game: '}
                            val={character.gameType}
                        />
                        <Separator margin={theme.space.md} horizontal />
                        <Text style={styles.description}>
                            {character.description}
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
        height: '65%', // Take up half of the card height
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    content: {
        marginTop: theme.space.l,
    },
    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    contentElement: {
        flexDirection: 'row',
    },
    contentElementLabel: {
        fontSize: theme.fontSize.large,
        color: theme.colors.textPrimary,
    },
    contentElementText: {
        alignSelf: 'flex-end',
        color: theme.colors.textSecondary,
        fontSize: theme.fontSize.medium,
    },
    name: {
        fontSize: theme.fontSize.extraBig,
        fontWeight: 'bold',
        marginRight: theme.space.md,
        color: theme.colors.textPrimary,
    },
    info: {
        fontSize: theme.fontSize.extraLarge,
        color: theme.colors.textSecondary,
    },
    description: {
        fontSize: theme.fontSize.large,
        color: theme.colors.textSecondary,
    },
    gameInfo: {
        fontSize: theme.fontSize.medium,
    },
});

export default CharacterItem;
