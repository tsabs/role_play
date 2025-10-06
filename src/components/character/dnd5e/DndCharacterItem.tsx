import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Card, Text } from 'react-native-paper';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { DnDCharacter } from 'types/games/d2d5e';
import Toast from 'react-native-toast-message';

import CustomText from '@components/atom/CustomText';
import Separator from '@components/library/Separator';
import CustomDialog from '@components/library/CustomDialog';
import { useAuth } from '@navigation/hook/useAuth';
import { removeCharacterFromSession } from '@store/session/sessionServices';
import { callRemoveCharacter } from '@store/character/slice';
import { useAppDispatch } from '@store/index';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '@utils/utils';
import { isOwnerOrGm } from '@views/sessions/utils';

import { DND_CHARACTER_DEFAULT } from '../../../../assets';
import { theme } from '../../../../style/theme';

interface DndCharacterItemProps {
    character: DnDCharacter;
    index: number;
    mode: string;
    sessionId?: string;
    gmId?: string;
}

const HEADER_HEIGHT = 100;
const BOTTOM_NAV_HEIGHT = 50;
const FLATLIST_HEIGHT = WINDOW_HEIGHT - HEADER_HEIGHT - BOTTOM_NAV_HEIGHT - 60;
const FLATLIST_WIDTH = WINDOW_WIDTH - 32 - 24;

const LabeledElement = ({ label, val }: { label: string; val: string }) => {
    return (
        <View style={styles.contentElement}>
            <CustomText
                fontSize={16}
                text={label}
                style={styles.contentElementLabel}
            />
            <CustomText
                style={styles.contentElementText}
                text={val}
                color={theme.colors.textSecondary}
                fontSize={16}
            />
        </View>
    );
};

const DndCharacterItem = ({
    character,
    index,
    mode,
    sessionId,
    gmId,
}: DndCharacterItemProps) => {
    const dispatch = useAppDispatch();
    const auth = useAuth();
    const navigation = useNavigation();
    const { t } = useTranslation();

    const [isVisible, setIsVisible] = useState(false);
    const isOwnerOrGameMaster = useMemo(
        () => isOwnerOrGm(auth.user.uid, character.ownerId, mode, gmId),
        [auth.user.uid, character.ownerId, gmId, mode]
    );

    const handleRemoveCharacter = useCallback(async () => {
        if (isOwnerOrGameMaster) {
            if (mode === 'session') {
                await removeCharacterFromSession(
                    sessionId,
                    character.id,
                    character.ownerId,
                    dispatch
                );
            } else {
                await callRemoveCharacter(character.id, dispatch);
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Seul un GM ou le propriétaire peut supprimer ce personnage',
            });
        }
    }, [
        character.id,
        character.ownerId,
        dispatch,
        isOwnerOrGameMaster,
        mode,
        sessionId,
    ]);

    return (
        <Animated.View
            style={{ padding: theme.space.xl }}
            entering={FadeInRight.delay(index * 200)}
        >
            <TouchableOpacity
                delayPressIn={50}
                disabled={!isOwnerOrGameMaster}
                onLongPress={() => setIsVisible(true)}
                onPress={() => {
                    navigation.navigate('BottomCharacterTabs', {
                        character: character,
                        gmId,
                        sessionId,
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
                        source={
                            character?.imageUri
                                ? { uri: character.imageUri }
                                : DND_CHARACTER_DEFAULT
                        }
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
                        <LabeledElement
                            label={'Description: '}
                            val={character.description}
                        />

                        <Separator spacer={{ size: 10 }} horizontal />
                        <LabeledElement
                            label={'Histoire: '}
                            val={character.additionalBackground}
                        />
                    </Card.Content>
                </Card>
                <View style={styles.progressiveBlurContainer}>
                    <BlurView
                        intensity={4}
                        tint="light"
                        style={StyleSheet.absoluteFill}
                    />
                    <LinearGradient
                        colors={[
                            theme.colors.light0,
                            theme.colors.light50,
                            theme.colors.light75,
                            theme.colors.light100,
                            theme.colors.light100,
                        ]}
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
        overflow: 'hidden',
    },
    image: {
        backgroundColor: theme.colors.light,
        alignSelf: 'stretch',
        height: WINDOW_HEIGHT / 2.5,
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
        flexWrap: 'wrap',
    },
    contentElementLabel: {
        fontSize: theme.fontSize.large,
        color: theme.colors.textPrimary,
    },
    contentElementText: {
        alignSelf: 'flex-end',
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
        height: 120, // or however much space you want to cover
        overflow: 'hidden',
        borderBottomLeftRadius: theme.radius.xl,
        borderBottomRightRadius: theme.radius.xl,
    },
    gameInfo: {
        fontSize: theme.fontSize.medium,
    },
});

export default DndCharacterItem;
