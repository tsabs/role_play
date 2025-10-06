import { useTranslation } from 'react-i18next';

import SafeView from '@components/library/SafeView';
import VirtualizedScrollView from '@components/library/VirtualizedScrollView';

export const AccordionContentModal = ({ route }) => {
    const { content, title } = route.params;
    const { t } = useTranslation();

    return (
        <SafeView title={t(title)}>
            <VirtualizedScrollView
                contentContainerStyle={{
                    paddingBottom: 50,
                }}
            >
                {content}
            </VirtualizedScrollView>
        </SafeView>
    );
};
