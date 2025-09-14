import { useCallback, useState } from 'react';
import { IconButton } from 'react-native-paper';
import { Image, View, StyleSheet } from 'react-native';
import * as CustomImagePicker from 'expo-image-picker';

import CustomButton from '@components/atom/CustomButton';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@utils/utils';

import { theme } from '../../../style/theme';

interface ImagePickerProps {
    label: string;
    uri?: string;
    setUri?: (localUri: string) => void;
}

const ImagePicker = ({ label, uri, setUri }: ImagePickerProps) => {
    const [image, setImage] = useState<string | undefined>(uri);

    const pickImage = useCallback(async () => {
        // No permissions request is necessary for launching the image library
        let result = await CustomImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setUri(result.assets[0].uri);
            setImage(result.assets[0].uri);
        }
    }, [setUri]);

    return (
        <View style={styles.container}>
            <CustomButton
                textSize={theme.fontSize.large}
                buttonColor={theme.colors.light}
                textColor={theme.colors.textPrimary}
                text={label}
                onPress={pickImage}
            />
            {image && (
                <View style={styles.imageContainer}>
                    <IconButton
                        icon={'trash-can'}
                        size={40}
                        iconColor={theme.colors.danger}
                        onPress={() => setImage(undefined)}
                        style={styles.deleteButton}
                    />
                    <Image
                        source={{ uri: image }}
                        style={styles.imagePreview}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        position: 'relative',
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_HEIGHT * 0.4,
    },
    imagePreview: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: theme.radius.md,
    },
    deleteButton: {
        position: 'absolute',
        top: 0,
        zIndex: 2,
        right: 0,
    },
});

export default ImagePicker;
