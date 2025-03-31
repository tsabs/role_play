import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../views/login/Login';

import GamesScreen from '../views/games/Games';
import CharactersScreen from '../views/characters/Characters';
import { AuthProps, AuthProvider, useAuth } from './hook/useAuth';
import CharacterItem from '../components/character/CharacterItem';
import { CharacterFormProvider } from '../components/character/form/CharacterFormProvider';
import BottomBar from '../components/library/BottomBar';
import CharacterOverview from '../views/singleCharacter/CharacterOverview';
import CharacterNotes from '../views/singleCharacter/CharacterNotes';
import { Fragment } from 'react';

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
    BottomCharacterTabs: {};
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

const BottomCharacterTabs = () => {
    return (
        <BottomNavigator.Navigator
            id={undefined}
            screenOptions={{ animation: 'shift' }}
            tabBar={(props) =>
                BottomBar({
                    elements: [
                        { icon: 'profile', screenName: 'CharacterOverview' },
                        { icon: 'book', screenName: 'CharacterNotes' },
                    ],
                    props,
                })
            }
        >
            <BottomNavigator.Screen
                name="CharacterOverview"
                component={CharacterOverview}
                options={{ headerShown: false }}
            />
            <BottomNavigator.Screen
                name="CharacterNotes"
                component={CharacterNotes}
                options={{ headerShown: false }}
            />
        </BottomNavigator.Navigator>
    );
};

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
                animationDuration: 500,
            }}
        >
            {auth?.user ? (
                <Fragment>
                    <Stack.Screen
                        name="ProtectedScreen"
                        component={ProtectedScreen}
                        options={{ headerShown: false, gestureEnabled: true }}
                    />
                    <Stack.Screen
                        name={'BottomCharacterTabs'}
                        component={BottomCharacterTabs}
                    />
                </Fragment>
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
