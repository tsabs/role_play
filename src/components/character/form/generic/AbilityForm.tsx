import { useCallback, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import CustomText from '../../../atom/CustomText';
import { theme } from '../../../../../style/theme';
import { Ability } from '../../../../types/generic';
import { IconButton } from 'react-native-paper';
import { ABILITIES } from '../dnd5e/constants';

interface OnSaveAbilities<T extends Ability> {
    [key: string]: Record<T, number>;
}

interface AbilityFormProps<T extends Ability> {
    onChange: (updated: Record<T, number>) => void;
    onEditMode?: () => void;
    onSaveEdit?: (abilities: OnSaveAbilities<T>) => void;
    abilities?: Record<T, number>;
    isEditMode?: boolean;
    isEditModeEnabled?: boolean;
}

const AbilityForm = <T extends Ability>({
    abilities,
    onChange,
    onEditMode,
    onSaveEdit,
    isEditModeEnabled,
    isEditMode,
}: AbilityFormProps<T>) => {
    const [selectedAbility, setSelectedAbility] =
        useState<Record<T, number>>(abilities);
    const handleChange = useCallback(
        (key: Ability, value: string) => {
            const num = parseInt(value) || 0;
            const updated = { ...abilities, [key]: num };
            setSelectedAbility(updated);
            onChange(updated);
        },
        [abilities, onChange]
    );

    const handleChangeWithEditModeEnabled = useCallback(() => {
        if (isEditModeEnabled) {
            onSaveEdit({ abilities: selectedAbility });
        }
    }, [isEditModeEnabled, selectedAbility, onSaveEdit]);

    return (
        <View
            style={{
                flexDirection: 'row',
            }}
        >
            {isEditModeEnabled && (
                <View>
                    <IconButton
                        size={14}
                        onPress={onEditMode}
                        style={{ backgroundColor: theme.colors.secondary25 }}
                        icon={'pen'}
                    />
                    <IconButton
                        size={14}
                        onPress={handleChangeWithEditModeEnabled}
                        style={{ backgroundColor: theme.colors.secondary25 }}
                        icon={'check'}
                    />
                </View>
            )}

            <View style={styles.container}>
                {Object.entries(abilities || ABILITIES)?.map(
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
        justifyContent: 'space-evenly',
        alignSelf: 'center',
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
