import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SelectedClassElementsProps } from 'types/games/d2d5e.ts';

import CustomText from '@components/atom/CustomText';

import DisplaySelection from '../../atom/DisplaySelection.tsx';
import { genericClassFormStyles } from '../../genericStyle';

interface FighterTalentFormProps {
    level: number;
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

const getSecondWindHeal = (level: number): string => {
    return `1d10 + ${level}`;
};

const titleSize = 16;

const FighterTalentForm = ({
    level,
    isOnEdit,
    subclass,
    selectedClassElements,
    handleSubclassChoices,
}: FighterTalentFormProps) => {
    const { t } = useTranslation();

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
                text={t('character.classes.fighter.talents.secondWindTitle')}
            />
            <CustomText
                text={t(
                    'character.classes.fighter.talents.secondWindDescription',
                    { healAmount: getSecondWindHeal(level) }
                )}
            />

            {level >= 1 && (
                <Fragment>
                    <CustomText
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
                        text={t(
                            'character.classes.fighter.talents.fightingStyleTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.fighter.talents.fightingStyleDescription'
                        )}
                    />

                    <DisplaySelection
                        className="fighter"
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
                            'character.classes.fighter.talents.actionSurgeTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.fighter.talents.actionSurgeDescription'
                        )}
                    />
                </>
            )}

            {level >= 3 && (
                <>
                    <CustomText
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
                        text={t(
                            'character.classes.fighter.talents.martialArchetypeTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.fighter.talents.martialArchetypeDescription'
                        )}
                    />
                </>
            )}

            {level >= 5 && (
                <>
                    <CustomText
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
                        text={t(
                            'character.classes.fighter.talents.extraAttackTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.fighter.talents.extraAttackDescription'
                        )}
                    />
                </>
            )}
        </View>
    );
};

export default FighterTalentForm;
