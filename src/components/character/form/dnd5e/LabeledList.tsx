import { Fragment, ReactElement, useMemo } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native-paper';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { DndBackground, DndClass, DndRace } from 'types/games/d2d5e';

import CustomText from '@components/atom/CustomText';

import { theme } from '../../../../../style/theme';

import { styles } from './characterFormStyles';

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
    listLabel,
    listLabelSelected,
    values,
    renderItem,
    setSelectedValue,
    selectedName,
    displaySkills,
    itemsPerColumn = 1,
}: {
    name: string;
    listLabel: string;
    listLabelSelected: string;
    values: T[];
    renderItem?: (item: any) => ReactElement;
    displaySkills?: () => ReactElement;
    setSelectedValue: (value: any) => void;
    selectedName?: string;
    itemsPerColumn?: number;
}) => {
    const { t } = useTranslation();
    const currentLanguage = 'fr';

    const sortedValues = useMemo(
        () =>
            [...values].sort((a: any, b: any) => {
                const nameA = t(
                    `character.${name.toLowerCase()}.${a.index}.name`
                );
                const nameB = t(
                    `character.${name.toLowerCase()}.${b.index}.name`
                );
                return nameA.localeCompare(nameB, currentLanguage);
            }),
        [values, t, name]
    );

    const groupedValues = useMemo(
        () => chunkArray(renderItem ? values : sortedValues, itemsPerColumn),
        [renderItem, values, sortedValues, itemsPerColumn]
    );

    return (
        <Fragment>
            <View style={styles(spacer).selectedValue}>
                <CustomText
                    text={t(listLabel)}
                    fontSize={theme.fontSize.large}
                    style={styles(spacer).subTitle}
                />
                {selectedName && (
                    <CustomText
                        text={t(listLabelSelected)}
                        fontSize={theme.fontSize.large}
                        fontWeight="bold"
                        style={styles(spacer).subText}
                    />
                )}
            </View>

            {displaySkills?.()}

            <FlatList
                data={groupedValues}
                horizontal
                keyExtractor={(_, index) => index.toString()}
                renderItem={
                    renderItem
                        ? renderItem
                        : ({ item: column, index: columnIndex }) => (
                              <Animated.View
                                  entering={FadeInLeft.delay(columnIndex * 100)}
                              >
                                  {column.map((item: any) => {
                                      const itemKey = item.index;
                                      const isSelected =
                                          selectedName === itemKey;

                                      return (
                                          <TouchableOpacity
                                              key={itemKey}
                                              style={[
                                                  styles(spacer).choiceButton,
                                                  isSelected &&
                                                      styles(spacer).selected,
                                              ]}
                                              onPress={() =>
                                                  setSelectedValue(item.index)
                                              }
                                          >
                                              <Text
                                                  style={
                                                      styles(spacer, isSelected)
                                                          .choiceText
                                                  }
                                              >
                                                  {t(
                                                      `character.${name.toLowerCase()}.${
                                                          item.index
                                                      }.name`
                                                  )}
                                              </Text>
                                          </TouchableOpacity>
                                      );
                                  })}
                              </Animated.View>
                          )
                }
            />
        </Fragment>
    );
};

export default LabeledList;
