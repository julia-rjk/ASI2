import GameDTO, { GameUserDTO } from "../../../../client/src/entities/gameDTO";
import Game from "../models/game";
import { Server, Socket } from "socket.io";
import { CardDTO } from "../models/cardDTO";
import UserService from "./userService";

export default class GameService {
  usersWaiting: GameUserDTO[] = [];
  currentGames: Game[] = [];
  finishedGames: Game[] = [];
  startActionPoint = 1;
  actionPointMultiplier = 2;

  public isInGame(io: Server, socket: Socket, user: GameUserDTO): boolean {
    let game = this.currentGames.find(
      (g) => g.player1.id === user.id || g.player2?.id === user.id
    );
    if (game) {
      socket.join(game.gameId);
      io.to(game.gameId).emit("updateGame", game);
      return true;
    }
    return false;
  }
  public joinWaitingList(io: Server, socket: Socket, user: GameUserDTO) {
    if (this.isInGame(io, socket, user)) {
      return;
    }
    let game = this.currentGames.find((g) => !g.player2);
    if (!game) {
      user.actionPoints = this.startActionPoint;
      // create a new game
      const newGame = new Game(user);
      this.currentGames.push(newGame);
      console.log("User", user.id, "created game room", newGame.gameId);
      socket.join(newGame.gameId);
      // send the game to the player
      io.to(newGame.gameId).emit("updateGame", newGame);
    } else {
      user.actionPoints = this.startActionPoint;
      // join the game
      game.join(user);
      console.log("User", user.id, "joined game room", game.gameId);
      socket.join(game.gameId);
      // send the game to the players
      io.to(game.gameId).emit("updateGame", game);
    }
  }

  public attack(
    io: Server,
    socket: Socket,
    gameId: string,
    cardAttackerId: number,
    cardDefenderId: number
  ) {
    // get game
    const game = this.currentGames.find((g) => g.gameId === gameId);
    if (
      !game ||
      !cardAttackerId ||
      !cardDefenderId ||
      !game.nextTurn ||
      !game.player2
    ) {
      io.to(gameId).emit("updateGame", game);
      return;
    }
    console.log("Player " + game.nextTurn.surName + " is attacking");

    // get players
    const attacker =
      game.player1.id === game.nextTurn.id
        ? game.player1
        : (game.player2 as GameUserDTO);
    const defender =
      game.player1.id === game.nextTurn.id
        ? game.player2
        : (game.player1 as GameUserDTO);
    if (
      !attacker ||
      !defender ||
      !attacker.cards ||
      !defender.cards ||
      !attacker.actionPoints ||
      attacker.actionPoints == 0
    ) {
      return;
    }

    // get cards
    const cardAttacker = attacker.cards.find(
      (c) => c.id === cardAttackerId
    ) as CardDTO;
    const cardDefender = defender.cards.find(
      (c) => c.id === cardDefenderId
    ) as CardDTO;
    if (
      !cardAttacker ||
      !cardDefender ||
      cardAttacker.energy == 0 ||
      cardDefender.hp == 0 ||
      cardAttacker.hp == 0
    ) {
      return;
    }

    // remove action point
    attacker.actionPoints = attacker.actionPoints - 1;
    // compute random damage with cardAttacker attack and cardDefender defense
    let damage = cardAttacker.attack - Math.random() * cardDefender.defence;
    if (damage < 0) {
      damage = 0;
    }
    console.log("\t- Damage: " + damage);
    // remove life from cardDefender
    cardDefender.hp = cardDefender.hp - damage;
    if (cardDefender.hp <= 0) {
      cardDefender.hp = 0;
    }
    // remove random between 10 and 100 energy from cardAttacker
    const energyToRemove = 10 + Math.random() * 90;
    console.log("\t- Energy lost: " + energyToRemove);
    cardAttacker.energy -= energyToRemove;
    if (cardAttacker.energy <= 0) {
      cardAttacker.energy = 0;
    }
    // send update to players
    io.to(game.gameId).emit("updateGame", game, damage);
  }

  public endTurn(io: Server, socket: Socket, gameId: string) {
    // get game
    const game = this.currentGames.find((g) => g.gameId === gameId);
    if (!game || !game.nextTurn || !game.player2) {
      return;
    }
    console.log("Player " + game.nextTurn.surName + " is ending his turn");
    // add action points
    game.player1.id !== game.nextTurn.id
      ? this.playerAddActionPoints(game.player1)
      : this.playerAddActionPoints(game.player2);

    // change turn
    game.nextTurn =
      game.player1.id === game.nextTurn.id ? game.player2 : game.player1;
    // add energy to cards
    game.player1.cards?.forEach((c) => {
      c.energy += 10 + Math.random() * 90;
      c.energy > 1000 ? (c.energy = 1000) : null;
    });
    game.player2.cards?.forEach((c) => {
      c.energy += 10 + Math.random() * 90;
      c.energy > 1000 ? (c.energy = 1000) : null;
    });

    // send update to players
    io.to(game.gameId).emit("updateGame", game);
  }

  private playerAddActionPoints(player: GameUserDTO) {
    player.actionPoints
      ? player.actionPoints * this.actionPointMultiplier > 100
        ? (player.actionPoints = 100)
        : (player.actionPoints = Math.round(
            player.actionPoints * this.actionPointMultiplier
          ))
      : (player.actionPoints = 1);
  }

  public endGame(io: Server, socket: Socket, gameId: string, looserId: number) {
    // get game
    const game = this.currentGames.find((g) => g.gameId === gameId);
    if (!game || !game.player2) {
      return;
    }
    // update user's money
    const looser =
      game.player1.id === looserId
        ? (game.player1 as GameUserDTO)
        : (game.player2 as GameUserDTO);
    const winner =
      game.player1.id === looserId
        ? (game.player2 as GameUserDTO)
        : (game.player1 as GameUserDTO);
    console.log(
      "Game " +
        game.gameId +
        " is finished: " +
        looser.surName +
        "lost and " +
        winner.surName +
        " won"
    );
    if (looser && winner && looser.account && winner.account) {
      looser.account -= 100;
      winner.account += 100;
      UserService.updateUser(looser);
      UserService.updateUser(winner);
    }
    this.leaveGame(io, socket, gameId, looserId);
  }

  public leaveGame(
    io: Server,
    socket: Socket,
    gameId: string,
    looserId: number
  ) {
    // get game
    const game = this.currentGames.find((g) => g.gameId === gameId);
    if (!game) {
      return;
    }
    // remove game from current games
    this.currentGames = this.currentGames.filter((g) => g.gameId !== gameId);
    // add game to finished games
    this.finishedGames.push(game);
    // send update to players
    io.to(game.gameId).emit("gameFinished", game, looserId);
    // remove players from game room
    socket.leave(game.gameId);
  }
}
