import { ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Button, IconButton, Text } from 'react-native-paper'
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native'

import { theme } from '../../style/theme'

const headerHeight = 50

interface SafeViewProps {
    children: ReactNode
    hasHeader?: boolean
    parentStyles?: StyleProp<ViewStyle>
}

const SafeView = ({ hasHeader, parentStyles, children }: SafeViewProps) => {
    const navigation = useNavigation()
    return (
        <View style={[styles.container, parentStyles]}>
            <StatusBar />
            {hasHeader && (
                <View style={{ width: theme.width, height: headerHeight }}>
                    <IconButton
                        icon={'arrowBack'}
                        onPress={() => navigation.goBack()}
                    />
                </View>
            )}
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginTop: 40,
        backgroundColor: '#f0f0f0',
    },
})

export default SafeView
