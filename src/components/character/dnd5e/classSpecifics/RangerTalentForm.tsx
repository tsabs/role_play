import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import CustomText from '../../../atom/CustomText';

interface RangerTalentFormProps {
    level: number;
}

const getFavoredEnemiesCount = (level: number): number => {
    return level >= 6 ? 2 : 1;
};

const getNaturalExplorerCount = (level: number): number => {
    return level >= 10 ? 3 : level >= 6 ? 2 : 1;
};

const RangerTalentForm = ({ level }: RangerTalentFormProps) => {
    const { t } = useTranslation();
    return (
        <View style={styles.container}>
            <CustomText
                style={styles.title}
                text={t('character.classes.ranger.talents.favoredEnemyTitle')}
            />
            <CustomText
                text={t(
                    'character.classes.ranger.talents.favoredEnemyDescription',
                    { count: getFavoredEnemiesCount(level) }
                )}
            />

            <CustomText
                style={styles.sectionTitle}
                text={t(
                    'character.classes.ranger.talents.naturalExplorerTitle'
                )}
            />
            <CustomText
                text={t(
                    'character.classes.ranger.talents.naturalExplorerDescription',
                    { count: getNaturalExplorerCount(level) }
                )}
            />

            {level >= 2 && (
                <>
                    <CustomText
                        style={styles.sectionTitle}
                        text={t(
                            'character.classes.ranger.talents.fightingStyleTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.ranger.talents.fightingStyleDescription'
                        )}
                    />
                </>
            )}

            {level >= 2 && (
                <>
                    <CustomText
                        style={styles.sectionTitle}
                        text={t(
                            'character.classes.ranger.talents.spellcastingTitle'
                        )}
                    />
                    <CustomText
                        text={t(
                            'character.classes.ranger.talents.spellcastingDescription'
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

export default RangerTalentForm;
