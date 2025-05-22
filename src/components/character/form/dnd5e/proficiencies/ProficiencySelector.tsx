import { FC, Fragment, useCallback, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
    Checkbox,
    HelperText,
    Divider,
    TouchableRipple,
} from 'react-native-paper';
import {
    OptionChoice,
    ProficiencyOption,
} from '../../../../../types/games/d2d5e';
import { theme } from '../../../../../../style/theme';
import CustomText from '../../../../atom/CustomText';

type ChoiceOption = {
    option_type: 'choice';
    choice: ProficiencyOption;
};

type ProficiencySelectorProps = {
    data: ProficiencyOption;
    onChange?: (groupId: string, selectedIndexes: string[]) => void;
    groupId?: string;
};

const ProficiencySelector: FC<ProficiencySelectorProps> = ({
    data,
    onChange,
    groupId,
}) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [collapsed, setCollapsed] = useState(false);

    const handleToggle = (index: string) => {
        let updated = [...selected];
        if (updated.includes(index)) {
            updated = updated.filter((i) => i !== index);
        } else if (updated.length < data.choose) {
            updated.push(index);
        }
        setSelected(updated);
        onChange?.(groupId ?? '', updated);
    };

    const renderItem = useCallback(
        ({ item: option, index }) => {
            if (option.option_type === 'reference') {
                const ref = option as OptionChoice;
                const isChecked = selected.includes(ref.item.index);
                return (
                    <Checkbox.Item
                        key={ref.item.index}
                        label={ref.item.name}
                        color={theme.colors.primary}
                        status={isChecked ? 'checked' : 'unchecked'}
                        onPress={() => handleToggle(ref.item.index)}
                        disabled={!isChecked && selected.length >= data.choose}
                    />
                );
            }

            if (option.option_type === 'choice') {
                const choice = (option as unknown as ChoiceOption).choice;
                return (
                    <View key={`choice-${index}`} style={styles.nested}>
                        <Divider style={styles.divider} />
                        <ProficiencySelector data={choice} />
                    </View>
                );
            }

            return null;
        },
        [data.choose, selected]
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
                            text={data.desc}
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
