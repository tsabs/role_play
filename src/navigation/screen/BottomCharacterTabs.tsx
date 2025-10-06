import { useCallback, useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DnDCharacter } from 'types/games/d2d5e';

import BottomBar from '@components/library/BottomBar';
import { callAddNote, callRemoveNote } from '@store/character/slice';
import CharacterOverview from '@views/character/CharacterOverview';
import ChatBot from '@views/chatBot/ChatBot';

import { RootStackParamList } from '../RootNavigation';

import NotesScreen from './NotesScreen';

const BottomNavigator = createBottomTabNavigator();

type BottomCharacterTabsProps = NativeStackScreenProps<
    RootStackParamList,
    'BottomCharacterTabs'
>;

const BottomCharacterTabs = ({ route }: BottomCharacterTabsProps) => {
    const { character, gmId } = route.params;
    const renderOverviewComponent = useCallback(
        () => CharacterOverview({ character: character }),
        [character]
    );

    const bottomBarElements = useMemo(() => {
        if (gmId === undefined) {
            return [
                { icon: 'profile', screenName: 'CharacterOverview' },
                { icon: 'mail', screenName: 'ChatBot' },
                { icon: 'book', screenName: 'NotesScreen' },
            ];
        }
        return [
            { icon: 'profile', screenName: 'CharacterOverview' },
            { icon: 'book', screenName: 'NotesScreen' },
        ];
    }, [gmId]);

    const renderChatbotComponent = useCallback(() => {
        const { race, level, className, selectedClassElements } =
            character as DnDCharacter;
        return ChatBot({
            race: race.index,
            level,
            className: className.index,
            subClassName: selectedClassElements?.selected_subclass,
        });
    }, [character]);

    const renderNotesComponent = useCallback(
        () =>
            NotesScreen({
                entityId: character.id,
                onAddNote: callAddNote,
                onEditNote: callAddNote,
                onRemoveNote: callRemoveNote,
                collectionName: 'characters',
            }),
        [character.id]
    );

    return (
        <BottomNavigator.Navigator
            id={undefined}
            screenOptions={{ animation: 'shift' }}
            tabBar={(props) =>
                BottomBar({
                    elements: bottomBarElements,
                    props,
                })
            }
        >
            <BottomNavigator.Screen
                name="CharacterOverview"
                component={renderOverviewComponent}
                options={{ headerShown: false }}
            />
            {gmId === undefined && (
                <BottomNavigator.Screen
                    name="ChatBot"
                    component={renderChatbotComponent}
                    options={{ headerShown: false }}
                />
            )}
            <BottomNavigator.Screen
                name="NotesScreen"
                component={renderNotesComponent}
                options={{ headerShown: false }}
            />
        </BottomNavigator.Navigator>
    );
};

export default BottomCharacterTabs;
