import { Dialog, Portal, Text } from 'react-native-paper';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { theme } from '../../../style/theme';

const CustomDialog = ({
    title,
    isVisible,
    setIsVisible,
    triggerAction,
    description,
}: {
    title: string;
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    triggerAction?: () => void;
    description?: string;
}) => {
    const { t } = useTranslation();
    const handleConfirm = useCallback(() => {
        if (triggerAction) {
            triggerAction();
        }
        setIsVisible(false);
    }, [setIsVisible, triggerAction]);
    return (
        <Portal>
            <Dialog visible={isVisible} onDismiss={() => setIsVisible(false)}>
                <Dialog.Title>{title}</Dialog.Title>
                {description && (
                    <Dialog.Content>
                        {<Text>{description}</Text>}
                    </Dialog.Content>
                )}
                <Dialog.Actions style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleConfirm}
                    >
                        <Text style={styles.buttonText}>
                            {t('modal.confirmAction')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setIsVisible(false)}
                    >
                        <Text style={styles.buttonText}>
                            {t('modal.cancelAction')}
                        </Text>
                    </TouchableOpacity>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export const styles = StyleSheet.create({
    buttonContainer: {
        gap: theme.space.sm,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    button: {
        padding: theme.space.md,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.primary,
    },
    buttonText: {
        color: theme.colors.white,
    },
});

export default CustomDialog;
