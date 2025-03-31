import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '../../../style/theme';

type ShadowProps = {
    children: ReactNode;
    style?: ViewStyle;
    colors?: [string, string, ...string[]]; // Custom gradient colors for shadow
    intensity?: number; // Adjust shadow strength (opacity)
};

export const Shadow = ({
    children,
    style,
    colors = [theme.colors.dark, theme.colors.secondary, theme.colors.light], // Default soft shadow
    intensity = 0.5,
}: ShadowProps) => {
    return (
        <View style={[styles.container, style]}>
            <LinearGradient
                colors={colors}
                start={{ x: 0.5, y: 4 }}
                end={{ x: 0.5, y: 0 }}
                style={[styles.shadow, { opacity: intensity }]}
            />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    shadow: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: -4, // Adjust shadow position
        height: 4, // Control shadow spread
        borderRadius: 10,
    },
});

export default Shadow;
