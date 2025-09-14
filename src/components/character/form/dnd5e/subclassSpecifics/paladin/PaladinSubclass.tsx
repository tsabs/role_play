import { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SelectedClassElementsProps } from 'types/games/d2d5e';

import CustomText from '@components/atom/CustomText';

import { genericClassFormStyles } from '../../genericStyle';

import { paladinSubclasses } from './paladinSubclass';

interface PaladinSubclassProps {
    subclass: string;
    selectedClassElements: SelectedClassElementsProps;
    isOnEdit: boolean;
    handleSubclassChoices: (
        subclassChoices: Record<
            string,
            Array<{ index: string; bonus?: number }>
        >
    ) => void;
    level: number;
}

const PaladinSubclass = ({
    subclass,
    isOnEdit,
    level,
    handleSubclassChoices,
    selectedClassElements,
}: PaladinSubclassProps) => {
    const { t } = useTranslation();

    const data = useMemo(
        () => paladinSubclasses?.[subclass as keyof typeof paladinSubclasses],
        [subclass]
    );

    if (!subclass) return null;

    return (
        <View>
            <CustomText
                fontSize={16}
                fontWeight="bold"
                text={t(data?.nameKey)}
                style={genericClassFormStyles.sectionTitle}
            />
            <CustomText text={t(data?.descriptionKey)} />
            {data?.features
                .filter((f) => level >= f.level)
                .map((f, idx) => (
                    <CustomText key={idx} text={`• ${t(f.descriptionKey)}`} />
                ))}

            {/* Channel Divinity */}
            {data.channelDivinity && level >= data.channelDivinity.level && (
                <View style={{ marginTop: 8 }}>
                    <CustomText
                        fontWeight="bold"
                        text={t(
                            'character.classes.paladin.channelDivinityTitle'
                        )}
                    />
                    {data.channelDivinity.abilities.map((key, i) => (
                        <CustomText key={i} text={`- ${t(key)}`} />
                    ))}
                </View>
            )}

            {/* Oath Spells */}
            {data.oathSpells
                .filter((entry) => level >= entry.level)
                .map((entry, i) => (
                    <View key={i} style={{ marginTop: 8 }}>
                        <CustomText
                            fontWeight="bold"
                            text={t(
                                'character.classes.paladin.oathSpellsAtLevel',
                                { level: entry.level }
                            )}
                        />
                        {entry.spells.map((spell, sIdx) => (
                            <CustomText
                                key={sIdx}
                                text={`• ${t(`spells.${spell}`)}`}
                            />
                        ))}
                    </View>
                ))}
        </View>
    );
};

export default PaladinSubclass;
