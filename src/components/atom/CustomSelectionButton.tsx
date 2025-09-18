import { FC, Fragment, useCallback, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Button, Menu, Divider, Provider } from 'react-native-paper';

import { theme } from '../../../style/theme';

import CustomText from './CustomText';

type SelectionButtonProps<T = number> = {
    items: Array<{ label: string; value: T }>;
    onSelect: (value: T) => void;
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
        (item: { label: string; value: T }) => {
            setSelectedItem(item);
            onSelect(item.value);
            closeMenu();
        },
        [onSelect, closeMenu]
    );

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
                            <CustomText text={placeHolder} />
                        )}
                    </Button>
                }
            >
                {items.map((item, index) => (
                    <Fragment key={index}>
                        <Menu.Item
                            onPress={() => handleSelect(item)}
                            title={item.label}
                        />
                        {index < items.length - 1 && <Divider />}
                    </Fragment>
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
});

export default CustomSelectionButton;
