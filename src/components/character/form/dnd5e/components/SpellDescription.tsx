import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Spell } from 'types/games/d2d5e';

import CustomText from '@components/atom/CustomText';
import Separator from '@components/library/Separator';
import { getSpellColor } from '@components/character/form/dnd5e/utils';

import { theme } from '../../../../../../style/theme';

interface SpellDescriptionProps {
    shouldShow: boolean;
    spell: Spell;
}

export const SpellDescription = ({
    shouldShow,
    spell,
}: SpellDescriptionProps) => {
    const spellColor = useMemo(
        () => getSpellColor(spell?.school?.index || ''),
        [spell?.school?.index]
    );
    return (
        shouldShow && (
            <View style={{ ...styles.container, borderColor: spellColor }}>
                <View style={styles.textContainer}>
                    <CustomText text={`Ecole de sort: `} />
                    <CustomText
                        color={getSpellColor(spell?.school?.index)}
                        text={spell?.school?.name}
                    />
                </View>
                {spell?.duration && (
                    <CustomText text={`Durée du sort: ${spell?.duration}`} />
                )}
                <Separator margin={theme.space.md} horizontal />
                {spell?.desc?.map((d, i) => {
                    return (
                        <CustomText
                            key={i}
                            style={styles.descriptionSpellText}
                            text={d}
                        />
                    );
                })}
            </View>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        margin: theme.space.md,
        padding: theme.space.xl,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    textContainer: {
        flexDirection: 'row',
    },
    descriptionSpellText: { lineHeight: 20 },
});
