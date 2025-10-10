import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import CustomText from '@components/atom/CustomText.tsx';

import { genericClassFormStyles } from '../genericStyle';

interface DivineSubclassProps {
    subclassData: {
        nameKey: string;
        descriptionKey: string;
        features: Array<{ level: number; descriptionKey: string }>;
        spells?: Array<{
            level: number;
            spells: Array<{ index: string; schoolType: string }>;
        }>;
        specialAbilities?: {
            level: number;
            abilities: string[];
        };
    };
    level: number;
    type: 'cleric' | 'paladin';
    subclass: string;
}

const titleSize = 16;

const DivineClassData = ({
    subclassData,
    level,
    type,
    subclass,
}: DivineSubclassProps) => {
    const { t } = useTranslation();

    if (!subclassData || !subclass) return null;

    return (
        <View>
            {/* Title */}
            <CustomText
                fontSize={titleSize}
                fontWeight="bold"
                text={t(subclassData.nameKey)}
                style={genericClassFormStyles.sectionTitle}
            />

            {/* Description */}
            <CustomText text={t(subclassData.descriptionKey)} />

            {/* Features unlocked by level */}
            {subclassData.features
                .filter((feature) => level >= feature.level)
                .map((feature, idx) => (
                    <CustomText
                        key={idx}
                        text={`• ${t(feature.descriptionKey)}`}
                    />
                ))}

            {/* Special Abilities (e.g., Channel Divinity or Divine Conduit) */}
            {subclassData.specialAbilities &&
                level >= subclassData.specialAbilities.level && (
                    <View style={{ marginTop: 8 }}>
                        <CustomText
                            fontWeight="bold"
                            text={t(
                                `character.classes.${type}.talents.specialAbilitiesTitle`
                            )}
                        />
                        {subclassData.specialAbilities.abilities.map(
                            (ability, idx) => (
                                <CustomText
                                    key={idx}
                                    text={`- ${t(ability)}`}
                                />
                            )
                        )}
                    </View>
                )}
        </View>
    );
};

export default DivineClassData;
