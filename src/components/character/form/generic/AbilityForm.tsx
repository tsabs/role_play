import { Fragment, useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import CustomText from '../../../atom/CustomText';
import { theme } from '../../../../../style/theme';
import { Ability } from '../../../../types/generic';
import { ABILITIES } from '../dnd5e/constants';

interface OnSaveAbilities<T extends Ability> {
    [key: string]: Record<T, number>;
}

interface AbilityFormProps<T extends Ability> {
    onChange: (updated: Record<T, number>) => void;
    abilityBonuses?: Array<{ index: string; bonus?: number }>;
    onEditMode?: () => void;
    onSaveEdit?: (abilities: OnSaveAbilities<T>) => void;
    abilities?: Record<T, number>;
    isEditMode?: boolean;
    isEditModeEnabled?: boolean;
    remainingPoints?: number;
    level?: number;
}

const AbilityForm = <T extends Ability>({
    abilities,
    abilityBonuses,
    onChange,
    onEditMode,
    onSaveEdit,
    isEditModeEnabled,
    isEditMode,
    remainingPoints,
    level = 1,
}: AbilityFormProps<T>) => {
    const { t } = useTranslation();
    const [selectedAbility, setSelectedAbility] =
        useState<Record<T, number>>(abilities);
    const handleChange = useCallback(
        (key: Ability, value: number) => {
            const updated = { ...abilities, [key]: value };
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
                        const ability = abilityBonuses?.find(
                            (abilityBonus) =>
                                abilityBonus.index === abilityKey.toLowerCase()
                        );
                        return (
                            <View key={abilityKey} style={styles.ability}>
                                {isEditMode ? (
                                    <View style={{ flexDirection: 'row' }}>
                                        <View>
                                            <IconButton
                                                icon={'plus'}
                                                size={14}
                                                style={{
                                                    backgroundColor:
                                                        theme.colors.primary,
                                                }}
                                                iconColor={theme.colors.white}
                                                onPress={() =>
                                                    handleChange(
                                                        abilityKey as Ability,
                                                        abilityValue + 1
                                                    )
                                                }
                                            />
                                            <IconButton
                                                onPress={() =>
                                                    handleChange(
                                                        abilityKey as Ability,
                                                        abilityValue - 1
                                                    )
                                                }
                                                iconColor={theme.colors.white}
                                                style={{
                                                    backgroundColor:
                                                        theme.colors.primary,
                                                }}
                                                size={14}
                                                icon={'minus'}
                                            />
                                        </View>
                                        <TextInput
                                            mode="outlined"
                                            keyboardType="numeric"
                                            disabled
                                            label={t(
                                                `character.abilities.${abilityKey}`
                                            )}
                                            value={
                                                abilityValue === 0
                                                    ? ''
                                                    : abilityValue.toString()
                                            }
                                            outlineStyle={{
                                                borderColor:
                                                    theme.colors.primary,
                                            }}
                                            textColor={theme.colors.textPrimary}
                                            outlineColor={theme.colors.primary}
                                            style={{
                                                marginVertical: theme.space.l,
                                            }}
                                        />
                                    </View>
                                ) : (
                                    <Fragment>
                                        <CustomText
                                            style={styles.abilityKey}
                                            text={t(
                                                `character.abilities.${abilityKey}`
                                            )}
                                        />
                                        <CustomText
                                            style={styles.abilityDisplayValue}
                                            color={theme.colors.primary}
                                            text={
                                                ability?.index ===
                                                abilityKey.toLowerCase()
                                                    ? `${
                                                          abilityValue +
                                                          ability.bonus
                                                      }`
                                                    : abilityValue.toString()
                                            }
                                        />
                                    </Fragment>
                                )}
                            </View>
                        );
                    }
                )}
                {isEditMode && remainingPoints >= 0 && (
                    <CustomText
                        style={{
                            marginBottom: theme.space.sm,
                        }}
                        text={`Points restants: ${remainingPoints}`}
                    />
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
        flex: 1,
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
    abilityDisplayValue: {
        flex: 1,
    },
});

export default AbilityForm;
