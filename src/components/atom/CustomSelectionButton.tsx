import { FC, Fragment, useState } from 'react';
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
    customStyle?: ViewStyle;
};

const CustomSelectionButton = <T = number,>({
    items,
    placeHolder = '',
    preSelectedValue,
    displayValue,
    onSelect,
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

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const handleSelect = (item: { label: string; value: T }) => {
        setSelectedItem(item);
        onSelect(item.value);
        closeMenu();
    };

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
                                color={theme.colors.textSecondary}
                                text={
                                    displayValue
                                        ? displayValue
                                        : `Niveau ${selectedItem.label}`
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
