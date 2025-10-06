import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';

import CustomButton from '@components/atom/CustomButton';
import { getSpellColor } from '@components/character/form/dnd5e/utils';

import { chainSpell } from '../../classSpecifics/warlock/warlockClass';
import { SpellDescription } from '../../components/SpellDescription';
import { theme } from '../../../../../../../style/theme';

export const WarlockChain = () => {
    const [shouldDisplayDescription, setShouldDisplayDescription] =
        useState(false);

    const handleChange = useCallback(
        () => setShouldDisplayDescription(!shouldDisplayDescription),
        [shouldDisplayDescription]
    );

    const spellColor = useMemo(
        () => getSpellColor(chainSpell.school.index),
        []
    );

    return (
        <View>
            <View
                style={{
                    borderWidth: 1,
                    borderRadius: theme.radius.xs,
                    borderColor: spellColor,
                    margin: theme.space.md,
                }}
            >
                <CustomButton
                    text={chainSpell.name}
                    textColor={spellColor}
                    buttonColor={'transparent'}
                    onPress={handleChange}
                />
            </View>
            <SpellDescription
                shouldShow={shouldDisplayDescription}
                spell={chainSpell}
            />
        </View>
    );
};
