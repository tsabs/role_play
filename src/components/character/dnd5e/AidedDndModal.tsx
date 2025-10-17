import {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { IconButton, Modal, TextInput } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Animated, { FadeIn } from 'react-native-reanimated';

import CustomButton from '@components/atom/CustomButton';
import { WINDOW_WIDTH } from '@utils/utils';

import { theme } from '../../../../style/theme';

import { injectedDndSearchModal, makeHighlightScript } from './utils';

interface AidedDndModalProps {
    shouldShowModal: boolean;
    setShouldShowModal: (val: boolean) => void;
    type: 'monsters' | 'classes' | 'spells';
    is2024?: boolean;
    name?: string;
    language?: 'vo' | 'vf';
    hasSearch?: boolean;
}

export const AidedDndModal = ({
    shouldShowModal,
    setShouldShowModal,
    type,
    is2024,
    name,
    language = 'vo',
    hasSearch = false,
}: AidedDndModalProps) => {
    const webviewRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [highlightCount, setHighlightCount] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    // key to force remount on each open so injectedJavaScriptBeforeContentLoaded always runs
    const [webviewKey, setWebviewKey] = useState<number>(() => Date.now());

    useEffect(() => {
        if (shouldShowModal) {
            // new key each time modal opens to force a fresh WebView instance
            setIsLoading(true);
            if (hasSearch) {
                setWebviewKey(Date.now());
                setHighlightCount(0);
                setCurrentIndex(0);
                setQuery('');
            }
        }
    }, [shouldShowModal, name, type, language, hasSearch]);

    const onSearch = useCallback(() => {
        if (!query || !hasSearch) return;

        const jsCode = makeHighlightScript(query);
        webviewRef.current.injectJavaScript(jsCode);
    }, [hasSearch, query]);

    const onNext = useCallback(() => {
        const jsCode = `
            (function() {
              if (!window.__marks || window.__marks.length === 0) return;
              window.__currentIndex = (window.__currentIndex + 1) % window.__marks.length;
              const marks = window.__marks;
              marks.forEach(m => m.style.background = 'yellow');
              const current = marks[window.__currentIndex];
              current.style.background = 'orange';
              current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'CURRENT_INDEX',
                index: window.__currentIndex
              }));
            })();
            true;
      `;
        webviewRef.current.injectJavaScript(jsCode);
    }, []);

    const onPrev = useCallback(() => {
        const jsCode = `
            (function() {
              if (!window.__marks || window.__marks.length === 0) return;
              window.__currentIndex = (window.__currentIndex - 1 + window.__marks.length) % window.__marks.length;
              const marks = window.__marks;
              marks.forEach(m => m.style.background = 'yellow');
              const current = marks[window.__currentIndex];
              current.style.background = 'orange';
              current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'CURRENT_INDEX',
                index: window.__currentIndex
              }));
            })();
            true;
      `;
        webviewRef.current.injectJavaScript(jsCode);
    }, []);

    const onClear = useCallback(() => {
        const jsCode = `
            (function() {
              if (!window.__marks) return;
              document.querySelectorAll('mark[data-highlight]').forEach(m => {
                const parent = m.parentNode;
                parent.replaceChild(document.createTextNode(m.textContent), m);
                parent.normalize();
              });
              window.__marks = [];
              window.__currentIndex = 0;
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'HIGHLIGHT_COUNT',
                count: 0
              }));
            })();
            true;
      `;
        webviewRef.current.injectJavaScript(jsCode);
        setHighlightCount(0);
        setCurrentIndex(0);
        setQuery('');
    }, []);

    const handleDismiss = useCallback(() => {
        setShouldShowModal(false);
    }, [setShouldShowModal]);

    const uri = useMemo(() => {
        switch (type) {
            case 'monsters':
                return `https://www.aidedd.org/dnd/monstres.php?${language}=${name}`;
            case 'classes':
                return `https://www.aidedd.org/regles/classes/${name}/`;
            case 'spells':
                if (is2024) {
                    switch (language) {
                        case 'vo':
                            return `https://www.aidedd.org/spell/${name}`;
                        case 'vf':
                            return `https://www.aidedd.org/spell/fr/${name}`;
                    }
                }
                return `https://www.aidedd.org/dnd/sorts.php?${language}=${name}`;
        }
    }, [is2024, language, name, type]);

    if (!name) return;

    return (
        <Modal
            visible={shouldShowModal}
            onDismiss={handleDismiss}
            contentContainerStyle={styles(isLoading).modalContainer}
        >
            <Animated.View style={{ flex: 1 }} entering={FadeIn.duration(500)}>
                {hasSearch && (
                    <View style={styles(isLoading).searchBar}>
                        <TextInput
                            style={styles(isLoading).input}
                            placeholder="Recherche..."
                            value={query}
                            onChangeText={setQuery}
                        />
                        <View
                            style={[
                                styles(isLoading).navBar,
                                { flexDirection: 'row' },
                            ]}
                        >
                            <IconButton icon="magnify" onPress={onSearch} />
                            {highlightCount > 0 && (
                                <Fragment>
                                    <IconButton
                                        icon="chevron-up"
                                        onPress={onPrev}
                                    />
                                    <IconButton
                                        icon="chevron-down"
                                        onPress={onNext}
                                    />
                                </Fragment>
                            )}
                            <IconButton
                                icon="trash-can-outline"
                                onPress={onClear}
                            />
                        </View>
                    </View>
                )}
                <WebView
                    key={webviewKey}
                    ref={webviewRef}
                    source={{
                        uri,
                    }}
                    onLoadEnd={() => setIsLoading(false)}
                    style={styles(isLoading).webview}
                    incognito
                    cacheEnabled={false}
                    startInLoadingState
                    injectedJavaScriptBeforeContentLoaded={
                        injectedDndSearchModal
                    }
                    originWhitelist={['*']}
                    javaScriptEnabled
                    domStorageEnabled
                    onMessage={(event) => {
                        try {
                            const data = JSON.parse(event.nativeEvent.data);
                            if (data.type === 'HIGHLIGHT_COUNT') {
                                setHighlightCount(data.count);
                                setCurrentIndex(0);
                            } else if (data.type === 'CURRENT_INDEX') {
                                setCurrentIndex(data.index);
                            }
                        } catch (e) {
                            console.log(
                                'Non-JSON message from webview',
                                event.nativeEvent.data
                            );
                        }
                    }}
                />
                <CustomButton text="Fermer" onPress={handleDismiss} />
            </Animated.View>
        </Modal>
    );
};

const styles = (isLoading: boolean) =>
    StyleSheet.create({
        searchBar: {
            flexDirection: 'row',
            padding: 8,
            backgroundColor: theme.colors.light,
        },
        input: {
            flex: 1,
            backgroundColor: theme.colors.white,
            borderWidth: 1,
            borderColor: theme.colors.light,
            borderRadius: 8,
            paddingHorizontal: 8,
            marginRight: 8,
        },
        navBar: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
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
