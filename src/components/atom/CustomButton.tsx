import {
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from 'react-native';

import { theme } from '../../../style/theme';

import CustomText from './CustomText';

interface ButtonProps extends TouchableOpacityProps {
    text: string;
    radius?: number;
    buttonColor?: string;
    textColor?: string;
    textSize?: number;
}

const CustomButton = ({
    text,
    radius = theme.radius.md,
    buttonColor = theme?.colors.primary,
    textColor = theme?.colors.white,
    textSize = theme.fontSize.medium,
    style,
    ...props
}: ButtonProps) => {
    const quickStyle: ViewStyle = {
        borderRadius: radius,
        backgroundColor: props.disabled ? theme.colors.secondary : buttonColor,
    };
    return (
        <TouchableOpacity style={[quickStyle, style]} {...props}>
            <CustomText
                style={{
                    padding: theme.space.md,
                    textAlign: 'center',
                }}
                fontSize={textSize}
                color={textColor}
                text={text}
            />
        </TouchableOpacity>
    );
};

export default CustomButton;
