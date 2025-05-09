import { useCallback } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import TopBar from '../../components/library/TopBar';
import CharacterNotes from '../../views/singleCharacter/CharacterNotes';
import CharacterHistoryNotes from '../../views/singleCharacter/CharacterHistoryNotes';

const Tab = createMaterialTopTabNavigator();

export const CharacterNotesScreen = ({
    characterId,
}: {
    characterId: string;
}) => {
    console.log('ID', characterId);
    const renderNotesComponent = useCallback(
        () => CharacterNotes({ characterId }),
        []
    );
    const renderHistoryNotesComponent = useCallback(
        () => CharacterHistoryNotes({ characterId }),
        []
    );
    return (
        <Tab.Navigator
            id={undefined}
            initialRouteName="CharacterNotes"
            screenOptions={{
                tabBarActiveTintColor: '#e91e63',
                tabBarLabelStyle: { fontSize: 12 },
                tabBarStyle: { backgroundColor: 'powderblue' },
            }}
            // lazy={true}
            tabBar={(props) =>
                TopBar({
                    elements: [
                        { text: 'Note', screenName: 'CharacterNotes' },
                        {
                            text: 'Historique',
                            screenName: 'CharacterHistoryNotes',
                        },
                    ],
                    props,
                })
            }
        >
            <Tab.Screen
                // lazy={true}
                name="CharacterNotes"
                component={renderNotesComponent}
                // options={{ headerShown: true }}
            />
            <Tab.Screen
                // lazy={true}
                name="CharacterHistoryNotes"
                component={renderHistoryNotesComponent}
                // options={{ headerShown: true }}
            />
        </Tab.Navigator>
    );
};

export default CharacterNotesScreen;
