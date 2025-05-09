import { Fragment, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../views/login/Login';
import GamesScreen from '../views/games/Games';
import CharactersScreen from '../views/characters/Characters';
import { AuthProps, useAuth } from './hook/useAuth';
import CharacterItem from '../components/character/CharacterItem';
import { CharacterFormProvider } from '../components/character/form/CharacterFormProvider';
import BottomBar from '../components/library/BottomBar';
import BottomCharacterTabs from './screen/BottomCharacterTabs';
import { Character } from '../types/generic';

const BottomNavigator = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export type RootStackParamList = {
    Home: {};
    Login: {};
    Games: {};
    Characters: {};
    ProtectedScreen: {};
    CharacterFormProvider: {
        gameType: string;
    };
    CharacterNotesScreen: {
        characterId: string;
    };
    BottomCharacterTabs: {
        character: Character;
    };
    CharacterNotes: {};
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
            tabBar={(props) =>
                BottomBar({
                    elements: [
                        { icon: 'adduser', screenName: 'Characters' },
                        { icon: 'rocket1', screenName: 'Games' },
                    ],
                    props,
                })
            }
        >
            <BottomNavigator.Screen
                name="Characters"
                component={CharactersScreen}
                options={{ headerShown: false }}
            />
            <BottomNavigator.Screen
                name="Games"
                component={GamesScreen}
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
                animationDuration: 1000,
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
                component={CharacterItem}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

const MainStack = () => {
    const auth: AuthProps = useAuth();

    return (
        <Stack.Navigator
            id={undefined}
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                animation: 'fade_from_bottom',
                animationDuration: 1000,
            }}
        >
            {auth?.user?.uid ? (
                <Fragment>
                    <Stack.Screen
                        name="ProtectedScreen"
                        component={ProtectedScreen}
                        options={{ headerShown: false, gestureEnabled: true }}
                    />
                    <Stack.Screen
                        name={'BottomCharacterTabs'}
                        component={BottomCharacterTabs}
                        options={{ animation: 'default' }}
                    />
                </Fragment>
            ) : (
                <Stack.Screen
                    name={'Login'}
                    component={LoginScreen}
                    options={{ headerShown: false, animation: 'fade' }}
                />
            )}
        </Stack.Navigator>
    );
};

export default function RouteNavigation() {
    return <MainStack />;
}
