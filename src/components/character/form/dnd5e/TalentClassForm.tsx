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
    level: string;
    abilities: Record<string, number>;
}

const TalentClassForm = ({
    characterClass,
    level,
    abilities,
}: TalentClassFormProps) => {
    const renderClassSpecific = () => {
        const integerLevel = parseInt(level, 10);
        switch (characterClass) {
            case 'bard':
                return (
                    <BardTalentForm
                        level={integerLevel}
                        abilities={abilities}
                    />
                );
            case 'barbarian':
                return (
                    <BarbarianTalentForm
                        level={integerLevel}
                        abilities={abilities}
                    />
                );
            case 'ranger':
                return <RangerTalentForm level={integerLevel} />;
            case 'fighter':
                return (
                    <FighterTalentForm
                        level={integerLevel}
                        // abilities={abilities}
                    />
                );
            case 'cleric':
                return (
                    <ClericTalentForm
                        level={integerLevel}
                        abilities={abilities}
                    />
                );
            case 'sorcerer':
                return (
                    <SorcererTalentForm
                        level={integerLevel}
                        abilities={abilities}
                    />
                );
            case 'paladin':
                return (
                    <PaladinTalentForm
                        level={integerLevel}
                        abilities={abilities}
                    />
                );
            default:
                return <CustomText text="Class not yet supported." />;
        }
    };

    return renderClassSpecific();
};

export default TalentClassForm;
