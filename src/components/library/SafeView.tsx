import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import { theme } from '../../../style/theme';

const headerHeight = 50;

interface SafeViewProps {
    children: ReactNode;
    title?: string;
    styles?: StyleProp<ViewStyle>;
    parentStyles?: StyleProp<ViewStyle>;
}

const SafeView = ({ title, parentStyles, styles, children }: SafeViewProps) => {
    const navigation = useNavigation();
    return (
        <View style={[SafeViewStyle.container, parentStyles]}>
            <StatusBar translucent={false} />
            {title && (
                <View style={SafeViewStyle.header}>
                    <IconButton
                        size={30}
                        icon={'keyboard-backspace'}
                        onPress={() => navigation.goBack()}
                    />
                    <View style={SafeViewStyle.textContainer}>
                        <Text variant={'titleLarge'}>{title}</Text>
                    </View>
                </View>
            )}
            <View style={[styles]}>{children}</View>
        </View>
    );
};

const SafeViewStyle = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.space.xxxl,
        marginTop: 45,
        backgroundColor: '#f0f0f0',
    },
    header: {
        width: theme.width,
        height: headerHeight,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginRight: 75,
    },
});

export default SafeView;
