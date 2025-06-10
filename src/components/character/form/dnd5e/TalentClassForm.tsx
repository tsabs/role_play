import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
    DnDAbility,
    SelectedClassElementsProps,
    SelectedRaceElementsProps,
} from 'types/games/d2d5e';

import CustomText from '@components/atom/CustomText';
import CustomSelectionButton from '@components/atom/CustomSelectionButton';
import EditMode from '@components/library/EditMode';
import { ExtractedProficiencies, shouldChooseSubclass } from '@utils/d2d5';

import BardTalentForm from '../dnd5e/classSpecifics/bard/BardTalentForm';
import BarbarianTalentForm from '../dnd5e/classSpecifics/barbarian/BarbarianTalentForm';
import ClericTalentForm from '../dnd5e/classSpecifics/ClericTalentForm';
import FighterTalentForm from '../dnd5e/classSpecifics/FighterTalentForm';
import RangerTalentForm from '../dnd5e/classSpecifics/ranger/RangerTalentForm';
import PaladinTalentForm from '../dnd5e/classSpecifics//paladin/PaladinTalentForm';
import SorcererTalentForm from '../dnd5e/classSpecifics/SorcererTalentForm';
import { theme } from '../../../../../style/theme';

interface TalentClassFormProps {
    characterClass: string;
    level: number;
    abilities: Record<DnDAbility, number>;
    proficienciesExtracted?: ExtractedProficiencies;
    selectedRaceElements?: SelectedRaceElementsProps;
    selectedClassElements?: SelectedClassElementsProps;
    isEditModeEnabled?: boolean;
    onSubclassSelect?: (
        subclass: string,
        selectedClassChoices: Record<
            string,
            Array<{ index: string; bonus?: number }>
        >
    ) => void;
}

const TalentClassForm = ({
    characterClass,
    level,
    abilities,
    proficienciesExtracted,
    selectedRaceElements,
    selectedClassElements,
    isEditModeEnabled,
    onSubclassSelect,
}: TalentClassFormProps) => {
    const { t } = useTranslation();
    const [subclass, setSubclass] = useState(
        selectedClassElements?.selected_subclass
    );
    const [subclassChoices, setSubclassChoices] = useState(
        selectedClassElements?.classChoices
    );
    const [isOnEdit, setIsOnEdit] = useState(false);
    const availableSubclasses = useMemo(() => {
        switch (characterClass) {
            case 'bard':
                return [
                    {
                        label: t(
                            'character.classes.bard.subclasses.lore.title'
                        ),
                        value: 'lore',
                    },
                    {
                        label: t(
                            'character.classes.bard.subclasses.valor.title'
                        ),
                        value: 'valor',
                    },
                ];
            case 'barbarian':
                return [
                    {
                        label: t(
                            'character.classes.barbarian.subclasses.berserker.title'
                        ),
                        value: 'berserker',
                    },
                    {
                        label: t(
                            'character.classes.barbarian.subclasses.totem.title'
                        ),
                        value: 'totem',
                    },
                ];
            case 'ranger':
                return [
                    {
                        label: t(
                            'character.classes.ranger.subclasses.hunter.title'
                        ),
                        value: 'hunter',
                    },
                    {
                        label: t(
                            'character.classes.ranger.subclasses.beastMaster.title'
                        ),
                        value: 'beastMaster',
                    },
                ];
            case 'paladin':
                return [
                    {
                        label: t(
                            'character.classes.paladin.subclasses.devotion.title'
                        ),
                        value: 'devotion',
                    },
                    {
                        label: t(
                            'character.classes.paladin.subclasses.ancients.title'
                        ),
                        value: 'ancients',
                    },
                    {
                        label: t(
                            'character.classes.paladin.subclasses.vengeance.title'
                        ),
                        value: 'vengeance',
                    },
                ];
            default:
                return [];
        }
    }, [characterClass, t]);

    const showSubclassSelector = useMemo(
        () =>
            shouldChooseSubclass(characterClass, level) &&
            availableSubclasses.length > 0,
        [characterClass, level, availableSubclasses.length]
    );

    const handleSubclassChange = useCallback((selected: string) => {
        setSubclass(selected);
    }, []);

    const handleSubclassChoices = useCallback(
        (
            selectSubclassChoices: Record<
                string,
                Array<{ index: string; bonus?: number }>
            >
        ) => {
            setSubclassChoices(selectSubclassChoices);
        },
        []
    );

    const handleChangeEditMode = useCallback(() => {
        setIsOnEdit(!isOnEdit);
    }, [isOnEdit]);

    const handleSave = useCallback(() => {
        onSubclassSelect(subclass, subclassChoices);
        setIsOnEdit(false);
    }, [onSubclassSelect, subclass, subclassChoices]);

    console.log('CHOICES :', subclassChoices);

    const renderClassSpecific = useCallback(() => {
        switch (characterClass) {
            case 'bard':
                return (
                    <BardTalentForm
                        level={level}
                        abilities={abilities}
                        subclass={subclass}
                        proficienciesExtracted={proficienciesExtracted}
                        selectedClassElements={selectedClassElements}
                        handleSubclassChoices={handleSubclassChoices}
                        isOnEdit={isOnEdit}
                    />
                );
            case 'barbarian':
                return (
                    <BarbarianTalentForm
                        level={level}
                        abilities={abilities}
                        subclass={subclass}
                        selectedRaceElements={selectedRaceElements}
                        selectedClassElements={selectedClassElements}
                        isOnEdit={isOnEdit}
                        handleSubclassChoices={handleSubclassChoices}
                    />
                );
            case 'ranger':
                return (
                    <RangerTalentForm
                        level={level}
                        abilities={abilities}
                        subclass={subclass}
                        selectedRaceElements={selectedRaceElements}
                        selectedClassElements={selectedClassElements}
                        isOnEdit={isOnEdit}
                        handleSubclassChoices={handleSubclassChoices}
                    />
                );
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
                    <PaladinTalentForm
                        level={level}
                        abilities={abilities}
                        subclass={subclass}
                        selectedClassElements={selectedClassElements}
                        isOnEdit={isOnEdit}
                        handleSubclassChoices={handleSubclassChoices}
                    />
                );
            default:
                return <CustomText text="Class not yet supported." />;
        }
    }, [
        characterClass,
        level,
        abilities,
        subclass,
        proficienciesExtracted,
        selectedClassElements,
        selectedRaceElements,
        handleSubclassChoices,
        isOnEdit,
    ]);

    return (
        <View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: theme.space.md,
                }}
            >
                <EditMode
                    isEditModeEnabled={isEditModeEnabled}
                    handleChange={handleChangeEditMode}
                    handleSave={handleSave}
                    style={{ flexDirection: 'row' }}
                />
                {showSubclassSelector &&
                    (isOnEdit ? (
                        subclass ? (
                            <CustomSelectionButton
                                items={availableSubclasses}
                                customStyle={{
                                    borderWidth: 1,
                                    backgroundColor: theme.colors.light,
                                    borderRadius: theme.radius.sm,
                                    borderColor: theme.colors.primary,
                                }}
                                preSelectedValue={{
                                    label: t(
                                        `character.classes.${characterClass}.subclasses.${subclass}.title`
                                    ),
                                    value: subclass,
                                }}
                                displayValue={t(
                                    `character.classes.${characterClass}.subclasses.${subclass}.title`
                                )}
                                onSelect={handleSubclassChange}
                            />
                        ) : (
                            <View style={{}}>
                                <CustomSelectionButton
                                    customStyle={{
                                        borderWidth: 1,
                                        borderRadius: theme.radius.sm,
                                        borderColor: theme.colors.primary,
                                    }}
                                    placeHolder={'Choisir une sous-classe'}
                                    items={availableSubclasses}
                                    // value={subclass}
                                    onSelect={handleSubclassChange}
                                />
                            </View>
                        )
                    ) : (
                        !subclass && (
                            <CustomText
                                fontSize={theme.fontSize.large}
                                text={'Choisir une sous classe'}
                            />
                        )
                    ))}
            </View>
            {renderClassSpecific()}
        </View>
    );
};

export default TalentClassForm;
