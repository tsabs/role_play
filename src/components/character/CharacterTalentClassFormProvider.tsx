import { useCallback } from 'react';

import { GAME_TYPE } from '../../types/generic';
import CustomText from '../atom/CustomText';

import TalentClassForm from './form/dnd5e/TalentClassForm';

interface CharacterTalentClassFormProviderProps {
    gameType: string;
    characterClass: string;
    level: number;
    abilities: Record<string, number>;
}

const CharacterTalentClassFormProvider = ({
    gameType,
    characterClass,
    level,
    abilities,
}: CharacterTalentClassFormProviderProps) => {
    const renderCharTalentCLass = useCallback(() => {
        switch (gameType) {
            case GAME_TYPE.DND5E:
                return (
                    <TalentClassForm
                        abilities={abilities}
                        level={level}
                        characterClass={characterClass}
                    />
                );
            case GAME_TYPE.WAR_HAMMER:
                return <CustomText text="Warhammer not supported yet." />;
        }
    }, [gameType, characterClass, level, abilities]);

    return renderCharTalentCLass();
};

export default CharacterTalentClassFormProvider;
