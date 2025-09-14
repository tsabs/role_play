import { ReactNode, useMemo } from 'react';
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
    rightIcon?: ReactNode;
    styles?: StyleProp<ViewStyle>;
    customBackNavigation?: () => void;
    parentStyles?: StyleProp<ViewStyle>;
}

const SafeView = ({
    title,
    isLoading,
    parentStyles,
    rightIcon,
    customBackNavigation,
    styles,
    children,
}: SafeViewProps) => {
    const navigation = useNavigation();

    const textContainer = useMemo<ViewStyle>(() => {
        return {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            marginRight: !!rightIcon ? 30 : 30 * 2,
        };
    }, [rightIcon]);

    return (
        <View style={[SafeViewStyle.container, parentStyles]}>
            <StatusBar
                backgroundColor={theme.colors.primary}
                translucent={false}
            />
            <View style={{ flexDirection: 'row' }}>
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
                    </View>
                )}
                <View style={textContainer}>
                    <CustomText
                        fontSize={theme.fontSize.extraLarge}
                        text={title}
                    />
                </View>
                {rightIcon && (
                    <View style={SafeViewStyle.rightIcon}>{rightIcon}</View>
                )}
            </View>

            <View style={[styles]}>{children}</View>
        </View>
    );
};

const SafeViewStyle = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.space.xxxl,
        marginTop: Platform.OS === 'ios' ? 40 : 0,
        backgroundColor: theme.colors.light25,
    },
    header: {
        flex: 0,
        height: headerHeight,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightIcon: {
        flex: 0,
        alignItems: 'flex-end',
    },
});

export default SafeView;
