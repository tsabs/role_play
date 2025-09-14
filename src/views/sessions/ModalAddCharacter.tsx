import { Dispatch, useCallback, useState } from 'react';
import { Modal, TextInput } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import CustomButton from '@components/atom/CustomButton';
import CustomText from '@components/atom/CustomText';

import { theme } from '../../../style/theme';

export const ModalAddCharacter = ({
    shouldShowModal,
    setShouldShowModal,
    handleAddCharacter,
}: {
    shouldShowModal: boolean;
    setShouldShowModal: Dispatch<any>;
    handleAddCharacter: (characterId: string) => void;
}) => {
    const [text, setText] = useState('');

    const handleChangeText = useCallback((t: string) => {
        setText(t);
    }, []);

    return (
        <Modal
            visible={shouldShowModal}
            onDismiss={() => setShouldShowModal(false)}
            contentContainerStyle={styles.modalContainer}
        >
            <Animated.View entering={FadeIn}>
                <View style={styles.modalTitle}>
                    <CustomText
                        text="ID du personnage à inviter"
                        fontSize={theme.fontSize.large}
                    />
                    <TextInput value={text} onChangeText={handleChangeText} />
                </View>
                <CustomButton
                    disabled={!text}
                    text="Ajouter l'utilisateur"
                    onPress={() => handleAddCharacter(text)}
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
        // gap: theme.space.sm,
        // borderRadius: theme.radius.xxl,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    modalTitle: {
        marginBottom: theme.space.xxl,
        color: theme.colors.textPrimary,
    },
});
