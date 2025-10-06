import { Fragment, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SelectedClassElementsProps } from 'types/games/d2d5e';

import CustomText from '@components/atom/CustomText';
import {
    calculateModifier,
    ExtractedProficiencies,
    getProficienciesToExpertise,
} from '@utils/d2d5';

import { genericClassFormStyles } from '../../genericStyle';
import BardLore from '../../subclassSpecifics/bard/BardLore';
import ProficiencySelector from '../../proficiencies/ProficiencySelector';

import { bardSubclasses, expertiseData } from './bardSubclasses';

interface BardTalentFormProps {
    level: number;
    abilities: Record<string, number>;
    proficienciesExtracted: ExtractedProficiencies;
    isOnEdit: boolean;
    handleSubclassChoices: (
        subclassChoices: Record<
            string,
            Array<{ index: string; bonus?: number }>
        >
    ) => void;
    selectedClassElements?: SelectedClassElementsProps;
    subclass?: string;
}

const getInspirationDie = (level: number) => {
    if (level >= 15) return '1d12';
    if (level >= 10) return '1d10';
    if (level >= 5) return '1d8';
    return '1d6';
};

const titleTextSize = 16;

const BardTalentForm = ({
    level,
    abilities,
    proficienciesExtracted,
    isOnEdit,
    handleSubclassChoices,
    selectedClassElements,
    subclass,
}: BardTalentFormProps) => {
    const { t } = useTranslation();
    const data = useMemo(
        () => bardSubclasses[subclass as keyof typeof bardSubclasses],
        [subclass]
    );
    const expertise = useMemo(
        () => selectedClassElements?.classChoices?.['expertise'],
        [selectedClassElements?.classChoices]
    );
    const [expertiseSelected, setExpertiseSelected] = useState(expertise);
    const chaMod = useMemo(
        () => calculateModifier(abilities['CHA'] || 10),
        [abilities]
    );
    const uses = useMemo(() => Math.max(chaMod, 1), [chaMod]); // At least 1 use

    const inspirationDie = useMemo(() => getInspirationDie(level), [level]);
    const selectableExpertise = useMemo(
        () =>
            getProficienciesToExpertise(
                expertiseData,
                proficienciesExtracted,
                []
            ),
        [proficienciesExtracted]
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

    const displaySubClass = useCallback(() => {
        switch (subclass) {
            case 'lore':
                return (
                    <BardLore
                        subclass={subclass}
                        proficienciesExtracted={proficienciesExtracted}
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
        proficienciesExtracted,
        selectedClassElements,
        subclass,
    ]);

    return (
        <View style={genericClassFormStyles.container}>
            <CustomText
                text={t(
                    'character.classes.bard.talents.bardicInspirationTitle'
                )}
                fontSize={titleTextSize}
                fontWeight="bold"
                style={genericClassFormStyles.title}
            />
            <CustomText
                text={t(
                    'character.classes.bard.talents.bardicInspirationDescription',
                    { uses }
                )}
            />
            <CustomText
                text={t('character.classes.bard.talents.inspirationDice', {
                    inspirationDie,
                    level,
                })}
            />
            <CustomText
                text={t(
                    'character.classes.bard.talents.bonusActionDescription'
                )}
            />

            {level >= 2 && (
                <>
                    <CustomText
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleTextSize}
                        fontWeight="bold"
                        text={t(
                            'character.classes.bard.talents.songOfRestTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.bard.talents.songOfRestDescription'
                        )}
                    />
                </>
            )}

            {level >= 2 && (
                <>
                    <CustomText
                        fontSize={titleTextSize}
                        fontWeight="bold"
                        style={genericClassFormStyles.sectionTitle}
                        text={t(
                            'character.classes.bard.talents.jackOfAllTradesTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.bard.talents.jackOfAllTradesDescription'
                        )}
                    />
                </>
            )}

            {level >= 3 && (
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
                    {displaySubClass()}
                </Fragment>
            )}
        </View>
    );
};

export default BardTalentForm;
