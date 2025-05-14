import { GAME_TYPE } from '../../types/generic';
import TalentClassForm from './form/dnd5e/TalentClassForm';
import CustomText from '../atom/CustomText';

interface CharacterTalentClassFormProviderProps {
    gameType: string;
    characterClass: string;
    level: string;
    abilities: Record<string, number>;
}

const CharacterTalentClassFormProvider = ({
    gameType,
    characterClass,
    level,
    abilities,
}: CharacterTalentClassFormProviderProps) => {
    // const { gameType } = route.params;
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
};

export default CharacterTalentClassFormProvider;
