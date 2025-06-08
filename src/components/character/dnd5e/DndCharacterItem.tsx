import { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Card, Text } from 'react-native-paper';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { DnDCharacter } from 'types/games/d2d5e';

import CustomText from '@components/atom/CustomText';
import Separator from '@components/library/Separator';
import CustomDialog from '@components/library/CustomDialog';
import { callRemoveCharacter } from '@store/character/slice';
import { useAppDispatch } from '@store/index';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@utils/utils';

import { DND_CHARACTER_DEFAULT } from '../../../../assets';
import { theme } from '../../../../style/theme';

interface DndCharacterItemProps {
    character: DnDCharacter;
    index: number;
}

const HEADER_HEIGHT = 100;
const BOTTOM_NAV_HEIGHT = 50;
const FLATLIST_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT - BOTTOM_NAV_HEIGHT - 120;
const FLATLIST_WIDTH = SCREEN_WIDTH - 32 - 24;

const LabeledElement = ({ label, val }: { label: string; val: string }) => {
    return (
        <View style={styles.contentElement}>
            <Text style={styles.contentElementLabel}>{label}</Text>
            <Text style={styles.contentElementText}>{val}</Text>
        </View>
    );
};

const DndCharacterItem = ({ character, index }: DndCharacterItemProps) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const { t } = useTranslation();

    const [isVisible, setIsVisible] = useState(false);

    const handleRemoveCharacter = useCallback(() => {
        callRemoveCharacter(character.userEmail, character.id, dispatch);
    }, [character.userEmail, character.id, dispatch]);

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
                                {t(
                                    `character.races.${character.race.index}.name`
                                )}{' '}
                                -{' '}
                                {t(
                                    `character.classes.${character.className.index}.name`
                                )}
                            </Text>
                        </View>
                        <LabeledElement
                            label={'Historique: '}
                            val={t(
                                `character.backgrounds.${character.background.index}.name`
                            )}
                        />
                        <LabeledElement
                            label={'Game: '}
                            val={character.gameType}
                        />
                        <Separator margin={theme.space.md} horizontal />
                        <View
                            style={{ flexDirection: 'row', flexWrap: 'wrap' }}
                        >
                            <CustomText
                                fontSize={theme.fontSize.large}
                                text="Description: "
                            />
                            <CustomText
                                fontSize={theme.fontSize.large}
                                color={theme.colors.textSecondary}
                                text={character.description}
                            />
                        </View>

                        <Separator spacer={{ size: 10 }} horizontal />
                        <View
                            style={{ flexDirection: 'row', flexWrap: 'wrap' }}
                        >
                            <CustomText
                                fontSize={theme.fontSize.large}
                                text="Histoire: "
                            />
                            <CustomText
                                fontSize={theme.fontSize.large}
                                color={theme.colors.textSecondary}
                                text={character.additionalBackground}
                            />
                        </View>
                    </Card.Content>
                </Card>
                <View style={styles.progressiveBlurContainer}>
                    <BlurView
                        intensity={4}
                        tint="light"
                        style={StyleSheet.absoluteFill}
                    />
                    <LinearGradient
                        colors={[theme.colors.light0, theme.colors.light100]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.light,
        width: FLATLIST_WIDTH,
        height: FLATLIST_HEIGHT,
        borderRadius: 20,
        paddingBottom: theme.space.md,
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
        overflow: 'hidden',
    },
    image: {
        backgroundColor: theme.colors.light,
        alignSelf: 'stretch',
        height: '60%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    content: {
        position: 'relative',
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
    progressiveBlurContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60, // or however much space you want to cover
        overflow: 'hidden',
        borderBottomLeftRadius: theme.radius.xl,
        borderBottomRightRadius: theme.radius.xl,
    },
    gameInfo: {
        fontSize: theme.fontSize.medium,
    },
});

export default DndCharacterItem;
