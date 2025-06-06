import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import CustomText from '../../../../atom/CustomText';
import { genericClassFormStyles } from './genericStyle';

interface FighterTalentFormProps {
    level: number;
}

const getSecondWindHeal = (level: number): string => {
    return `1d10 + ${level}`;
};

const titleSize = 16;

const FighterTalentForm = ({ level }: FighterTalentFormProps) => {
    const { t } = useTranslation();
    return (
        <View style={genericClassFormStyles.container}>
            <CustomText
                style={genericClassFormStyles.title}
                fontSize={titleSize}
                fontWeight="bold"
                text={t('character.classes.fighter.talents.secondWindTitle')}
            />
            <CustomText
                text={t(
                    'character.classes.fighter.talents.secondWindDescription',
                    { healAmount: getSecondWindHeal(level) }
                )}
            />

            {level >= 1 && (
                <>
                    <CustomText
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
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

            {level >= 2 && (
                <>
                    <CustomText
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
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

            {level >= 3 && (
                <>
                    <CustomText
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
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

            {level >= 5 && (
                <>
                    <CustomText
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
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
        </View>
    );
};

export default FighterTalentForm;
