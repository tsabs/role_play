import { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import CustomText from '@components/atom/CustomText';
import { calculateModifier } from '@utils/d2d5';

import { genericClassFormStyles } from './genericStyle';

interface ClericTalentFormProps {
    level: number;
    abilities: Record<string, number>;
}
const titleSize = 16;

const ClericTalentForm = ({ level, abilities }: ClericTalentFormProps) => {
    const { t } = useTranslation();
    const wisMod = useMemo(
        () => calculateModifier(abilities['WIS'] ?? 10),
        [abilities]
    );
    const preparedSpells = useMemo(
        () => Math.max(wisMod + level, 1),
        [wisMod, level]
    );

    return (
        <View style={genericClassFormStyles.container}>
            <CustomText
                style={genericClassFormStyles.title}
                fontSize={titleSize}
                fontWeight="bold"
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
                style={genericClassFormStyles.sectionTitle}
                fontSize={titleSize}
                fontWeight="bold"
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
                        style={genericClassFormStyles.sectionTitle}
                        fontSize={titleSize}
                        fontWeight="bold"
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

export default ClericTalentForm;
