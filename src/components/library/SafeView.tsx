import { ReactNode } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconButton, Text } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import { theme } from '../../../style/theme';
import CustomText from '../atom/CustomText';

const headerHeight = 50;

interface SafeViewProps {
    children: ReactNode;
    isLoading?: boolean;
    title?: string;
    styles?: StyleProp<ViewStyle>;
    customBackNavigation?: () => void;
    parentStyles?: StyleProp<ViewStyle>;
}

const SafeView = ({
    title,
    isLoading,
    parentStyles,
    customBackNavigation,
    styles,
    children,
}: SafeViewProps) => {
    const navigation = useNavigation();
    return (
        <View style={[SafeViewStyle.container, parentStyles]}>
            <StatusBar
                backgroundColor={theme.colors.primary}
                translucent={false}
            />
            {title && (
                <View style={SafeViewStyle.header}>
                    <IconButton
                        size={30}
                        icon={'keyboard-backspace'}
                        disabled={isLoading}
                        onPress={() =>
                            customBackNavigation
                                ? customBackNavigation()
                                : navigation.goBack()
                        }
                    />
                    <View style={SafeViewStyle.textContainer}>
                        <CustomText
                            fontSize={theme.fontSize.extraLarge}
                            text={title}
                        />
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
        marginTop: Platform.OS === 'ios' ? 40 : 10,
        backgroundColor: theme.colors.light25,
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
