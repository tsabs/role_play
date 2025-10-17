import { useCallback } from 'react';
import { Alert, Linking } from 'react-native';

import CustomButton from '@components/atom/CustomButton';

interface OpenURLButtonProps {
    url: string;
    text: string;
}

export const OpenURLButton = ({ url, text }: OpenURLButtonProps) => {
    const handlePress = useCallback(async () => {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Don't know how to open this URL: ${url}`);
        }
    }, [url]);

    return <CustomButton text={text} onPress={handlePress} />;
};
