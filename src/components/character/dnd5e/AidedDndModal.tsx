import { useCallback, useMemo, useRef, useState } from 'react';
import { Modal } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Animated, { FadeIn } from 'react-native-reanimated';

import CustomButton from '@components/atom/CustomButton';
import { WINDOW_WIDTH } from '@utils/utils';

import { theme } from '../../../../style/theme';

interface AidedDndModalProps {
    shouldShowModal: boolean;
    setShouldShowModal: (val: boolean) => void;
    type: 'monsters' | 'classes';
    name?: string;
}

export const AidedDndModal = ({
    shouldShowModal,
    setShouldShowModal,
    type,
    name,
}: AidedDndModalProps) => {
    const webviewRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleDismiss = useCallback(() => {
        setShouldShowModal(false);
    }, [setShouldShowModal]);

    const uri = useMemo(() => {
        switch (type) {
            case 'monsters':
                return `https://www.aidedd.org/dnd/monstres.php?vo=${name}`;
            case 'classes':
                return `https://www.aidedd.org/regles/classes/${name}/`;
        }
    }, [name, type]);

    if (!name) return;

    return (
        <Modal
            visible={shouldShowModal}
            onDismiss={handleDismiss}
            contentContainerStyle={styles(isLoading).modalContainer}
        >
            <Animated.View style={{ flex: 1 }} entering={FadeIn.duration(500)}>
                <WebView
                    ref={webviewRef}
                    source={{
                        uri,
                    }}
                    onLoadEnd={() => setIsLoading(false)}
                    style={styles(isLoading).webview}
                    incognito
                    cacheEnabled={false}
                    startInLoadingState
                    javaScriptEnabled={false}
                    domStorageEnabled
                />
                <CustomButton text="Close" onPress={handleDismiss} />
            </Animated.View>
        </Modal>
    );
};

const styles = (isLoading: boolean) =>
    StyleSheet.create({
        modalContainer: {
            backgroundColor: isLoading
                ? theme.colors.transparent
                : theme.colors.white,
            padding: theme.space.xxxl,
            marginVertical: 50,
            marginHorizontal: theme.space.xxl,
            borderRadius: theme.radius.md,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
        },
        webview: {
            flex: 1,
            width: WINDOW_WIDTH - 40,
        },
    });
