import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../views/login/Login';

import GamesScreen from '../views/games/Games';
import CharactersScreen from '../views/characters/Characters';
import { AuthProvider, useAuth } from './hook/useAuth';
import Character from '../components/character/Character';
import { CharacterFormProvider } from '../components/character/form/CharacterFormProvider';

const BottomNavigator = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export type RootStackParamList = {
    Home: {};
    Login: {};
    Games: {};
    CharacterFormProvider: {
        gameType: string;
    };
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

const BottomTabs = () => {
    return (
        <BottomNavigator.Navigator
            id={undefined}
            screenOptions={{ animation: 'shift' }}
        >
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

const ProtectedScreen = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: true,
                animation: 'fade_from_bottom',
                animationDuration: 500,
            }}
            id={undefined}
        >
            <Stack.Screen
                name="Home"
                component={BottomTabs}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CharacterFormProvider"
                component={CharacterFormProvider}
                options={{ headerShown: false, gestureEnabled: true }}
            />
            <Stack.Screen
                name="Character"
                component={Character}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

const MainStack = () => {
    const user = useAuth();

    return (
        <Stack.Navigator
            id={undefined}
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                animation: 'fade_from_bottom',
                animationDuration: 500,
            }}
        >
            {user ? (
                <Stack.Screen
                    name="ProtectedScreen"
                    component={ProtectedScreen}
                    options={{ headerShown: false, gestureEnabled: true }}
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
