import { View, ViewStyle } from 'react-native';
import { IconButton } from 'react-native-paper';

import { theme } from '../../../style/theme';

interface EditModeProps {
    isEditModeEnabled: boolean;
    handleChange: () => void;
    handleSave: () => void;
    isOnEdit?: boolean;
    saveDisabled?: boolean;
    style?: ViewStyle;
}

const EditMode = ({
    isEditModeEnabled,
    handleChange,
    isOnEdit,
    handleSave,
    saveDisabled,
    style,
}: EditModeProps) => {
    return (
        isEditModeEnabled && (
            <View style={style}>
                <IconButton
                    size={18}
                    onPress={handleChange}
                    iconColor={theme.colors.white}
                    style={{
                        backgroundColor: theme.colors.primary,
                    }}
                    icon={isOnEdit ? 'close' : 'pen'}
                />
                <IconButton
                    size={18}
                    onPress={handleSave}
                    iconColor={theme.colors.white}
                    style={{
                        backgroundColor: theme.colors.primary,
                    }}
                    disabled={saveDisabled}
                    icon={'check'}
                />
            </View>
        )
    );
};

export default EditMode;
