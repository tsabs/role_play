import { Dimensions } from 'react-native';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

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
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    white: '#ffffff',
    black: '#000000',
};

const theme = {
    width,
    height,
    space,
    colors,
};

export { theme };
