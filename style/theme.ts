import { Dimensions } from 'react-native';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const radius = {
    xs: 4,
    sm: 8,
    md: 12,
    l: 16,
    xl: 20,
    xxl: 24,
};

const space = {
    xs: 4,
    sm: 6,
    md: 8,
    l: 10,
    xl: 12,
    xxl: 14,
    xxxl: 16,
};

const colors = {
    primary: '#007bff',
    secondary: '#6c757d',
    secondary75: 'rgba(108, 117, 125, 0.75)',
    secondary50: 'rgba(108, 117, 125, 0.5)',
    secondary25: 'rgba(108, 117, 125, 0.25)',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    light75: 'rgba(248, 249, 250, 0.75)',
    light50: 'rgba(248, 249, 250, 0.50)',
    light25: 'rgba(248, 249, 250, 0.25)',
    dark: '#343a40',
    white: '#ffffff',
    black: '#000000',
};

const fontSize = {
    extraSmall: 8,
    small: 12,
    medium: 14,
    large: 16,
    extraLarge: 18,
    big: 20,
    extraBig: 24,
};

const theme = {
    width,
    height,
    space,
    colors,
    fontSize,
    radius,
};

export { theme };
