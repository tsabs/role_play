import { useCallback } from 'react';
import { View } from 'react-native';

import { Character, GAME_TYPE } from '../../../types/generic';
import CharacterOverviewDnd from './CharacterOverviewDnd';

interface CharacterOverviewProps {
    character: Character;
}

const CharacterOverview = ({ character }: CharacterOverviewProps) => {
    const renderCharacterOverview = useCallback(() => {
        switch (character.gameType) {
            case GAME_TYPE.DND5E:
                return <CharacterOverviewDnd character={character} />;
            case GAME_TYPE.WAR_HAMMER:
                return <View />;
        }
    }, [character]);

    return renderCharacterOverview();
};

export default CharacterOverview;
