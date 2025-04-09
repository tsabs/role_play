import {
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from 'react-native';

import CustomText from './CustomText';
import { theme } from '../../../style/theme';

interface ButtonProps extends TouchableOpacityProps {
    text: string;
    radius?: number;
    buttonColor?: string;
    textColor?: string;
}

const CustomButton = ({
    text,
    radius = theme.radius.md,
    buttonColor = theme?.colors.primary,
    textColor = theme?.colors.white,
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
                color={textColor}
                text={text}
            />
        </TouchableOpacity>
    );
};

export default CustomButton;
