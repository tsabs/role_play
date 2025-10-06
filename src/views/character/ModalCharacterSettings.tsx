import { useCallback, useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import {
    ActivityIndicator,
    IconButton,
    Modal,
    TextInput,
} from 'react-native-paper';
import Animated, { FadeIn } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import * as Clipboard from 'expo-clipboard';
import { canGenerateImage, recordImageGeneration } from 'firestore/utils';

import CustomText from '@components/atom/CustomText';
import ImagePicker from '@components/atom/ImagePicker';
import {
    generateImage,
    uploadImageFromUrl,
} from '@components/character/form/dnd5e/utils';
import CustomButton from '@components/atom/CustomButton';
import { getUserInfo } from '@store/user/service';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@utils/utils';

import { theme } from '../../../style/theme';

interface ModalCharacterSettingsProps {
    shouldShowModal: boolean;
    setShouldShowModal: (val: boolean) => void;
    handleCharacterImgChange: (uri: string) => void;
    prompt: string;
    characterId: string;
}

const ModalCharacterSettings = ({
    shouldShowModal,
    prompt,
    characterId,
    setShouldShowModal,
    handleCharacterImgChange,
}: ModalCharacterSettingsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [uri, setUri] = useState<string | undefined>(undefined);
    const [isEditingPrompt, setIsEditingPrompt] = useState<boolean>(false);
    const [editedPrompt, setEditedPrompt] = useState<string>(undefined);

    const handleGetPrompt = useCallback(async () => {
        const infoUser = await getUserInfo();
        setEditedPrompt(
            infoUser?.imageGenerations?.previousPrompts?.[characterId] || prompt
        );
    }, [characterId, prompt]);

    const handleDismiss = useCallback(() => {
        setShouldShowModal(false);
        setUri(undefined);
        setIsEditingPrompt(false);
    }, [setShouldShowModal]);

    const handleChange = useCallback(() => {
        handleCharacterImgChange(uri);
        setShouldShowModal(false);
        setUri(undefined);
    }, [handleCharacterImgChange, setShouldShowModal, uri]);

    const handleDisplayText = useCallback(() => {
        setIsEditingPrompt((prev) => !prev);
    }, []);

    const handleResetInitialPrompt = useCallback(() => {
        setEditedPrompt(prompt);
    }, [prompt]);

    const handleGenerateImg = useCallback(async () => {
        setIsLoading(true);
        try {
            const allowed = await canGenerateImage();
            if (!allowed) {
                Alert.alert(
                    'Limite atteinte',
                    'Vous ne pouvez générer que 5 images par mois.'
                );
                return;
            }
            const dallEUrl = await generateImage(
                editedPrompt
                    // .replace(/fiche|carte|texte/gi, '') // supprimer mots pouvant orienter vers fiche
                    .trim()
            );
            await recordImageGeneration(editedPrompt, characterId);
            if (!dallEUrl) {
                return new Error('No image URL returned from DALL·E');
            }

            // Upload the image to Firebase Storage
            const uploadedUrl = await uploadImageFromUrl(dallEUrl);

            if (!uploadedUrl) {
                return new Error('Image upload failed');
            }
            setUri(uploadedUrl);
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur est survenue.');
        } finally {
            setIsLoading(false);
        }
    }, [characterId, editedPrompt]);

    const handleClipboard = useCallback(() => {
        Clipboard.setStringAsync(characterId);
        Toast.show({
            type: 'success',
            text1: 'ID du personnage copié',
        });
    }, [characterId]);

    useEffect(() => {
        handleGetPrompt();
    }, [handleGetPrompt]);

    return (
        <Modal
            visible={shouldShowModal}
            onDismiss={handleDismiss}
            contentContainerStyle={styles.modalContainer}
        >
            <Animated.View style={{ alignItems: 'center' }} entering={FadeIn}>
                <CustomText
                    text={'Paramètres du personnage'}
                    fontSize={theme.fontSize.big}
                    style={styles.modalTitle}
                />
                <View style={{ flexDirection: 'row', gap: theme.space.sm }}>
                    <ImagePicker label="Changer l'image" setUri={setUri} />
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <CustomButton
                            // style={{ flex: 0 }}
                            text={'Afficher le prompt'}
                            textSize={theme.fontSize.large}
                            buttonColor={theme.colors.light}
                            textColor={theme.colors.textPrimary}
                            onPress={handleDisplayText}
                        />
                        <IconButton
                            onPress={handleResetInitialPrompt}
                            size={18}
                            mode="contained"
                            icon="arrow-u-left-bottom"
                        />
                    </View>
                </View>
                {isEditingPrompt && (
                    <View style={{ flex: 0, height: 200 }}>
                        <TextInput
                            style={{ flex: 1 }}
                            mode="outlined"
                            multiline
                            numberOfLines={100}
                            value={editedPrompt}
                            onChangeText={setEditedPrompt}
                        />
                        <CustomButton
                            style={{ margin: theme.space.sm }}
                            text="Générer l'image"
                            textSize={theme.fontSize.large}
                            // buttonColor={theme.colors.light}
                            // textColor={theme.colors.textPrimary}
                            onPress={handleGenerateImg}
                        />
                    </View>
                )}
                {uri && (
                    <Image
                        style={{
                            width: SCREEN_WIDTH * 0.9,
                            height: SCREEN_HEIGHT * 0.4,
                        }}
                        source={{ uri }}
                    />
                )}
                {uri && (
                    <View style={styles.buttons}>
                        <CustomButton
                            text="Annuler"
                            onPress={handleDismiss}
                            buttonColor={theme.colors.light}
                            textColor={theme.colors.textPrimary}
                        />
                        <CustomButton
                            text="Valider"
                            onPress={handleChange}
                            buttonColor={theme.colors.primary}
                            textColor={theme.colors.white}
                        />
                    </View>
                )}
                {isLoading && (
                    <View
                        // eslint-disable-next-line react-native/no-color-literals
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            backgroundColor: 'transparent',
                            zIndex: 1,
                            pointerEvents: 'none',
                        }}
                    >
                        <ActivityIndicator animating />
                    </View>
                )}
                <View>
                    <CustomButton
                        text="Copier l'ID du personnage"
                        onPress={handleClipboard}
                    />
                </View>
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
    modalOption: {
        padding: theme.space.xl,
        borderRadius: theme.radius.l,
        backgroundColor: theme.colors.light,
        marginBottom: theme.space.md,
        alignItems: 'center',
    },
    modalOptionText: {
        color: theme.colors.textPrimary,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.space.md,
        marginTop: theme.space.l,
    },
});

export default ModalCharacterSettings;
