import { Fragment } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomSessionTabs from '@navigation/screen/BottomSessionTabs';

import BottomBar from '../components/library/BottomBar';
import CharacterItem from '../components/character/CharacterItem';
import { CharacterFormProvider } from '../components/character/form/CharacterFormProvider';
import { Character } from '../types/generic';
import LoginScreen from '../views/login/Login';
import SessionsScreen from '../views/sessions/Sessions';
import CharactersScreen from '../views/characters/Characters';
import { SessionCharactersScreen } from '../views/sessions/SessionCharacters';
import { AccordionContentModal } from '../views/character/AccordionModal';

import BottomCharacterTabs from './screen/BottomCharacterTabs';
import { AuthProps, useAuth } from './hook/useAuth';

const BottomNavigator = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export type RootStackParamList = {
    Home: {};
    Login: {};
    Sessions: {};
    Characters: {
        sessionId?: string;
        gmId?: string;
    };
    SessionCharacters: {
        sessionId: string;
        gmId: string;
    };
    SessionNotesScreen: {
        sessionId: string;
        gmId: string;
    };
    AccordionModal: {
        accordionId: number;
        characterId: string;
        title: string;
        content: any;
    };
    ProtectedScreen: {};
    CharacterFormProvider: {
        gameType: string;
    };
    NotesScreen: {
        entityId: string;
    };
    BottomSessionTabs: {
        sessionId: string;
        gmId: string;
    };
    ChatBot: {};
    BottomCharacterTabs: {
        character: Character;
        sessionId?: string;
        gmId?: string;
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
                        { icon: 'rocket1', screenName: 'Sessions' },
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
                name="Sessions"
                component={SessionsScreen}
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
                animation: 'slide_from_right',
                animationDuration: 750,
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
                name="AccordionModal"
                component={AccordionContentModal}
                options={{
                    animationDuration: 750,
                    gestureEnabled: true,
                    animation: 'slide_from_bottom',
                    presentation: 'modal',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Character"
                component={CharacterItem}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SessionCharacters"
                component={SessionCharactersScreen}
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
                animation: 'slide_from_right',
                animationDuration: 750,
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
                        options={{ animation: 'slide_from_right' }}
                    />
                    <Stack.Screen
                        name={'BottomSessionTabs'}
                        component={BottomSessionTabs}
                        options={{ animation: 'slide_from_right' }}
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
