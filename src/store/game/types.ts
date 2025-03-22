enum gameType {
    dungeonsAndDragons = 'Dungeons and Dragons',
    warHammer = 'Warhammer',
}

interface Game {
    id: number;
    title: string;
    nbPlayers?: number;
    gameMaster: string;
    image: string;
    gameType: string;
}

interface GamesState {
    gamesState: Game[];
}

export { GamesState, Game, gameType };
