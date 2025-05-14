import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import CustomText from '../../../atom/CustomText';
import { useMemo } from 'react';

interface BarbarianTalentFormProps {
    level: number;
    abilities: Record<string, number>;
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

const BarbarianTalentForm = ({
    level,
    abilities,
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

    return (
        <View style={styles.container}>
            <CustomText
                text={t(`character.classes.barbarian.talents.rageTitle`)}
                style={styles.title}
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
                style={styles.sectionTitle}
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
                        style={styles.sectionTitle}
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
                        style={styles.sectionTitle}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 10 },
    title: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
    sectionTitle: { marginTop: 12, fontWeight: 'bold' },
});

export default BarbarianTalentForm;
