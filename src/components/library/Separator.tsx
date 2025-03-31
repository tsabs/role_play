import { StyleSheet, View } from 'react-native';
import { theme } from '../../../style/theme';

const Separator = ({
    horizontal = false,
    spacer,
}: {
    horizontal?: boolean;
    spacer?: { size: number };
}) => {
    return !spacer ? (
        <View style={styles(horizontal).border} />
    ) : (
        <View style={styles(horizontal).spacer} />
    );
};

const styles = (horizontal: boolean, spacer?: number) =>
    StyleSheet.create({
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
