import { Fragment } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/AntDesign';

import Separator from './Separator';
import Shadow from './Shadow';
import { theme } from '../../../style/theme';

const iconSize = 24;

interface BottomBarProps {
    elements: Array<{ icon: string; screenName: string }>;
    props: BottomTabBarProps;
}

const BottomBar = ({ elements, props }: BottomBarProps) => {
    return (
        <Shadow>
            <View style={styles.container}>
                {elements.map((element, index) => {
                    const isSelected = index === props.state.index;
                    return (
                        <Fragment key={index}>
                            <TouchableOpacity
                                style={
                                    isSelected
                                        ? styles.selectedIconContainer
                                        : styles.iconContainer
                                }
                                onPress={() =>
                                    props.navigation.navigate(
                                        element.screenName
                                    )
                                }
                            >
                                <Ionicons
                                    name={element.icon as any}
                                    size={iconSize}
                                    color={
                                        isSelected
                                            ? theme.colors.white
                                            : theme.colors.primary
                                    }
                                />
                            </TouchableOpacity>
                            <Separator />
                        </Fragment>
                    );
                })}
            </View>
        </Shadow>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        minHeight: 50,
        marginBottom: Platform.OS === 'ios' ? 20 : 0,
        flexDirection: 'row',
    },
    iconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedIconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
    },
});

export default BottomBar;
