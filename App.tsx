import React from 'react';
import RootNavigation from './src/navigation/RootNavigation';
import { LOGIN_MODULE_KEY } from './src/store/constants';
import { Provider } from 'react-redux';
import { store } from './src/store';

declare global {
    interface AppState {}
}

export default function App() {
    return (
        <Provider store={store}>
            <RootNavigation />
        </Provider>
    );
}
