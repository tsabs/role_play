import { useCallback, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import CustomText from '../../../atom/CustomText';
import { theme } from '../../../../../style/theme';
import { Ability } from '../../../../types/generic';
import { IconButton } from 'react-native-paper';

interface AbilityFormProps<T extends Ability> {
    onChange: (updated: Record<T, number>) => void;
    onEditMode?: () => void;
    abilities?: Record<T, number>;
    isEditMode?: boolean;
    isEditModeEnabled?: boolean;
}

const AbilityForm = <T extends Ability>({
    abilities,
    onChange,
    onEditMode,
    isEditModeEnabled,
    isEditMode,
}: AbilityFormProps<T>) => {
    const [abilityValue, setAbilityValue] =
        useState<Record<T, number>>(abilities);
    const handleChange = useCallback(
        (key: Ability, value: string) => {
            const num = parseInt(value) || 0;
            const updated = { ...abilities, [key]: num };
            setAbilityValue(updated);
            onChange(updated);
        },
        [abilities, onChange]
    );

    return (
        <View
            style={{
                flexDirection: 'row',
            }}
        >
            {isEditModeEnabled && (
                <View
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                    <IconButton
                        onPress={onEditMode}
                        style={{ backgroundColor: theme.colors.secondary25 }}
                        icon={'pen'}
                    />
                </View>
            )}

            <View style={styles.container}>
                {Object.entries(abilities || {})?.map(
                    ([abilityKey, abilityValue]) => {
                        return (
                            <View key={abilityKey} style={styles.ability}>
                                <CustomText
                                    style={styles.abilityKey}
                                    text={`${abilityKey}`}
                                />
                                {isEditMode ? (
                                    <TextInput
                                        keyboardType="numeric"
                                        value={
                                            abilityValue === 0
                                                ? ''
                                                : abilityValue.toString()
                                        }
                                        onChangeText={(value) =>
                                            handleChange(
                                                abilityKey as Ability,
                                                value
                                            )
                                        }
                                        style={styles.abilityInputValue}
                                    />
                                ) : (
                                    <CustomText
                                        style={styles.abilityDisplayValue}
                                        color={theme.colors.primary}
                                        text={abilityValue.toString()}
                                    />
                                )}
                            </View>
                        );
                    }
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    ability: {
        justifyContent: 'center',
        flexDirection: 'row',
        display: 'flex',
        gap: theme.space.sm,
        minWidth: 100,
        alignItems: 'center',
    },
    abilityKey: {
        display: 'flex',
        textAlign: 'center',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
    },
    abilityInputValue: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        padding: theme.space.sm,
        marginTop: 4,
    },
    abilityDisplayValue: {
        flex: 1,
    },
});

export default AbilityForm;
