import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { calculateModifier } from '../../../../utils/d2d5';
import CustomText from '../../../atom/CustomText';

interface SorcererTalentFormProps {
    level: number;
    abilities: Record<string, number>;
}

const getSorceryPoints = (level: number) => level;

const SorcererTalentForm = ({ level, abilities }: SorcererTalentFormProps) => {
    const { t } = useTranslation();
    const chaMod = useMemo(
        () => calculateModifier(abilities['CHA'] ?? 10),
        [abilities]
    );
    const sorceryPoints = useMemo(() => getSorceryPoints(level), [level]);
    const maxSpellsKnown = useMemo(
        () => Math.min(Math.max(2, level + chaMod), 15),
        [level, chaMod]
    );

    return (
        <View style={styles.container}>
            <CustomText
                style={styles.title}
                text={t('character.classes.sorcerer.talents.spellcastingTitle')}
            />
            <CustomText
                text={t(
                    'character.classes.sorcerer.talents.spellsKnownDescription',
                    { maxSpellsKnown }
                )}
            />
            <CustomText
                text={t(
                    'character.classes.sorcerer.talents.spellcastingAccessDescription'
                )}
            />

            <CustomText
                style={styles.sectionTitle}
                text={t(
                    'character.classes.sorcerer.talents.sorceryPointsTitle'
                )}
            />
            <CustomText
                text={t(
                    'character.classes.sorcerer.talents.sorceryPointsDescription',
                    { sorceryPoints }
                )}
            />
            <CustomText
                text={t(
                    'character.classes.sorcerer.talents.sorceryPointsUsage'
                )}
            />

            {level >= 3 && (
                <>
                    <CustomText
                        style={styles.sectionTitle}
                        text={t(
                            'character.classes.sorcerer.talents.metamagicTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.sorcerer.talents.metamagicDescription'
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

export default SorcererTalentForm;
