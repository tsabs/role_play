import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import CustomText from '../../../atom/CustomText';
import { calculateModifier } from '../../../../utils/d2d5';

interface BardTalentFormProps {
    level: number;
    abilities: Record<string, number>;
}

const getInspirationDie = (level: number) => {
    if (level >= 15) return '1d12';
    if (level >= 10) return '1d10';
    if (level >= 5) return '1d8';
    return '1d6';
};

const BardTalentForm = ({ level, abilities }: BardTalentFormProps) => {
    const { t } = useTranslation();
    const chaMod = calculateModifier(abilities['CHA'] || 10);
    const uses = Math.max(chaMod, 1); // At least 1 use

    const inspirationDie = getInspirationDie(level);

    return (
        <View style={styles.container}>
            <CustomText
                text={t(
                    'character.classes.bard.talents.bardicInspirationTitle'
                )}
                style={styles.title}
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
                        style={styles.sectionTitle}
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
                        style={styles.sectionTitle}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 10 },
    title: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
    sectionTitle: { marginTop: 12, fontWeight: 'bold' },
});

export default BardTalentForm;
