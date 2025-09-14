import { Fragment } from 'react';
import {
    Animated,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
} from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { Text } from 'react-native-paper';

import { theme } from '../../../style/theme';

import SafeView from './SafeView';

interface TopBarProps {
    elements: Array<{ text: string; screenName: string }>;
    props: MaterialTopTabBarProps;
}

const TopBar = ({ elements, props }: TopBarProps) => {
    const { width } = useWindowDimensions();
    const tabWidth = width / elements.length;

    const translateX = Animated.multiply(
        props.position,
        new Animated.Value(tabWidth)
    );

    return (
        <SafeView
            title={'Prise de note'}
            customBackNavigation={() => props.navigation.goBack()}
            parentStyles={{ padding: 0, margin: 0, flex: 0 }}
            styles={styles.container}
        >
            {elements.map((element, index) => {
                return (
                    <Fragment key={index}>
                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.navigate(element.screenName);
                            }}
                            style={styles.tabContainer}
                        >
                            <Text>{element.text}</Text>
                        </TouchableOpacity>
                    </Fragment>
                );
            })}
            {/* Animated border */}
            <Animated.View
                style={[
                    styles.animatedBorder,
                    {
                        width: tabWidth - 40,
                        transform: [{ translateX }],
                    },
                ]}
            />
        </SafeView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: theme.space.l,
        height: 40,
        flexDirection: 'row',
    },
    tabContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    animatedBorder: {
        position: 'absolute',
        borderBottomWidth: 1,
        flex: 1,
        marginHorizontal: 20,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.md,
        top: 0,
        bottom: 0,
        backgroundColor: theme.colors.transparent,
    },
});

export default TopBar;
