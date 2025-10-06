import { Fragment, useCallback, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Ability } from 'types/generic';

import CustomText from '@components/atom/CustomText';
import EditMode from '@components/library/EditMode';
import { selectCharacterById } from '@store/character/selectors';
import { useAppSelector } from '@store/index';

import { theme } from '../../../../../style/theme';
import { ABILITIES } from '../dnd5e/constants';

interface OnSaveAbilities<T extends Ability> {
    [key: string]: Record<T, number>;
}

interface AbilityFormProps<T extends Ability> {
    characterId?: string;
    onChange?: (updated: Record<T, number>) => void;
    abilityBonuses?: Array<{ index: string; bonus?: number }>;
    onSaveEdit?: (abilities: OnSaveAbilities<T>) => void;
    isEditModeEnabled?: boolean;
    remainingPoints?: (abilities: Record<Ability, number>) => number;
}

const AbilityForm = <T extends Ability>({
    characterId,
    abilityBonuses,
    onChange,
    onSaveEdit,
    isEditModeEnabled,
    remainingPoints,
}: AbilityFormProps<T>) => {
    const { t } = useTranslation();
    const abilities = useAppSelector(selectCharacterById(characterId))
        ?.abilities;
    const [isLocalEditMode, setIsLocalEditMode] = useState(!isEditModeEnabled);
    const [selectedAbilities, setSelectedAbilities] = useState<
        Record<T, number>
    >((abilities || ABILITIES) as Record<Ability, number>);
    const handleChange = useCallback(
        (key: Ability, value: number) => {
            const updated = { ...selectedAbilities, [key]: value };
            onChange?.(updated);
            setSelectedAbilities(updated);
        },
        [onChange, selectedAbilities]
    );

    const handleLocalEditMode = useCallback(() => {
        setIsLocalEditMode(!isLocalEditMode);
    }, [isLocalEditMode]);

    const handleChangeWithEditModeEnabled = useCallback(() => {
        if (isLocalEditMode) {
            onSaveEdit({ abilities: selectedAbilities });
        }
        setIsLocalEditMode(false);
    }, [isLocalEditMode, selectedAbilities, onSaveEdit]);

    const getRemainingPoints = useMemo(() => {
        return remainingPoints(selectedAbilities as Record<Ability, number>);
    }, [remainingPoints, selectedAbilities]);

    return (
        <View
            style={{
                flexDirection: 'row',
            }}
        >
            {isEditModeEnabled && (
                <EditMode
                    isEditModeEnabled
                    isOnEdit={isLocalEditMode}
                    handleChange={handleLocalEditMode}
                    handleSave={handleChangeWithEditModeEnabled}
                />
            )}

            <View style={styles.container}>
                {Object.entries(selectedAbilities || ABILITIES)?.map(
                    ([abilityKey, abilityValue]) => {
                        const ability = abilityBonuses?.find(
                            (abilityBonus) =>
                                abilityBonus.index === abilityKey.toLowerCase()
                        );
                        return (
                            <View key={abilityKey} style={styles.ability}>
                                {isLocalEditMode ? (
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
                {isLocalEditMode && getRemainingPoints >= 0 && (
                    <CustomText
                        style={{
                            marginBottom: theme.space.sm,
                        }}
                        text={`Points restants: ${getRemainingPoints}`}
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
