import { UserDTO } from './userDTO';

export interface GameUserDTO extends UserDTO {
  actionPoints?: number;
}

export default interface GameDTO {
  gameId: string;
  player1: GameUserDTO;
  player2: GameUserDTO;
  nextTurn: GameUserDTO;
}
