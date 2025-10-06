import { Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const removeDuplicate = (arr: any[], fieldToCheck?: string) => {
    return arr.filter((item, index, self) => {
        return (
            index ===
            self.findIndex((t) => {
                if (fieldToCheck) {
                    return t[fieldToCheck].index === item[fieldToCheck].index;
                }
                return t.index === item.index;
            })
        );
    });
};

const capitalizeFirstLetter = (word: string): string => {
    if (!word) return word; // Handle empty string
    return word.charAt(0).toUpperCase() + word.slice(1);
};

export {
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    WINDOW_WIDTH,
    WINDOW_HEIGHT,
    capitalizeFirstLetter,
    removeDuplicate,
};
