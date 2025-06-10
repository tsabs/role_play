import { Modal, TouchableRipple } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';

import CustomText from '@components/atom/CustomText.tsx';

import { theme } from '../../../style/theme.ts';

interface ModalSelectGameProp {
    shouldShowModal: boolean;
    setShouldShowModal: (val: boolean) => void;
    handleNavigation: () => void;
}

const ModalSelectGame = ({
    shouldShowModal,
    setShouldShowModal,
    handleNavigation,
}: ModalSelectGameProp) => {
    const { t } = useTranslation();
    return (
        <Modal
            visible={shouldShowModal}
            onDismiss={() => setShouldShowModal(false)}
            contentContainerStyle={styles.modalContainer}
        >
            <Animated.View style={{ alignItems: 'center' }} entering={FadeIn}>
                <CustomText
                    text={
                        t('characters.selectGameTitle') ||
                        'Choose a game system'
                    }
                    fontSize={theme.fontSize.big}
                    style={styles.modalTitle}
                />
                <TouchableRipple
                    onPress={() => {
                        setShouldShowModal(false);
                        // Navigate to D&D character creation
                        handleNavigation();
                    }}
                    rippleColor={theme.colors.primary25}
                    style={styles.modalOption}
                >
                    <CustomText
                        text="🧙 Dungeons & Dragons"
                        fontSize={theme.fontSize.large}
                        style={styles.modalOptionText}
                    />
                </TouchableRipple>

                {/* Future options */}
                <TouchableRipple
                    onPress={() => {}}
                    rippleColor={theme.colors.secondary25}
                    style={[styles.modalOption, styles.disabledOption]}
                >
                    <CustomText
                        text="⚔️ Warhammer (coming soon)"
                        fontSize={theme.fontSize.large}
                        style={styles.modalOptionText}
                    />
                </TouchableRipple>
                <TouchableRipple
                    onPress={() => {}}
                    rippleColor={theme.colors.secondary25}
                    style={[styles.modalOption, styles.disabledOption]}
                >
                    <CustomText
                        text="🕵️ Call of Cthulhu (coming soon)"
                        fontSize={theme.fontSize.large}
                        style={styles.modalOptionText}
                    />
                </TouchableRipple>
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
        // width: '100%',
        padding: theme.space.xl,
        borderRadius: theme.radius.l,
        backgroundColor: theme.colors.light,
        marginBottom: theme.space.md,
        alignItems: 'center',
    },

    modalOptionText: {
        color: theme.colors.textPrimary,
    },

    disabledOption: {
        opacity: 0.6,
    },
});

export default ModalSelectGame;
