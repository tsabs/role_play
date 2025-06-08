import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import CustomText from '../../../../atom/CustomText';

import { genericClassFormStyles } from './genericStyle';

interface RangerTalentFormProps {
    level: number;
}

const getFavoredEnemiesCount = (level: number): number => {
    return level >= 6 ? 2 : 1;
};

const getNaturalExplorerCount = (level: number): number => {
    return level >= 10 ? 3 : level >= 6 ? 2 : 1;
};

const titleSize = 16;

const RangerTalentForm = ({ level }: RangerTalentFormProps) => {
    const { t } = useTranslation();
    return (
        <View style={genericClassFormStyles.container}>
            <CustomText
                style={genericClassFormStyles.title}
                fontSize={titleSize}
                fontWeight="bold"
                text={t('character.classes.ranger.talents.favoredEnemyTitle')}
            />
            <CustomText
                text={t(
                    'character.classes.ranger.talents.favoredEnemyDescription',
                    { count: getFavoredEnemiesCount(level) }
                )}
            />

            <CustomText
                style={genericClassFormStyles.sectionTitle}
                fontSize={titleSize}
                fontWeight="bold"
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
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
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
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
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

export default RangerTalentForm;
