import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SelectedClassElementsProps } from 'types/games/d2d5e';

import CustomText from '@components/atom/CustomText';
import { ExtractedProficiencies, getAvailableProficiencies } from '@utils/d2d5';

import { loreProficiencyData } from '../../classSpecifics/bard/bardSubclasses';
import ProficiencySelector from '../../proficiencies/ProficiencySelector';

interface BardSubclassProps {
    subclass: string;
    proficienciesExtracted: ExtractedProficiencies;
    selectedClassElements: SelectedClassElementsProps;
    isOnEdit: boolean;
    handleSubclassChoices: (
        subclassChoices: Record<
            string,
            Array<{ index: string; bonus?: number }>
        >
    ) => void;
    level: number;
}

const BardLore = ({
    subclass,
    proficienciesExtracted,
    selectedClassElements,
    isOnEdit,
    handleSubclassChoices,
    level,
}: BardSubclassProps) => {
    const { t } = useTranslation();

    const loreProficienciesSelected = useMemo(
        () => selectedClassElements?.classChoices?.['lore-extra-proficiencies'],
        [selectedClassElements?.classChoices]
    );

    const [proficienciesSelected, setProficienciesSelected] = useState(
        loreProficienciesSelected
    );

    const selectableProficiencies = useMemo(
        () =>
            getAvailableProficiencies(
                loreProficiencyData,
                proficienciesExtracted,
                ['fromSelectedSubclass']
            ),
        [proficienciesExtracted]
    );

    const handleChangeExtraProficiencies = useCallback(
        (
            groupId: string,
            selected: Array<{ index: string; bonus?: number }>
        ) => {
            const result: Record<
                string,
                Array<{ index: string; bonus?: number }>
            > = {
                ...selectedClassElements.classChoices,
                [groupId]: selected,
            };
            setProficienciesSelected(selected);
            handleSubclassChoices(result);
        },
        [handleSubclassChoices, selectedClassElements.classChoices]
    );

    if (!subclass) return null;

    return isOnEdit ? (
        level >= 3 && (
            <ProficiencySelector
                data={selectableProficiencies}
                groupId={`lore-extra-proficiencies`}
                defaultValue={proficienciesSelected}
                onChange={handleChangeExtraProficiencies}
            />
        )
    ) : !!proficienciesSelected ? (
        <View style={{ flexDirection: 'row', gap: 6 }}>
            <CustomText text="Selection: " />
            {proficienciesSelected.map((proficiency) => (
                <CustomText
                    fontWeight="bold"
                    key={proficiency.index}
                    text={t(`character.skills.${proficiency.index}.name`)}
                />
            ))}
        </View>
    ) : (
        <CustomText text="Selectionner trois maitrises supplémentaires" />
    );
};

export default BardLore;
