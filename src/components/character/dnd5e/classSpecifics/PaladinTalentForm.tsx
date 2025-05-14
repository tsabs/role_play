import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { calculateModifier } from '../../../../utils/d2d5';
import CustomText from '../../../atom/CustomText';

interface PaladinTalentFormProps {
    level: number;
    abilities: Record<string, number>;
}

const getLayOnHands = (level: number): number => level * 5;

const PaladinTalentForm = ({ level, abilities }: PaladinTalentFormProps) => {
    const { t } = useTranslation();
    const layOnHands = useMemo(() => getLayOnHands(level), [level]);
    const chaMod = useMemo(
        () => calculateModifier(abilities['CHA'] ?? 10),
        [abilities]
    );

    return (
        <View style={styles.container}>
            <CustomText
                style={styles.title}
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
                <>
                    <CustomText
                        style={styles.sectionTitle}
                        text={t(
                            'character.classes.paladin.talents.divineSmiteTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.paladin.talents.divineSmiteDescription'
                        )}
                    />
                </>
            )}

            {level >= 3 && (
                <>
                    <CustomText
                        style={styles.sectionTitle}
                        text={t(
                            'character.classes.paladin.talents.divineHealthTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.paladin.talents.divineHealthDescription'
                        )}
                    />

                    <CustomText
                        style={styles.sectionTitle}
                        text={t(
                            'character.classes.paladin.talents.sacredOathTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.paladin.talents.sacredOathDescription'
                        )}
                    />
                </>
            )}

            {level >= 2 && (
                <>
                    <CustomText
                        style={styles.sectionTitle}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 10 },
    title: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
    sectionTitle: { marginTop: 12, fontWeight: 'bold' },
});

export default PaladinTalentForm;
