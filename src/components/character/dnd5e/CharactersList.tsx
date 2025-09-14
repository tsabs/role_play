import React, { FC } from 'react';
import { FlatList, View } from 'react-native';
import { Character } from 'types/generic';

import CharacterItem from '@components/character/CharacterItem';
import Separator from '@components/library/Separator';

import { theme } from '../../../../style/theme';

type CharacterListProps = {
    characters: Character[];
    sessionId?: string;
    mode?: string;
    gmId?: string;
};

export const CharactersList: FC<CharacterListProps> = ({
    characters,
    sessionId,
    mode = 'characters',
    gmId,
}) => {
    return (
        <View>
            <FlatList
                data={characters}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={({ leadingItem }) => (
                    <Separator
                        key={leadingItem.id}
                        horizontal
                        spacer={{ size: theme.space.md }}
                    />
                )}
                renderItem={({ item, index }) => (
                    <CharacterItem
                        key={item.id}
                        character={item}
                        index={index}
                        mode={mode}
                        sessionId={sessionId}
                        gmId={gmId}
                    />
                )}
            />
        </View>
    );
};
