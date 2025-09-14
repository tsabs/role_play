import { useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import BottomBar from '@components/library/BottomBar';
import {
    addSessionNote,
    removeSessionNote,
    updateSessionNote,
} from '@store/session/sessionServices';
import { SessionCharactersScreen } from '@views/sessions/SessionCharacters';

import { RootStackParamList } from '../RootNavigation';

import NotesScreen from './NotesScreen.tsx';

const BottomNavigator = createBottomTabNavigator();

type BottomSessionTabsProps = NativeStackScreenProps<
    RootStackParamList,
    'BottomSessionTabs'
>;

const BottomSessionTabs = ({ route }: BottomSessionTabsProps) => {
    const { sessionId, gmId } = route.params;
    const renderSessionCharacterComponent = useCallback(
        () =>
            SessionCharactersScreen({
                route: { params: { sessionId, gmId } },
            } as any),
        [gmId, sessionId]
    );

    const renderNotesComponent = useCallback(
        () =>
            NotesScreen({
                entityId: sessionId,
                onAddNote: addSessionNote,
                onEditNote: updateSessionNote,
                onRemoveNote: removeSessionNote,
                collectionName: 'session',
            }),
        [sessionId]
    );

    return (
        <BottomNavigator.Navigator
            id={undefined}
            screenOptions={{ animation: 'shift' }}
            tabBar={(props) =>
                BottomBar({
                    elements: [
                        { icon: 'profile', screenName: 'SessionCharacters' },
                        { icon: 'book', screenName: 'NotesScreen' },
                    ],
                    props,
                })
            }
        >
            <BottomNavigator.Screen
                name="SessionCharacters"
                component={renderSessionCharacterComponent}
                options={{ headerShown: false }}
            />
            <BottomNavigator.Screen
                name="NotesScreen"
                component={renderNotesComponent}
                options={{ headerShown: false }}
            />
        </BottomNavigator.Navigator>
    );
};

export default BottomSessionTabs;
