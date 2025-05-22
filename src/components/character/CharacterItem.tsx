import { useCallback } from 'react';

import { Character, GAME_TYPE } from '../../types/generic';
import DndCharacterItem from './dnd5e/DndCharacterItem';
import WHCharacterItem from './warHammer/WHCharacterItem';

interface CharacterItemProps {
    character: Character;
    index: number;
}

const CharacterItem = ({ character, index }: CharacterItemProps) => {
    const renderCharacterItem = useCallback(() => {
        switch (character.gameType) {
            case GAME_TYPE.DND5E:
                return <DndCharacterItem character={character} index={index} />;
            case GAME_TYPE.WAR_HAMMER:
                return <WHCharacterItem character={character} index={index} />;
        }
    }, []);

    return renderCharacterItem();
};

export default CharacterItem;
