import { FC, useState } from 'react';
import { View, TextInput } from 'react-native';
import { Ability } from '../../../../types/games/d2d5e';
import CustomText from '../../../atom/CustomText';
import { theme } from '../../../../../style/theme';

interface AbilityFormProps {
    abilities: Record<Ability, number>;
    onChange: (updated: Record<Ability, number>) => void;
}

const calculateModifier = (score: number): number =>
    Math.floor((score - 10) / 2);

const AbilityForm: FC<AbilityFormProps> = ({ abilities, onChange }) => {
    const [abilityValue, setAbilityValue] = useState<number | undefined>(
        undefined
    );
    const handleChange = (key: Ability, value: string) => {
        const num = parseInt(value) || 0;
        const updated = { ...abilities, [key]: num };
        onChange(updated);
    };

    return (
        <View style={{ padding: 12, flexDirection: 'row', flexWrap: 'wrap' }}>
            {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as Ability[]).map(
                (ability) => {
                    // const score = abilities[ability];
                    // const mod = calculateModifier(score);
                    // const sign = mod >= 0 ? '+' : '';

                    return (
                        <View
                            key={ability}
                            style={{
                                // flex: 1,
                                flexDirection: 'row',
                                display: 'flex',
                                gap: theme.space.sm,
                                minWidth: 100,
                                alignItems: 'center',
                            }}
                        >
                            <CustomText
                                style={{
                                    display: 'flex',
                                    // flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                text={`${ability}`}
                            />
                            {/*<CustomText text={`${mod}`} />*/}
                            <TextInput
                                keyboardType="numeric"
                                value={abilityValue?.toString() ?? ''}
                                onChangeText={(value) =>
                                    handleChange(ability, value)
                                }
                                style={{
                                    flex: 1,
                                    borderColor: '#ccc',
                                    borderWidth: 1,
                                    borderRadius: 6,
                                    padding: theme.space.sm,
                                    marginTop: 4,
                                }}
                            />
                        </View>
                    );
                }
            )}
        </View>
    );
};

export default AbilityForm;
