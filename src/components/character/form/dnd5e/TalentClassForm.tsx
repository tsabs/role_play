import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import CustomText from '../../../atom/CustomText';
import BardTalentForm from '../dnd5e/classSpecifics/bard/BardTalentForm';
import BarbarianTalentForm from '../dnd5e/classSpecifics/barbarian/BarbarianTalentForm';
import RangerTalentForm from '../dnd5e/classSpecifics/RangerTalentForm';
import FighterTalentForm from '../dnd5e/classSpecifics/FighterTalentForm';
import ClericTalentForm from '../dnd5e/classSpecifics/ClericTalentForm';
import SorcererTalentForm from '../dnd5e/classSpecifics/SorcererTalentForm';
import PaladinTalentForm from '../dnd5e/classSpecifics/PaladinTalentForm';
import {
    DnDAbility,
    SelectedClassElementsProps,
} from '../../../../types/games/d2d5e';
import {
    ExtractedProficiencies,
    shouldChooseSubclass,
} from '../../../../utils/d2d5';
import CustomSelectionButton from '../../../atom/CustomSelectionButton';
import { theme } from '../../../../../style/theme';
import EditMode from '../../../library/EditMode';

interface TalentClassFormProps {
    characterClass: string;
    level: number;
    abilities: Record<DnDAbility, number>;
    proficienciesExtracted: ExtractedProficiencies;
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
                        selectedClassElements={selectedClassElements}
                        isOnEdit={isOnEdit}
                        handleSubclassChoices={handleSubclassChoices}
                    />
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
    }, [
        characterClass,
        level,
        abilities,
        subclass,
        proficienciesExtracted,
        selectedClassElements,
        handleSubclassChoices,
        isOnEdit,
    ]);

    return (
        <View>
            {showSubclassSelector && (
                <View
                    style={{
                        marginBottom: theme.space.md,
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
                    {isOnEdit ? (
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
                    )}
                </View>
            )}
            {renderClassSpecific()}
        </View>
    );
};

export default TalentClassForm;
