import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import CustomText from '../../../atom/CustomText';

interface FighterTalentFormProps {
    level: number;
}

const getSecondWindHeal = (level: number): string => {
    return `1d10 + ${level}`;
};

const FighterTalentForm = ({ level }: FighterTalentFormProps) => {
    const { t } = useTranslation();
    return (
        <View style={styles.container}>
            <CustomText
                style={styles.title}
                text={t('character.classes.fighter.talents.secondWindTitle')}
            />
            <CustomText
                text={t(
                    'character.classes.fighter.talents.secondWindDescription',
                    { healAmount: getSecondWindHeal(level) }
                )}
            />

            {level >= 2 && (
                <>
                    <CustomText
                        style={styles.sectionTitle}
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

            {level >= 1 && (
                <>
                    <CustomText
                        style={styles.sectionTitle}
                        text={t(
                            'character.classes.fighter.talents.fightingStyleTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.fighter.talents.fightingStyleDescription'
                        )}
                    />
                </>
            )}

            {level >= 5 && (
                <>
                    <CustomText
                        style={styles.sectionTitle}
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

            {level >= 3 && (
                <>
                    <CustomText
                        style={styles.sectionTitle}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 10 },
    title: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
    sectionTitle: { marginTop: 12, fontWeight: 'bold' },
});

export default FighterTalentForm;
