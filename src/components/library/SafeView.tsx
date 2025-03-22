import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { IconButton } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import { theme } from '../../../style/theme';

const headerHeight = 50;

interface SafeViewProps {
    children: ReactNode;
    hasHeader?: boolean;
    styles?: StyleProp<ViewStyle>;
    parentStyles?: StyleProp<ViewStyle>;
}

const SafeView = ({
    hasHeader,
    parentStyles,
    styles,
    children,
}: SafeViewProps) => {
    const navigation = useNavigation();
    return (
        <View style={[SafeViewStyle.container, parentStyles]}>
            <StatusBar />
            {hasHeader && (
                <View style={{ width: theme.width, height: headerHeight }}>
                    <IconButton
                        icon={'arrowBack'}
                        onPress={() => navigation.goBack()}
                    />
                </View>
            )}
            <View style={[styles]}>{children}</View>
        </View>
    );
};

const SafeViewStyle = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginTop: 40,
        backgroundColor: '#f0f0f0',
    },
});

export default SafeView;
