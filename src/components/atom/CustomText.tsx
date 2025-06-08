import { Text, TextProps } from 'react-native';
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import { theme } from '../../../style/theme';

interface CustomTextProps extends TextProps {
    text: string;
    fontWeight?: TextStyle['fontWeight'];
    color?: string;
    fontSize?: number;
}

const CustomText = ({
    text,
    color = theme.colors.textPrimary,
    fontWeight = 'normal',
    fontSize = theme.fontSize.medium,
    style,
    ...props
}: CustomTextProps) => {
    const quickStyle: TextStyle = {
        color,
        fontWeight,
        fontSize,
    };

    return (
        <Text style={[style, quickStyle]} {...props}>
            {text}
        </Text>
    );
};

export default CustomText;
