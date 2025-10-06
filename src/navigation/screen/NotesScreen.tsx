import { Dispatch, useCallback } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Note } from 'types/note';

import Notes from '@views/notes/Notes.tsx';
import HistoryNotes from '@views/notes/HistoryNotes.tsx';

import TopBar from '../../components/library/TopBar';

const Tab = createMaterialTopTabNavigator();

interface NotesScreenProps {
    entityId: string;
    onAddNote: (
        entityId: string,
        note: Note,
        dispatch: Dispatch<any>
    ) => Promise<void>;
    onEditNote: (
        entityId: string,
        updatedNote: Note,
        dispatch: Dispatch<any>
    ) => Promise<void>;
    onRemoveNote: (
        entityId: string,
        noteId: string,
        dispatch: Dispatch<any>
    ) => Promise<void>;
    collectionName: string;
}

export const NotesScreen = ({
    entityId,
    onAddNote,
    onEditNote,
    onRemoveNote,
    collectionName,
}: NotesScreenProps) => {
    console.log('ID', entityId);
    const renderNotesComponent = useCallback(
        () => Notes({ entityId, onAddNote }),
        [entityId, onAddNote]
    );
    const renderHistoryNotesComponent = useCallback(
        () =>
            HistoryNotes({
                entityId,
                onEditNote,
                onRemoveNote,
                collectionName,
            }),
        [collectionName, entityId, onEditNote, onRemoveNote]
    );
    return (
        <Tab.Navigator
            id={undefined}
            initialRouteName="Notes"
            screenOptions={{
                tabBarActiveTintColor: '#e91e63',
                tabBarLabelStyle: { fontSize: 12 },
                tabBarStyle: { backgroundColor: 'powderblue' },
            }}
            tabBar={(props) =>
                TopBar({
                    elements: [
                        { text: 'Note', screenName: 'Notes' },
                        {
                            text: 'Historique',
                            screenName: 'HistoryNotes',
                        },
                    ],
                    props,
                })
            }
        >
            <Tab.Screen
                // lazy={true}
                name="Notes"
                component={renderNotesComponent}
                // options={{ headerShown: true }}
            />
            <Tab.Screen
                // lazy={true}
                name="HistoryNotes"
                component={renderHistoryNotesComponent}
                // options={{ headerShown: true }}
            />
        </Tab.Navigator>
    );
};

export default NotesScreen;
