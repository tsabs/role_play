import { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import CustomText from '@components/atom/CustomText';
import { calculateModifier } from '@utils/d2d5';

import { genericClassFormStyles } from './genericStyle';

interface SorcererTalentFormProps {
    level: number;
    abilities: Record<string, number>;
}

const getSorceryPoints = (level: number) => level;

const titleSize = 16;

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
        <View style={genericClassFormStyles.container}>
            <CustomText
                style={genericClassFormStyles.title}
                fontSize={titleSize}
                fontWeight="bold"
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
                style={genericClassFormStyles.sectionTitle}
                fontSize={titleSize}
                fontWeight="bold"
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
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
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

export default SorcererTalentForm;
