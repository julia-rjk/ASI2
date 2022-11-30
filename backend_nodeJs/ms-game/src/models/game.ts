import * as uuid from 'uuid';
import { GameUserDTO } from "../../../../client/src/entities/gameDTO";

export default class Game {
    gameId: string;
    player1: GameUserDTO;
    player2?: GameUserDTO;
    nextTurn?: GameUserDTO;

    constructor(player1: GameUserDTO) {
        this.gameId = uuid.v4();
        this.player1 = player1;
        // On choisit aléatoirement le premier joueur
    }
    join(player2: GameUserDTO) {
        this.player2 = player2;
        this.nextTurn = Math.random() < 0.5 ? this.player1 : this.player2;
    }
}