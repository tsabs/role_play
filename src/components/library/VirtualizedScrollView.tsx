import { memo, ReactNode } from 'react';
import { FlatList, FlatListProps } from 'react-native';

const RenderItem = memo(({ children }: { children: ReactNode }) => children);

export const VirtualizedScrollView = ({ children, ...props }: any) => {
    return (
        <FlatList
            {...props}
            data={['placeholder']} // Keeps FlatList scrollable
            keyExtractor={(_, i) => 'dom' + i.toString()}
            ListEmptyComponent={null}
            renderItem={null}
            ListHeaderComponent={<RenderItem children={children} />}
            keyboardShouldPersistTaps="handled"
        />
    );
};

export default VirtualizedScrollView;
