import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '@navigation/RootNavigation';

import Dnd5eCharacterForm from './dnd5e/Dnd5eCharacterForm';

type CharacterFormProviderProps = NativeStackScreenProps<
    RootStackParamList,
    'CharacterFormProvider'
>;

export const CharacterFormProvider = ({
    route,
}: CharacterFormProviderProps) => {
    const { gameType } = route.params;
    switch (gameType) {
        case 'dnd5e':
            return <Dnd5eCharacterForm gameType={gameType} />;
        default:
            return null;
    }
};
