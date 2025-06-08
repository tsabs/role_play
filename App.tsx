import React, { useCallback } from 'react';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import { AuthProvider } from './src/navigation/hook/useAuth';
import RootNavigation from './src/navigation/RootNavigation';
import './src/locales/index';
import { store } from './src/store';

declare global {
    interface AppState {}
}

const paperTheme = {
    ...DefaultTheme,
    // colors: {
    //     ...DefaultTheme.colors,
    //     // etc.
    // },
};

export default function App() {
    const onHideToaster = useCallback(() => {
        //
        Toast.hide();
    }, []);

    return (
        <Provider store={store}>
            <PaperProvider theme={paperTheme}>
                <AuthProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <NavigationContainer>
                            <RootNavigation />
                            <Toast onPress={onHideToaster} topOffset={75} />
                        </NavigationContainer>
                    </GestureHandlerRootView>
                </AuthProvider>
            </PaperProvider>
        </Provider>
    );
}
