import { useCallback, useEffect, useState } from 'react';
import { Modal, TextInput } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';

import CustomText from '@components/atom/CustomText';
import CustomButton from '@components/atom/CustomButton';
import ImagePicker from '@components/atom/ImagePicker';
import CustomSelectionButton from '@components/atom/CustomSelectionButton';

import { theme } from '../../../style/theme';

interface ModalSelectGameProp {
    shouldShowModal: boolean;
    setShouldShowModal: (val: boolean) => void;
    handleCreateGame: (
        gameType: string,
        name: string,
        gameImage?: string
    ) => void;
}

const gameOptions = [{ label: '🧙 Dungeons & Dragons', value: 'dnd5e' }];

export const ModalCreateGame = ({
    shouldShowModal,
    setShouldShowModal,
    handleCreateGame,
}: ModalSelectGameProp) => {
    const { t } = useTranslation();
    const [gameName, setGameName] = useState<string | undefined>(undefined);
    const [gameType, setGameType] = useState<string>('dnd5e');
    const [gameImage, setGameImage] = useState<string | undefined>(undefined);
    const handleSelectName = useCallback((name: string) => {
        setGameName(name);
    }, []);
    const handlePress = useCallback(() => {
        handleCreateGame(gameType, gameName, gameImage);
        setShouldShowModal(false);
    }, [gameImage, gameName, gameType, handleCreateGame, setShouldShowModal]);

    useEffect(() => {
        if (!shouldShowModal) {
            setGameName(undefined);
            setGameType('dnd5e');
            setGameImage(undefined);
        }
    }, [shouldShowModal]);

    return (
        <Modal
            visible={shouldShowModal}
            onDismiss={() => setShouldShowModal(false)}
            contentContainerStyle={styles.modalContainer}
        >
            <Animated.View entering={FadeIn}>
                <View>
                    <CustomText
                        text="Nom de la partie"
                        fontSize={theme.fontSize.large}
                    />
                    <TextInput
                        mode="outlined"
                        value={gameName}
                        onChangeText={handleSelectName}
                        multiline={false}
                        textAlign="center"
                        style={{
                            minWidth: 200,
                            justifyContent: 'center',
                            maxHeight: theme.space.l * 4,
                            marginVertical: theme.space.l,
                        }}
                    />
                </View>
                <View>
                    <CustomText
                        text={t('characters.selectGameTitle')}
                        fontSize={theme.fontSize.large}
                        style={styles.modalTitle}
                    />
                    <CustomSelectionButton
                        items={gameOptions}
                        displayValue={
                            gameOptions.find((opt) => opt.value === gameType)
                                ?.label || 'Choisir un jeu'
                        }
                        onSelect={(value) => setGameType(value)}
                        preSelectedValue={{
                            label: 'Dungeons & Dragons',
                            value: 'dnd5e',
                        }}
                        customStyle={{
                            borderRadius: theme.radius.xs,
                            borderColor: theme.colors.secondary,
                            borderWidth: 1,
                        }}
                    />
                </View>
                <View style={{ paddingVertical: theme.space.l }}>
                    <CustomText
                        text="Ajouter une image de partie"
                        fontSize={theme.fontSize.large}
                        style={styles.modalTitle}
                    />
                    <ImagePicker
                        label="Choose Game Image"
                        uri={gameImage}
                        setUri={setGameImage}
                    />
                </View>
                <CustomButton
                    disabled={!gameName}
                    text="Créer la partie"
                    onPress={handlePress}
                />
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: theme.colors.white,
        padding: theme.space.xxxl,
        marginHorizontal: theme.space.xxl,
        borderRadius: theme.radius.xxl,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalTitle: {
        marginBottom: theme.space.xxl,
        color: theme.colors.textPrimary,
    },
});
