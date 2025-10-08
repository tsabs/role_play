import { Fragment, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
    SelectedClassElementsProps,
    SelectedRaceElementsProps,
} from 'types/games/d2d5e';

import CustomText from '@components/atom/CustomText';

import BarbarianTotem from '../../subclassSpecifics/barbarian/BarbarianTotem';
import { genericClassFormStyles } from '../../genericStyle';

import { barbarianSubclasses } from './barbarianSubclasses';

interface BarbarianTalentFormProps {
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

const getRageUses = (level: number): number => {
    if (level >= 19) return 6;
    if (level >= 17) return 5;
    if (level >= 12) return 4;
    if (level >= 6) return 3;
    return 2;
};

const getRageDamageBonus = (level: number): number => {
    if (level >= 16) return 4;
    if (level >= 9) return 3;
    return 2;
};

const titleTextSize = 16;

const BarbarianTalentForm = ({
    level,
    abilities,
    isOnEdit,
    subclass,
    handleSubclassChoices,
    selectedRaceElements,
    selectedClassElements,
}: BarbarianTalentFormProps) => {
    const { t } = useTranslation();
    const rageUses = useMemo(() => getRageUses(level), [level]);
    const rageBonus = useMemo(() => getRageDamageBonus(level), [level]);
    const dexMod = useMemo(
        () => Math.floor(((abilities['DEX'] || 10) - 10) / 2),
        [abilities]
    );
    const conMod = useMemo(
        () => Math.floor(((abilities['CON'] || 10) - 10) / 2),
        [abilities]
    );
    const unarmoredAC = useMemo(
        () => Math.max(10 + dexMod + conMod, 10),
        [dexMod, conMod]
    );

    const data = useMemo(
        () => barbarianSubclasses[subclass as keyof typeof barbarianSubclasses],
        [subclass]
    );

    const displaySubclass = useCallback(() => {
        switch (subclass) {
            case 'totem':
                return (
                    <BarbarianTotem
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
                fontSize={titleTextSize}
                fontWeight="bold"
                text={t(`character.classes.barbarian.talents.rageTitle`)}
                style={genericClassFormStyles.title}
            />
            <CustomText
                text={t(
                    `character.classes.barbarian.talents.ragesPerLongRest`,
                    {
                        rageUses,
                    }
                )}
            />
            <CustomText
                text={t(
                    `character.classes.barbarian.talents.bonusDamageWhileRaging`,
                    { rageBonus }
                )}
            />
            <CustomText
                text={t(
                    `character.classes.barbarian.talents.resistanceToPhysicalDamage`
                )}
            />

            <CustomText
                style={genericClassFormStyles.sectionTitle}
                fontSize={titleTextSize}
                fontWeight="bold"
                text={t(
                    `character.classes.barbarian.talents.unarmoredDefenseTitle`
                )}
            />
            <CustomText
                text={t(`character.classes.barbarian.talents.unarmoredAC`, {
                    dexMod,
                    conMod,
                    unarmoredAC,
                })}
            />

            {level >= 2 && (
                <>
                    <CustomText
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleTextSize}
                        fontWeight="bold"
                        text={t(
                            `character.classes.barbarian.talents.recklessAttackTitle`
                        )}
                    />
                    <CustomText
                        text={t(
                            `character.classes.barbarian.talents.recklessAttackDescription`
                        )}
                    />
                    <CustomText
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleTextSize}
                        fontWeight="bold"
                        text={t(
                            `character.classes.barbarian.talents.dangerSenseTitle`
                        )}
                    />
                    <CustomText
                        text={t(
                            `character.classes.barbarian.talents.dangerSenseDescription`
                        )}
                    />
                </>
            )}

            {level >= 3 && (
                <Fragment>
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
                    {displaySubclass()}
                </Fragment>
            )}
        </View>
    );
};

export default BarbarianTalentForm;
