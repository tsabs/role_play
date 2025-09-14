import { StyleSheet } from 'react-native';

import { theme } from '../../../../../style/theme.ts';

export const genericClassFormStyles = StyleSheet.create({
    container: { padding: theme.space.l },
    title: { marginBottom: theme.space.md },
    sectionTitle: { marginTop: theme.space.xl },
});
