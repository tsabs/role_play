import { Fragment, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SelectedClassElementsProps } from 'types/games/d2d5e';

import CustomText from '@components/atom/CustomText';
import {
    ExtractedProficiencies,
    getAvailableProficiencies,
    getProficienciesToExpertise,
} from '@utils/d2d5';

import {
    bardSubclasses,
    expertiseData,
    loreProficiencyData,
} from '../classSpecifics/bard/bardSubclasses';
import { genericClassFormStyles } from '../genericStyle';
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

    const expertise = useMemo(
        () => selectedClassElements?.classChoices?.['expertise'],
        [selectedClassElements?.classChoices]
    );

    const [proficienciesSelected, setProficienciesSelected] = useState(
        loreProficienciesSelected
    );

    const [expertiseSelected, setExpertiseSelected] = useState(expertise);

    const selectableProficiencies = useMemo(
        () =>
            getAvailableProficiencies(
                loreProficiencyData,
                proficienciesExtracted,
                ['fromSelectedSubclass']
            ),
        [proficienciesExtracted]
    );

    const selectableExpertise = useMemo(
        () =>
            getProficienciesToExpertise(
                expertiseData,
                proficienciesExtracted,
                []
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

    const handleChangeExpertise = useCallback(
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
            setExpertiseSelected(selected);
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
        handleChangeExtraProficiencies,
        isOnEdit,
        level,
        proficienciesSelected,
        selectableProficiencies,
        subclass,
        t,
    ]);

    if (!subclass || !(subclass in bardSubclasses)) return null;

    return (
        <Fragment>
            <CustomText
                fontSize={16}
                fontWeight="bold"
                text={"Compétence d'expertise"}
                style={genericClassFormStyles.sectionTitle}
            />
            <ProficiencySelector
                data={selectableExpertise}
                groupId={`expertise`}
                defaultValue={expertiseSelected}
                onChange={handleChangeExpertise}
            />

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
