import { useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import BottomBar from '../../components/library/BottomBar';
import CharacterOverview from '../../views/singleCharacter/CharacterOverview';
import CharacterNotes from '../../views/singleCharacter/CharacterNotes';
import { RootStackParamList } from '../RootNavigation';

const BottomNavigator = createBottomTabNavigator();

type BottomCharacterTabsProps = NativeStackScreenProps<
    RootStackParamList,
    'BottomCharacterTabs'
>;

const BottomCharacterTabs = ({ route }: BottomCharacterTabsProps) => {
    const renderComponent = useCallback(
        () => CharacterOverview({ character: route.params.character }),
        []
    );

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
                component={renderComponent}
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

export default BottomCharacterTabs;
