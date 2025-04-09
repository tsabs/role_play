import React from 'react';
import { Provider } from 'react-redux';
import RootNavigation from './src/navigation/RootNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/navigation/hook/useAuth';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import './src/locales/index';
import { store } from './src/store';

declare global {
    interface AppState {}
}

export default function App() {
    return (
        <Provider store={store}>
            <PaperProvider>
                <AuthProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <NavigationContainer>
                            <RootNavigation />
                            <Toast topOffset={75} />
                        </NavigationContainer>
                    </GestureHandlerRootView>
                </AuthProvider>
            </PaperProvider>
        </Provider>
    );
}
