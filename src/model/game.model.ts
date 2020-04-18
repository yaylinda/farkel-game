/**
 * This needs to have all the fields that GameDTO. This is the current state of the game, with logs.
 */
export class Game {
    gameId!: string ;
    head!: number ;
    gameMasterPlayerId!: string ;
    gameConfiguration!: GameConfiguration ;
    gamePhase!: string ;
    currentTurnPlayerId!: string;
    newTurn!: boolean;
    turnCounter!: number ;
    isEveryoneOnTheBoard!: boolean ;
    diceManager!: DiceManager ;
    cumulativeTurnScore!: number ;
    playersOrder!: string[] ;
    playersRoster!: string[] ;
    observersRoster!: string[] ;
    actorsMap!: Record<string, GameActor> ;
    actionLogs!: GameActionLogEntry[] ;
    scoreToBeat!: number ;
    isAboutToWin!: boolean ;
    aboutToWinPlayerId!: string ;
    winnerPlayerId!: string ;
    comments!: PostGameComment[] ;
    lastActor!: string;
    lastPerformedAction!: string;
    availableActions!: string[];
}

export class GameConfiguration {
    pointsToWin!: number ;
    pointsToGetOnBoard!: number ;
    numDice!: number ;
    diceMaxValue!: number ;
    diceMinValue!: number ;
    minNumPlayers!: number;
    maxNumPlayers!: number;
}

export class DiceManager {
    dice!: Die[];
    diceScore!: number;
}

export class Die {
    index!: number;
    min!: number;
    max!: number;
    value!: number;
    keep!: boolean;
    toggled!: boolean;
}

export class GameActor {
    actorId!: string ;
    gameId!: string ;
    playerReady!: boolean ;
    cookie!: string ; 
    displayName!: string ;
    score!: number ;
    color!: string;
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