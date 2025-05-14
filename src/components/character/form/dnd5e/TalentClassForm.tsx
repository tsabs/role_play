import { useCallback } from 'react';

import CustomText from '../../../atom/CustomText';
import BardTalentForm from '../../dnd5e/classSpecifics/BardTalentForm';
import BarbarianTalentForm from '../../dnd5e/classSpecifics/BarbarianTalentForm';
import RangerTalentForm from '../../dnd5e/classSpecifics/RangerTalentForm';
import FighterTalentForm from '../../dnd5e/classSpecifics/FighterTalentForm';
import ClericTalentForm from '../../dnd5e/classSpecifics/ClericTalentForm';
import SorcererTalentForm from '../../dnd5e/classSpecifics/SorcererTalentForm';
import PaladinTalentForm from '../../dnd5e/classSpecifics/PaladinTalentForm';

interface TalentClassFormProps {
    characterClass: string;
    level: number;
    abilities: Record<string, number>;
}

const TalentClassForm = ({
    characterClass,
    level,
    abilities,
}: TalentClassFormProps) => {
    const renderClassSpecific = useCallback(() => {
        switch (characterClass) {
            case 'bard':
                return <BardTalentForm level={level} abilities={abilities} />;
            case 'barbarian':
                return (
                    <BarbarianTalentForm level={level} abilities={abilities} />
                );
            case 'ranger':
                return <RangerTalentForm level={level} />;
            case 'fighter':
                return (
                    <FighterTalentForm
                        level={level}
                        // abilities={abilities}
                    />
                );
            case 'cleric':
                return <ClericTalentForm level={level} abilities={abilities} />;
            case 'sorcerer':
                return (
                    <SorcererTalentForm level={level} abilities={abilities} />
                );
            case 'paladin':
                return (
                    <PaladinTalentForm level={level} abilities={abilities} />
                );
            default:
                return <CustomText text="Class not yet supported." />;
        }
    }, [level, abilities]);

    return renderClassSpecific();
};

export default TalentClassForm;
