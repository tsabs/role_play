import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/AntDesign';
import { theme } from '../../../style/theme';
import Separator from './Separator';
import Shadow from './Shadow';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Fragment } from 'react';

const iconSize = 24;

interface BottomBarProps {
    elements: Array<{ icon: string; screenName: string }>;
    props: BottomTabBarProps;
}

const BottomBar = ({ elements, props }: BottomBarProps) => {
    return (
        <Shadow>
            <View style={styles.container}>
                {elements.map((element) => {
                    return (
                        <Fragment>
                            <TouchableOpacity
                                style={styles.iconContainer}
                                onPress={() =>
                                    props.navigation.navigate(
                                        element.screenName
                                    )
                                }
                            >
                                <Ionicons
                                    name={element.icon as any}
                                    size={iconSize}
                                    color={theme.colors.primary}
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
        flexDirection: 'row',
    },
    iconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
    },
});

export default BottomBar;
