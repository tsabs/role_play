import { Fragment, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SelectedClassElementsProps } from 'types/games/d2d5e';

import CustomText from '@components/atom/CustomText';
import { ExtractedProficiencies, getAvailableProficiencies } from '@utils/d2d5';

import {
    bardSubclasses,
    loreProficiencyData,
} from '../classSpecifics/bard/bardSubclasses';
import { genericClassFormStyles } from '../classSpecifics/genericStyle';
import ProficiencySelector from '../proficiencies/ProficiencySelector';

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

const BardSubclass = ({
    subclass,
    proficienciesExtracted,
    selectedClassElements,
    isOnEdit,
    handleSubclassChoices,
    level,
}: BardSubclassProps) => {
    const { t } = useTranslation();

    const data = useMemo(
        () => bardSubclasses[subclass as keyof typeof bardSubclasses],
        [subclass]
    );

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

    const handleChange = useCallback(
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

    const displaySubClassSpecifics = useCallback(() => {
        if (subclass === 'lore') {
            return isOnEdit ? (
                level >= 3 && (
                    <ProficiencySelector
                        data={selectableProficiencies}
                        groupId={`lore-extra-proficiencies`}
                        defaultValue={proficienciesSelected}
                        onChange={handleChange}
                    />
                )
            ) : !!proficienciesSelected ? (
                <View style={{ flexDirection: 'row', gap: 6 }}>
                    <CustomText text="Selection: " />
                    {proficienciesSelected.map((proficiency) => (
                        <CustomText
                            fontWeight="bold"
                            key={proficiency.index}
                            text={t(
                                `character.skills.${proficiency.index}.name`
                            )}
                        />
                    ))}
                </View>
            ) : (
                <CustomText text="Selectionner trois maitrises supplémentaires" />
            );
        }
    }, [
        handleChange,
        isOnEdit,
        level,
        proficienciesSelected,
        selectableProficiencies,
        subclass,
        t,
    ]);

    if (!subclass || !(subclass in bardSubclasses)) return null;

    console.log(selectedClassElements);

    return (
        <Fragment>
            <CustomText
                text={t(data.nameKey)}
                fontSize={16}
                fontWeight="bold"
                style={genericClassFormStyles.sectionTitle}
            />
            <CustomText text={t(data.descriptionKey)} />
            {data.features
                .filter((f) => level >= f.level)
                .map((f, idx) => (
                    <Fragment key={idx}>
                        <CustomText text={`• ${t(f.descriptionKey)}`} />
                    </Fragment>
                ))}
            {/* 3 Additional Proficiencies */}
            {displaySubClassSpecifics()}
        </Fragment>
    );
};

export default BardSubclass;
