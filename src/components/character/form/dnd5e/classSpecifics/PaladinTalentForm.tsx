import { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { calculateModifier } from '../../../../../utils/d2d5';
import CustomText from '../../../../atom/CustomText';

import { genericClassFormStyles } from './genericStyle';

interface PaladinTalentFormProps {
    level: number;
    abilities: Record<string, number>;
}

const getLayOnHands = (level: number): number => level * 5;

const titleSize = 16;

const PaladinTalentForm = ({ level, abilities }: PaladinTalentFormProps) => {
    const { t } = useTranslation();
    const layOnHands = useMemo(() => getLayOnHands(level), [level]);
    const chaMod = useMemo(
        () => calculateModifier(abilities['CHA'] ?? 10),
        [abilities]
    );

    return (
        <View style={genericClassFormStyles.container}>
            <CustomText
                style={genericClassFormStyles.title}
                fontSize={titleSize}
                fontWeight="bold"
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
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
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

            {level >= 2 && (
                <>
                    <CustomText
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
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

            {level >= 3 && (
                <>
                    <CustomText
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
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
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
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
        </View>
    );
};

export default PaladinTalentForm;
