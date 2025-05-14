import { View, StyleSheet } from 'react-native';
import { calculateModifier } from '../../../../utils/d2d5';
import CustomText from '../../../atom/CustomText';
import { useTranslation } from 'react-i18next';

interface SorcererTalentFormProps {
    level: number;
    abilities: Record<string, number>;
}

const getSorceryPoints = (level: number) => level;

const SorcererTalentForm = ({ level, abilities }: SorcererTalentFormProps) => {
    const { t } = useTranslation();
    const chaMod = calculateModifier(abilities['CHA'] ?? 10);
    const sorceryPoints = getSorceryPoints(level);
    const maxSpellsKnown = Math.min(Math.max(2, level + chaMod), 15);

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
