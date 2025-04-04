import React from 'react';
import RootNavigation from './src/navigation/RootNavigation';
import './src/locales/index';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { PaperProvider } from 'react-native-paper';

declare global {
    interface AppState {}
}

export default function App() {
    return (
        <Provider store={store}>
            <PaperProvider>
                <RootNavigation />
            </PaperProvider>
        </Provider>
    );
}
