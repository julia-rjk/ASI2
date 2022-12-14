import { UserDTO } from './userDTO';

export interface GameUserDTO extends UserDTO {
  actionPoints?: number;
}

export default class GameDTO {
  gameId!: string;
  player1!: GameUserDTO;
  player2!: GameUserDTO;
  nextTurn!: GameUserDTO;

  // method that compare with other game's players's cards to find differences
  // and return a new game with the differences
  public compareWith(otherGame: GameDTO): GameDTO {
    const newGame = new GameDTO();
    newGame.gameId = this.gameId;
    newGame.player1 = this.player1;
    newGame.player2 = this.player2;
    newGame.nextTurn = this.nextTurn;

    if (this.player1.cards && otherGame.player1.cards) {
      newGame.player1.cards = this.player1.cards.filter(
        (c) => !otherGame.player1.cards?.find((oc) => oc.id === c.id),
      );
    }

    if (this.player2.cards && otherGame.player2.cards) {
      newGame.player2.cards = this.player2.cards.filter(
        (c) => !otherGame.player2.cards?.find((oc) => oc.id === c.id),
      );
    }

    return newGame;
  }
}
