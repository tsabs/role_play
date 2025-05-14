import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { calculateModifier } from '../../../../utils/d2d5';
import CustomText from '../../../atom/CustomText';

interface ClericTalentFormProps {
    level: number;
    abilities: Record<string, number>;
}

const ClericTalentForm = ({ level, abilities }: ClericTalentFormProps) => {
    const { t } = useTranslation();
    const wisMod = calculateModifier(abilities['WIS'] ?? 10);
    const preparedSpells = Math.max(wisMod + level, 1);

    return (
        <View style={styles.container}>
            <CustomText
                style={styles.title}
                text={t('character.classes.cleric.talents.spellcastingTitle')}
            />
            <CustomText
                text={t(
                    'character.classes.cleric.talents.preparedSpellsDescription',
                    { preparedSpells }
                )}
            />
            <CustomText
                text={t(
                    'character.classes.cleric.talents.spellcastingAccessDescription'
                )}
            />

            <CustomText
                style={styles.sectionTitle}
                text={t(
                    'character.classes.cleric.talents.channelDivinityTitle'
                )}
            />
            {level < 2 ? (
                <CustomText
                    text={t(
                        'character.classes.cleric.talents.channelDivinityUnlocked'
                    )}
                />
            ) : (
                <>
                    <CustomText
                        text={t(
                            'character.classes.cleric.talents.channelDivinityDescription'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.cleric.talents.channelDivinityUses'
                        )}
                    />
                </>
            )}

            {level >= 10 && (
                <>
                    <CustomText
                        style={styles.sectionTitle}
                        text={t(
                            'character.classes.cleric.talents.divineInterventionTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.cleric.talents.divineInterventionDescription'
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

export default ClericTalentForm;
