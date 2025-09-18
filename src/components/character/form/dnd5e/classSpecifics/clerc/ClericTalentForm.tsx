import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SelectedClassElementsProps } from 'types/games/d2d5e';

import CustomText from '@components/atom/CustomText';
import { calculateModifier } from '@utils/d2d5';

import { genericClassFormStyles } from '../../genericStyle';
import DivineSubclass from '../../subclassSpecifics/DivineSubclass';

import { clericSubclasses } from './clericSubclasses';

interface ClericTalentFormProps {
    level: number;
    abilities: Record<string, number>;
    isOnEdit: boolean;
    subclass?: string;
    handleSubclassChoices?: (
        subclassChoices: Record<
            string,
            Array<{ index: string; bonus?: number }>
        >
    ) => void;
    selectedClassElements?: SelectedClassElementsProps;
}
const titleSize = 16;

const ClericTalentForm = ({
    level,
    abilities,
    isOnEdit,
    subclass,
    handleSubclassChoices,
    selectedClassElements,
}: ClericTalentFormProps) => {
    const { t } = useTranslation();
    const wisMod = useMemo(
        () => calculateModifier(abilities['WIS'] ?? 10),
        [abilities]
    );
    const preparedSpells = useMemo(
        () => Math.max(wisMod + level, 1),
        [wisMod, level]
    );

    useEffect(() => {
        handleSubclassChoices({
            ...selectedClassElements?.classChoices,
        });
    }, [handleSubclassChoices, selectedClassElements?.classChoices]);

    return (
        <View style={genericClassFormStyles.container}>
            <CustomText
                style={genericClassFormStyles.title}
                fontSize={titleSize}
                fontWeight="bold"
                text={t('character.classes.cleric.talents.spellcastingTitle')}
            />
            <CustomText
                text={t(
                    'character.classes.cleric.talents.preparedSpellsDescription',
                    { preparedSpells }
                )}
            />
            <CustomText
                text={t(
                    'character.classes.cleric.talents.spellcastingAccessDescription'
                )}
            />

            {level >= 1 && (
                <DivineSubclass
                    subclassData={clericSubclasses(subclass)[subclass]}
                    level={level}
                    type={'cleric'}
                    subclass={subclass}
                />
            )}
        </View>
    );
};

export default ClericTalentForm;
