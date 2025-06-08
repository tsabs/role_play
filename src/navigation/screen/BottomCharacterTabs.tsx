import { useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import BottomBar from '../../components/library/BottomBar';
import CharacterOverview from '../../views/singleCharacter/characterOverview/CharacterOverview';
import { RootStackParamList } from '../RootNavigation';

import CharacterNotesScreen from './CharacterNotesScreen';

const BottomNavigator = createBottomTabNavigator();

type BottomCharacterTabsProps = NativeStackScreenProps<
    RootStackParamList,
    'BottomCharacterTabs'
>;

const BottomCharacterTabs = ({ route }: BottomCharacterTabsProps) => {
    const renderOverviewComponent = useCallback(
        () => CharacterOverview({ character: route.params.character }),
        [route.params.character]
    );

    const renderNotesComponent = useCallback(
        () => CharacterNotesScreen({ characterId: route.params.character.id }),
        [route.params.character.id]
    );

    return (
        <BottomNavigator.Navigator
            id={undefined}
            screenOptions={{ animation: 'shift' }}
            tabBar={(props) =>
                BottomBar({
                    elements: [
                        { icon: 'profile', screenName: 'CharacterOverview' },
                        { icon: 'book', screenName: 'CharacterNotesScreen' },
                    ],
                    props,
                })
            }
        >
            <BottomNavigator.Screen
                name="CharacterOverview"
                component={renderOverviewComponent}
                options={{ headerShown: false }}
            />
            <BottomNavigator.Screen
                name="CharacterNotesScreen"
                component={renderNotesComponent}
                options={{ headerShown: false }}
            />
        </BottomNavigator.Navigator>
    );
};

export default BottomCharacterTabs;
