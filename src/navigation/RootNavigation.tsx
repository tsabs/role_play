import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../views/login/Login';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GamesScreen from '../views/games/Games';
import CharactersScreen from '../views/characters/Characters';
import { AuthProvider, AuthContext } from '../components/auth/AuthProvider';

const BottomNavigator = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

type RootStackParamList = {
    Home: {};
    Login: {};
    Games: {};
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

const BottomTabs = () => {
    return (
        <BottomNavigator.Navigator id={undefined}>
            <BottomNavigator.Screen
                name="Games"
                component={GamesScreen}
                options={{ headerShown: false }}
            />
            <BottomNavigator.Screen
                name="Characters"
                component={CharactersScreen}
                options={{ headerShown: false }}
            />
        </BottomNavigator.Navigator>
    );
};
const MainStack = () => {
    const user = useContext(AuthContext);

    return (
        <Stack.Navigator
            id={undefined}
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_bottom',
            }}
        >
            {user ? (
                <Stack.Screen
                    name="Home"
                    component={BottomTabs}
                    options={{ headerShown: false }}
                />
            ) : (
                <Stack.Screen
                    name={'Login'}
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
            )}
        </Stack.Navigator>
    );
};

export default function RouteNavigation() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <MainStack />
            </NavigationContainer>
        </AuthProvider>
    );
}
