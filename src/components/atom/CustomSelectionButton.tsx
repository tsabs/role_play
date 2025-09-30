import { useCallback, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Button, Menu, Divider } from 'react-native-paper';
import Animated, { FadeIn } from 'react-native-reanimated';

import { theme } from '../../../style/theme';

import CustomText from './CustomText';

type SelectionButtonProps<T = number> = {
    onSelect: (value: T) => void;
    items: Array<{ label: string; value: T; selectable?: boolean }>;
    preSelectedValue?: { label: string; value: T };
    displayValue?: string;
    placeHolder?: string;
    textColor?: string;
    customStyle?: ViewStyle;
};

const CustomSelectionButton = <T = number,>({
    items,
    placeHolder = '',
    preSelectedValue,
    displayValue,
    onSelect,
    textColor,
    customStyle,
}: SelectionButtonProps<T>) => {
    const [visible, setVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<
        | {
              label: string;
              value: T;
          }
        | undefined
    >(preSelectedValue);

    const openMenu = useCallback(() => setVisible(true), []);
    const closeMenu = useCallback(() => setVisible(false), []);

    const handleSelect = useCallback(
        (item: { label: string; value: T; selectable?: boolean }) => {
            if (!item.selectable) return;
            setSelectedItem(item);
            onSelect(item.value);
            closeMenu();
        },
        [onSelect, closeMenu]
    );

    if (!items && items?.length === 0) {
        return;
    }

    return (
        <View style={customStyle ? customStyle : styles.container}>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <Button onPress={openMenu}>
                        {selectedItem ? (
                            <CustomText
                                fontWeight={'bold'}
                                color={textColor || theme.colors.textSecondary}
                                text={
                                    displayValue
                                        ? displayValue
                                        : `${selectedItem.label}`
                                }
                            />
                        ) : (
                            <CustomText fontWeight="200" text={placeHolder} />
                        )}
                    </Button>
                }
            >
                {items?.map((item, index) => (
                    <Animated.View
                        key={index}
                        entering={FadeIn.delay(index * 50)}
                    >
                        {item.selectable ? (
                            // Render selectable items (spells)
                            <Menu.Item
                                onPress={() => handleSelect(item)}
                                title={item.label}
                            />
                        ) : (
                            // Render non-selectable separators
                            <View style={styles.labelContainer}>
                                <CustomText
                                    fontWeight="bold"
                                    color={theme.colors.light}
                                    style={styles.sectionLabel}
                                    text={item.label}
                                />
                            </View>
                        )}
                        {index < items.length - 1 && <Divider />}
                    </Animated.View>
                ))}
            </Menu>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: theme.colors.primary,
        flexDirection: 'row',
    },
    labelContainer: {
        backgroundColor: theme.colors.primary,
    },
    sectionLabel: {
        marginVertical: theme.space.xxxl,
        marginHorizontal: theme.space.xxxl,
    },
});

export default CustomSelectionButton;
