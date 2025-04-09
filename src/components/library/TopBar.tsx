import { Fragment } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { Text } from 'react-native-paper';

import SafeView from './SafeView';
import { theme } from '../../../style/theme';

interface TopBarProps {
    elements: Array<{ text: string; screenName: string }>;
    props: MaterialTopTabBarProps;
}

const borderRadius = theme.radius.md;

const TopBar = ({ elements, props }: TopBarProps) => {
    return (
        <SafeView
            parentStyles={{ padding: 0, margin: 0, flex: 0 }}
            styles={styles().container}
        >
            {elements.map((element, index) => {
                const isSelected = index === props.state.index;
                return (
                    <Fragment key={index}>
                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.navigate(element.screenName);
                            }}
                            style={styles(isSelected, index).tabContainer}
                        >
                            <Text>{element.text}</Text>
                        </TouchableOpacity>
                    </Fragment>
                );
            })}
        </SafeView>
    );
};

const styles = (isSelected = false, index: number = 0) =>
    StyleSheet.create({
        container: {
            marginTop: theme.space.l,
            marginHorizontal: 40,
            height: 40,
            flexDirection: 'row',
        },
        tabContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: isSelected ? 1 : 0,
            borderBottomLeftRadius:
                isSelected && index === 0 ? borderRadius : 0,
            borderTopLeftRadius: isSelected && index === 0 ? borderRadius : 0,
            borderBottomRightRadius:
                isSelected && index === 1 ? borderRadius : 0,
            borderTopRightRadius: isSelected && index === 1 ? borderRadius : 0,
            borderColor: theme.colors.primary,
        },
        // selectedTabContainer: {
        //
        // }
    });

export default TopBar;
