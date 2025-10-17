import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SelectedClassElementsProps } from 'types/games/d2d5e';

import CustomText from '@components/atom/CustomText';
import { calculateModifier } from '@utils/d2d5';

import { genericClassFormStyles } from '../../genericStyle';
import DisplaySelection from '../../atom/DisplaySelection';
import DivineClassData from '../DivineClassData';

import { paladinSubclasses } from './paladinClass';

interface PaladinTalentFormProps {
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
    selectedClassElements?: SelectedClassElementsProps;
}

const getLayOnHands = (level: number): number => level * 5;

const titleSize = 16;

const PaladinTalentForm = ({
    level,
    abilities,
    isOnEdit,
    subclass,
    handleSubclassChoices,
    selectedClassElements,
}: PaladinTalentFormProps) => {
    const { t } = useTranslation();
    const layOnHands = useMemo(() => getLayOnHands(level), [level]);
    const chaMod = useMemo(
        () => calculateModifier(abilities['CHA'] ?? 10),
        [abilities]
    );

    const combatsStyle = useMemo(
        () =>
            selectedClassElements?.classChoices?.['combats-style']?.[0]?.index,
        [selectedClassElements?.classChoices]
    );

    const [localChoices, setLocalChoices] = useState<Record<string, string>>({
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

    return (
        <View style={genericClassFormStyles.container}>
            <CustomText
                style={genericClassFormStyles.title}
                fontSize={titleSize}
                fontWeight="bold"
                text={t('character.classes.paladin.talents.layOnHandsTitle')}
            />
            <CustomText
                text={t(
                    'character.classes.paladin.talents.layOnHandsDescription',
                    { layOnHands }
                )}
            />
            <CustomText
                text={t('character.classes.paladin.talents.layOnHandsUsage')}
            />

            {level >= 2 && (
                <Fragment>
                    <CustomText
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
                        text={t(
                            'character.classes.paladin.talents.divineSmiteTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.paladin.talents.divineSmiteDescription'
                        )}
                    />
                </Fragment>
            )}

            {level >= 2 && (
                <Fragment>
                    <CustomText
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
                        text={t(
                            'character.classes.paladin.talents.fightingStyleTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.paladin.talents.fightingStyleDescription'
                        )}
                    />
                    <DisplaySelection
                        className="paladin"
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
                            'character.classes.paladin.talents.spellcastingTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.paladin.talents.spellcastingDescription',
                            { chaMod }
                        )}
                    />
                </>
            )}

            {level >= 3 && (
                <Fragment>
                    <CustomText
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
                        text={t(
                            'character.classes.paladin.talents.divineHealthTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.paladin.talents.divineHealthDescription'
                        )}
                    />

                    <DivineClassData
                        subclassData={paladinSubclasses(subclass)[subclass]}
                        level={level}
                        type={'paladin'}
                        subclass={subclass}
                    />
                </Fragment>
            )}
        </View>
    );
};

export default PaladinTalentForm;
