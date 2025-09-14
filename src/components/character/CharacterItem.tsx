import { useCallback } from 'react';
import { Character, GAME_TYPE } from 'types/generic';

import DndCharacterItem from './dnd5e/DndCharacterItem';
import WHCharacterItem from './warHammer/WHCharacterItem';

interface CharacterItemProps {
    character: Character;
    index: number;
    mode: string;
    sessionId?: string;
    gmId?: string;
}

const CharacterItem = ({
    character,
    index,
    mode,
    sessionId,
    gmId,
}: CharacterItemProps) => {
    const renderCharacterItem = useCallback(() => {
        switch (character.gameType) {
            case GAME_TYPE.DND5E:
                return (
                    <DndCharacterItem
                        character={character}
                        index={index}
                        mode={mode}
                        sessionId={sessionId}
                        gmId={gmId}
                    />
                );
            case GAME_TYPE.WAR_HAMMER:
                return <WHCharacterItem character={character} index={index} />;
        }
    }, [character, gmId, index, mode, sessionId]);

    return renderCharacterItem();
};

export default CharacterItem;
