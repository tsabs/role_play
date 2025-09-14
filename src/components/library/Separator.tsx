import { StyleSheet, View } from 'react-native';

import { theme } from '../../../style/theme';

const Separator = ({
    horizontal = false,
    margin = 0,
    spacer,
}: {
    horizontal?: boolean;
    margin?: number;
    spacer?: { size: number };
}) => {
    return (
        <View style={styles(horizontal, margin).container}>
            {!spacer ? (
                <View style={styles(horizontal).border} />
            ) : (
                <View style={styles(horizontal).spacer} />
            )}
        </View>
    );
};

const styles = (horizontal: boolean, margin?: number, spacer?: number) =>
    StyleSheet.create({
        container: {
            paddingVertical: horizontal ? margin : 0,
            paddingHorizontal: horizontal ? 0 : margin,
        },
        border: {
            borderStyle: 'solid',
            borderBottomWidth: horizontal ? 1 : 0,
            borderRightWidth: horizontal ? 0 : 1,
            borderColor: theme.colors.secondary25,
        },
        spacer: {
            paddingBottom: horizontal ? spacer ?? theme.space.md : 0,
            paddingRight: horizontal ? 0 : spacer ?? theme.space.md,
        },
    });

export default Separator;
