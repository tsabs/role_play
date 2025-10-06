import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
    SelectedClassElementsProps,
    SelectedRaceElementsProps,
} from 'types/games/d2d5e';

import CustomText from '@components/atom/CustomText';

import { genericClassFormStyles } from '../../genericStyle';
import RangerHunter from '../../subclassSpecifics/ranger/RangerHunter';
import DisplaySelection from '../../atom/DisplaySelection';

import { rangerSubclasses } from './rangerClass';

interface RangerTalentFormProps {
    level: number;
    abilities: Record<string, number>;
    isOnEdit: boolean;
    subclass?: string;
    handleSubclassChoices: (
        subclassChoices: Record<
            string,
            Array<{ index: string; bonus?: number }>
        >
    ) => void;
    selectedRaceElements?: SelectedRaceElementsProps;
    selectedClassElements?: SelectedClassElementsProps;
}

const getFavoredEnemiesCount = (level: number): number => {
    return level >= 6 ? 2 : 1;
};

const getNaturalExplorerCount = (level: number): number => {
    return level >= 10 ? 3 : level >= 6 ? 2 : 1;
};

const titleSize = 16;

const RangerTalentForm = ({
    level,
    abilities,
    isOnEdit,
    subclass,
    handleSubclassChoices,
    selectedClassElements,
    selectedRaceElements,
}: RangerTalentFormProps) => {
    const { t } = useTranslation();
    const data = rangerSubclasses[subclass as keyof typeof rangerSubclasses];
    const favoredEnemies = useMemo(
        () =>
            selectedClassElements?.classChoices?.['favored-enemies']?.[0]
                ?.index,
        [selectedClassElements?.classChoices]
    );
    const favoredTerrains = useMemo(
        () =>
            selectedClassElements?.classChoices?.['favored-terrains']?.[0]
                ?.index,
        [selectedClassElements?.classChoices]
    );
    const combatsStyle = useMemo(
        () =>
            selectedClassElements?.classChoices?.['combats-style']?.[0]?.index,
        [selectedClassElements?.classChoices]
    );

    const [localChoices, setLocalChoices] = useState<Record<string, string>>({
        favoredEnemies: favoredEnemies || '',
        favoredTerrains: favoredTerrains || '',
        combatsStyle: combatsStyle || '',
    });

    const handleChange = useCallback((value: string, type: string) => {
        setLocalChoices((prev) => ({
            ...prev,
            [type]: value,
        }));
    }, []);

    useEffect(() => {
        const formattedChoices = {
            'favored-enemies': localChoices.favoredEnemies
                ? [{ index: localChoices.favoredEnemies }]
                : [],
            'favored-terrains': localChoices.favoredTerrains
                ? [{ index: localChoices.favoredTerrains }]
                : [],
            'combats-style': localChoices.combatsStyle
                ? [{ index: localChoices.combatsStyle }]
                : [],
        };

        handleSubclassChoices({
            ...selectedClassElements?.classChoices,
            ...formattedChoices,
        });
    }, [
        handleSubclassChoices,
        localChoices,
        selectedClassElements?.classChoices,
    ]);

    const displaySubClassSpecifics = useCallback(() => {
        if (subclass === 'hunter') {
            return (
                <RangerHunter
                    subclass={subclass}
                    selectedClassElements={selectedClassElements}
                    isOnEdit={isOnEdit}
                    handleSubclassChoices={handleSubclassChoices}
                    level={level}
                />
            );
        }
    }, [
        handleSubclassChoices,
        isOnEdit,
        level,
        selectedClassElements,
        subclass,
    ]);

    return (
        <View style={genericClassFormStyles.container}>
            <CustomText
                style={genericClassFormStyles.title}
                fontSize={titleSize}
                fontWeight="bold"
                text={t('character.classes.ranger.talents.favoredEnemyTitle')}
            />
            <CustomText
                text={t(
                    'character.classes.ranger.talents.favoredEnemyDescription',
                    { count: getFavoredEnemiesCount(level) }
                )}
            />

            <DisplaySelection
                isOnEdit={isOnEdit}
                className="ranger"
                // items={favoredEnemyOptions}
                handleChange={handleChange}
                type={'favoredEnemies'}
                selectedValue={localChoices.favoredEnemies}
            />

            <CustomText
                style={genericClassFormStyles.sectionTitle}
                fontSize={titleSize}
                fontWeight="bold"
                text={t(
                    'character.classes.ranger.talents.naturalExplorerTitle'
                )}
            />
            <CustomText
                text={t(
                    'character.classes.ranger.talents.naturalExplorerDescription',
                    { count: getNaturalExplorerCount(level) }
                )}
            />
            <DisplaySelection
                isOnEdit={isOnEdit}
                className="ranger"
                handleChange={handleChange}
                type={'favoredTerrains'}
                selectedValue={localChoices.favoredTerrains}
            />

            {level >= 2 && (
                <Fragment>
                    <CustomText
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
                        text={t(
                            'character.classes.ranger.talents.fightingStyleTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.ranger.talents.fightingStyleDescription'
                        )}
                    />
                    <DisplaySelection
                        className="ranger"
                        isOnEdit={isOnEdit}
                        handleChange={handleChange}
                        type={'combatsStyle'}
                        selectedValue={localChoices.combatsStyle}
                    />
                </Fragment>
            )}

            {level >= 2 && (
                <>
                    <CustomText
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
                        text={t(
                            'character.classes.ranger.talents.spellcastingTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.ranger.talents.spellcastingDescription'
                        )}
                    />
                </>
            )}

            {level >= 3 && (
                <View>
                    <CustomText
                        fontSize={16}
                        fontWeight="bold"
                        text={t(data.nameKey)}
                        style={genericClassFormStyles.sectionTitle}
                    />
                    <CustomText text={t(data.descriptionKey)} />
                    {data.features
                        .filter((f) => level >= f.level)
                        .map((f, idx) => (
                            <CustomText
                                key={idx}
                                text={`• ${t(f.descriptionKey)}`}
                            />
                        ))}
                    {displaySubClassSpecifics()}
                </View>
                // <RangerSubclass
                //     subclass={subclass}
                //     level={level}
                //     selectedClassElements={selectedClassElements}
                //     isOnEdit={isOnEdit}
                //     handleSubclassChoices={handleSubclassChoices}
                // />
            )}
        </View>
    );
};

export default RangerTalentForm;
