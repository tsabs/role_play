import { Fragment, useMemo } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './characterFormStyles';
import { Text } from 'react-native-paper';
import Animated, { FadeInLeft } from 'react-native-reanimated';

import {
    DndBackground,
    DndClass,
    DndRace,
} from '../../../../types/games/d2d5e';
import CustomText from '../../../atom/CustomText';
import { theme } from '../../../../../style/theme';

const spacer = 20;

const chunkArray = (arr: any[], size: number) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
};

const LabeledList = <T = DndClass[] | DndRace[] | DndBackground[],>({
    name,
    values,
    setSelectedValue,
    selectedName,
    itemsPerColumn = 1,
}: {
    name: string;
    values: T[];
    setSelectedValue: (value: any) => void;
    selectedName?: string;
    itemsPerColumn?: number;
}) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = 'fr';

    const sortedValues = useMemo(
        () =>
            [...values].sort((a: any, b: any) => {
                const nameA = a?.slug
                    ? t(`character.backgrounds.${a.slug}.name`)
                    : t(`character.${name.toLowerCase()}.${a.index}.name`);
                const nameB = b?.slug
                    ? t(`character.backgrounds.${b.slug}.name`)
                    : t(`character.${name.toLowerCase()}.${b.index}.name`);
                return nameA.localeCompare(nameB, currentLanguage);
            }),
        [values, currentLanguage]
    );

    const groupedValues = useMemo(
        () => chunkArray(sortedValues, itemsPerColumn),
        [sortedValues, itemsPerColumn]
    );

    return (
        <Fragment>
            <View style={styles(spacer).selectedValue}>
                <CustomText
                    text={t(`characterForm.listSelect${name}`)}
                    fontSize={theme.fontSize.large}
                    style={styles(spacer).subTitle}
                />
                {selectedName && (
                    <CustomText
                        text={t(
                            `character.${name.toLowerCase()}.${selectedName}.name`
                        )}
                        fontSize={theme.fontSize.large}
                        fontWeight="bold"
                        style={styles(spacer).subText}
                    />
                )}
            </View>

            <FlatList
                data={groupedValues}
                horizontal
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item: column, index: columnIndex }) => (
                    <Animated.View
                        entering={FadeInLeft.delay(columnIndex * 100)}
                    >
                        {column.map((item: any) => {
                            const itemKey = item?.slug || item.index;
                            const isSelected = selectedName === itemKey;

                            return (
                                <TouchableOpacity
                                    key={itemKey}
                                    style={[
                                        styles(spacer).choiceButton,
                                        isSelected && styles(spacer).selected,
                                    ]}
                                    onPress={() =>
                                        item.slug
                                            ? setSelectedValue({
                                                  name: item.slug,
                                                  description: item.desc,
                                              })
                                            : setSelectedValue(item.index)
                                    }
                                >
                                    <Text
                                        style={
                                            styles(spacer, isSelected)
                                                .choiceText
                                        }
                                    >
                                        {item?.slug
                                            ? t(
                                                  `character.backgrounds.${item.slug}.name`
                                              )
                                            : t(
                                                  `character.${name.toLowerCase()}.${
                                                      item.index
                                                  }.name`
                                              )}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </Animated.View>
                )}
            />
        </Fragment>
    );
};

export default LabeledList;
