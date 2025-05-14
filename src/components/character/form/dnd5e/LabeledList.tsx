import { Fragment } from 'react';
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

const LabeledList = <T = DndClass[] | DndRace[] | DndBackground[],>({
    name,
    values,
    setSelectedValue,
    selectedName,
}: {
    name: string;
    values: T[];
    setSelectedValue: (value: any) => void;
    selectedName?: string;
}) => {
    const { t } = useTranslation();
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
                        text={
                            name === 'Backgrounds'
                                ? t(
                                      `character.${name.toLowerCase()}.${selectedName}.name`
                                  )
                                : t(
                                      `character.${name.toLowerCase()}.${selectedName}`
                                  )
                        }
                        style={styles(spacer).subText}
                    />
                )}
            </View>
            <FlatList
                data={values}
                keyExtractor={(item: any) =>
                    item?.slug ? item.slug : item.index
                }
                horizontal
                renderItem={({ item, index }) => (
                    <Animated.View
                        style={{ flexDirection: 'column' }}
                        entering={FadeInLeft.delay(index * 100)}
                    >
                        <TouchableOpacity
                            style={[
                                styles(spacer).choiceButton,
                                selectedName ===
                                    (item?.slug ? item.slug : item.index) &&
                                    styles(spacer).selected,
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
                                    styles(
                                        spacer,
                                        selectedName ===
                                            (item?.slug
                                                ? item.slug
                                                : item.index)
                                    ).choiceText
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
                    </Animated.View>
                )}
            />
        </Fragment>
    );
};

export default LabeledList;
