import { StyleSheet } from 'react-native';
import { theme } from '../../../../../style/theme';

export const styles = (
    spacer: number,
    isSelected?: boolean,
    isDisabled?: boolean
) =>
    StyleSheet.create({
        container: { paddingHorizontal: spacer },
        subTitle: {
            fontSize: theme.fontSize.extraLarge,
            marginTop: spacer,
        },
        subText: {
            fontSize: theme.fontSize.extraLarge,
            marginTop: spacer,
        },
        selectedValue: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme.space.xs,
            alignItems: 'center',
        },
        choiceButton: {
            padding: 10,
            backgroundColor: theme.colors.secondary25,
            borderRadius: theme.radius.sm,
            marginHorizontal: theme.space.xs,
        },
        selected: {
            alignSelf: 'flex-start',
            backgroundColor: theme.colors.primary,
        },
        choiceText: {
            fontSize: theme.fontSize.large,
            color: isSelected ? theme.colors.white : theme.colors.textPrimary,
        },
        saveButton: {
            backgroundColor: isDisabled
                ? theme.colors.secondary25
                : theme.colors.primary,
            padding: theme.space.xxl,
            borderRadius: theme.radius.md,
            marginTop: theme.space.xxxl,
            alignItems: 'center',
        },
        saveButtonText: { color: 'white', fontSize: 18 },
    });
