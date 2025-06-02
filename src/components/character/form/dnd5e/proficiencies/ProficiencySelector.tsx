import { FC, Fragment, useCallback, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
    Checkbox,
    HelperText,
    Divider,
    TouchableRipple,
} from 'react-native-paper';
import {
    ElementIdentification,
    OptionChoice,
    ProficiencyOption,
} from '../../../../../types/games/d2d5e';
import { theme } from '../../../../../../style/theme';
import CustomText from '../../../../atom/CustomText';
import { useTranslation } from 'react-i18next';

type AbilityOption = {
    ability_score: ElementIdentification;
    bonus: number;
    option_type: 'ability_bonus';
};

type ChoiceOption = {
    option_type: 'choice';
    choice: ProficiencyOption;
};

type ProficiencySelectorProps = {
    data: ProficiencyOption;
    onChange?: (
        groupId: string,
        selectedIndexes: { index: string; bonus?: number }[]
    ) => void;
    groupId?: string;
};

const ProficiencySelector: FC<ProficiencySelectorProps> = ({
    data,
    onChange,
    groupId,
}) => {
    const { t } = useTranslation();
    const [selected, setSelected] = useState<
        { index: string; bonus?: number }[]
    >([]);
    const [collapsed, setCollapsed] = useState(false);

    const handleToggle = useCallback(
        (index: string, bonus?: number) => {
            let updated = [...selected];
            // console.log(index);
            const exists = updated.find((item) => item.index === index);
            if (exists) {
                updated = updated.filter((i) => i.index !== index);
            } else if (updated.length < data.choose) {
                if (bonus) {
                    updated.push({ index, bonus });
                } else {
                    updated.push({ index });
                }
            }
            // console.log('updated', updated, groupId);
            setSelected(updated);
            onChange?.(groupId ?? '', updated);
        },
        [selected, groupId, onChange]
    );

    const renderItem = useCallback(
        ({ item: option, index }) => {
            if (option.option_type === 'reference') {
                const ref = option as OptionChoice;
                const refOption = ref.item.index.includes('skill-')
                    ? ref.item.index.split('skill-')[1]
                    : ref.item.index;

                const isChecked = !!selected.find((i) => i.index === refOption);
                // const isGroupIdAndIsCheck = data.

                if (groupId === 'choice') {
                    // console.log('cool', ref.item.index);
                    // console.log('cool', ref.item);
                    // console.log('data', data);
                    // console.log('selected', selected);
                }

                return (
                    <Checkbox.Item
                        key={ref.item.index}
                        label={
                            ref.item.index.includes('skill-')
                                ? t(`character.skills.${refOption}.name`)
                                : t(
                                      `character.starting_selections.${refOption}.name`
                                  )
                        }
                        color={theme.colors.primary}
                        status={isChecked ? 'checked' : 'unchecked'}
                        onPress={() => handleToggle(refOption)}
                        disabled={!isChecked && selected.length >= data.choose}
                    />
                );
            }

            if (option.option_type === 'ability_bonus') {
                const ref = option as AbilityOption;
                const isChecked = !!selected.find(
                    (i) => i.index === ref.ability_score.index
                );
                return (
                    <Checkbox.Item
                        key={`race-ability-bonus-${ref.ability_score.index}`}
                        label={t(
                            `character.abilities.${ref.ability_score.name}`
                        )}
                        color={theme.colors.primary}
                        status={isChecked ? 'checked' : 'unchecked'}
                        onPress={() =>
                            handleToggle(ref.ability_score.index, ref.bonus)
                        }
                        disabled={!isChecked && selected.length >= data.choose}
                    />
                );
            }

            if (option.option_type === 'choice') {
                const choice = (option as unknown as ChoiceOption).choice;
                return (
                    <View key={`choice-${index}`} style={styles.nested}>
                        <Divider style={styles.divider} />
                        <ProficiencySelector
                            groupId={'choice'}
                            data={choice}
                            onChange={onChange}
                        />
                    </View>
                );
            }

            return null;
        },
        [data.choose, selected, handleToggle]
    );

    return (
        <View style={styles.groupContainer}>
            {data.desc ? (
                <TouchableRipple onPress={() => setCollapsed(!collapsed)}>
                    <View style={styles.containerDescription}>
                        <CustomText
                            style={{ flexWrap: 'wrap', flex: 1 }}
                            numberOfLines={3}
                            fontSize={16}
                            fontWeight="bold"
                            text={data?.desc_fr ? data.desc_fr : data.desc}
                        />
                        <CustomText
                            fontSize={16}
                            fontWeight="bold"
                            text={collapsed ? '▶ ' : '▼ '}
                        />
                    </View>
                </TouchableRipple>
            ) : null}
            {!collapsed && (
                <Fragment>
                    <FlatList
                        data={data.from.options}
                        renderItem={renderItem}
                    />
                    {selected.length < data.choose && (
                        <HelperText type="info">
                            Choose {data.choose - selected.length} more
                        </HelperText>
                    )}
                </Fragment>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    groupContainer: {
        paddingVertical: 8,
    },
    containerDescription: {
        gap: theme.space.sm,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: theme.space.sm,
    },
    nested: {
        marginTop: 8,
        paddingLeft: 8,
        borderLeftWidth: 1,
        borderColor: '#ccc',
    },
    divider: {
        marginVertical: 8,
    },
});

export default ProficiencySelector;
