import { useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Button, Text, Title } from 'react-native-paper';

import { DAND_INTRO, WARHAMMER_INTRO } from '../../../assets';
import SafeView from '../../components/library/SafeView';
import { theme } from '../../../style/theme';
import { gameType, Game } from '../../store/game/types';
import { gameSlice } from '../../store/game/slice';
import { GameCard } from '../../components/game/Game';

const parties: Game[] = [
    {
        id: 0,
        gameType: gameType.warHammer,
        title: 'Aventure Médiévale',
        image: WARHAMMER_INTRO,
        nbPlayers: 5,
        gameMaster: 'John Doe',
    },
    {
        id: 1,
        gameType: gameType.dungeonsAndDragons,
        title: 'Science Fiction',
        image: DAND_INTRO,
        nbPlayers: 4,
        gameMaster: 'Jane Doe',
    },
    {
        id: 2,
        gameType: gameType.dungeonsAndDragons,
        title: 'Science Fiction',
        image: DAND_INTRO,
        nbPlayers: 4,
        gameMaster: 'Jane Doe',
    },
    {
        id: 3,
        gameType: gameType.dungeonsAndDragons,
        title: 'Science Fiction',
        image: DAND_INTRO,
        nbPlayers: 4,
        gameMaster: 'Jane Doe',
    },
    {
        id: 4,
        gameType: gameType.dungeonsAndDragons,
        title: 'Science Fiction',
        image: DAND_INTRO,
        nbPlayers: 4,
        gameMaster: 'Jane Doe',
    },
];

const Games = () => {
    useEffect(() => {
        gameSlice.actions.setGames(parties);
    }, []);
    return (
        <SafeView>
            <View style={styles.header}>
                <View style={styles.title}>
                    {parties.length > 0 && (
                        <Title>Liste des campagnes en cours</Title>
                    )}
                </View>
                <Button
                    buttonColor={theme.colors.primary}
                    onPress={() => console.log('Create a new game')}
                >
                    <Text style={styles.buttonText}>
                        Créer une nouvelle partie
                    </Text>
                </Button>
            </View>
            <Animated.FlatList
                data={parties}
                ListFooterComponent={() => <View style={{ height: 100 }} />}
                renderItem={(game) => <GameCard game={game.item} />}
                keyExtractor={(item, index) => index.toString()}
            ></Animated.FlatList>
        </SafeView>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: theme.space.md,
    },
    buttonText: {
        color: theme.colors.white,
    },
    title: {
        alignItems: 'center',
    },
});

export default Games;
