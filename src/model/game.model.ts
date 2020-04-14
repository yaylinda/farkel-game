/**
 * This needs to have all the fields that GameDTO. This is the current state of the game, with logs.
 */
export class Game {
    gameId!: string ;
    head!: number ;
    gameMasterPlayerId!: string ;
    gameConfiguration!: GameConfiguration ;
    gamePhase!: string ;
    currentTurnPlayerId!: string ;
    turnCounter!: number ;
    isEveryoneOnTheBoard!: boolean ;
    diceManager!: DiceManager ;
    cumulativeTurnScore!: number ;
    playersOrder!: string[] ;
    playersRoster!: string[] ;
    observersRoster!: string[] ;
    actorsMap!: Record<string, GameActor> ;
    cookiesMap!: Record<string, GameActor> ;
    actionLogs!: GameActionLogEntry[] ;
    scoreToBeat!: number ;
    isAboutToWin!: boolean ;
    aboutToWinPlayerId!: string ;
    winnerPlayerId!: string ;
    comments!: PostGameComment[] ;
}

export class GameConfiguration {
    pointsToWin!: number ;
    pointsToGetOnBoard!: number ;
    numDice!: number ;
    diceMaxValue!: number ;
    diceMinValue!: number ;
}

export class DiceManager {
    dice!: Die[];
    diceScore!: number;
}

export class Die {
    min!: number;
    max!: number;
    value!: number;
    keep!: boolean;
}

export class GameActor {
    actorId!: string ;
    gameId!: string ;
    isPlayerReadyToStart!: boolean ;
    cookie!: string ; 
    displayName!: string ;
    score!: number ;
}

export class GameActionLogEntry {
    timestamp!: number ;
    position!: number ;
    actorId!: string ;
    actorDisplayName!: string ;
    action!: string ;
    metadata!: Record<string, string>;
}

export class PostGameComment {
    from!: string;
    message!: string;
}