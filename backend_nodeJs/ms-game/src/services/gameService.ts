import GameDTO, { GameUserDTO } from "../../../../client/src/entities/gameDTO";
import Game from "../models/game";
import { Server, Socket } from "socket.io";
import { CardDTO } from "../models/cardDTO";

export default class GameService {
    usersWaiting: GameUserDTO[] = []
    currentGames: Game[] = []
    finishedGames: Game[] = []

    public joinWaitingList(io: Server, socket: Socket, user: GameUserDTO) {
        const game = this.currentGames.find(g => !g.player2);
        if (!game) {
            user.actionPoints = 1;
            // create a new game
            const newGame = new Game(user);
            this.currentGames.push(newGame);
            console.log('User', user.id, "created game room", newGame.gameId);
            socket.join(newGame.gameId);
            // send the game to the player
            io.to(newGame.gameId).emit("updateGame", newGame);
        } else {
            user.actionPoints = 1;
            // join the game
            game.join(user);
            console.log('User', user.id, "joined game room", game.gameId);
            socket.join(game.gameId);
            // send the game to the players
            io.to(game.gameId).emit("updateGame", game);
        }
    }

    public attack(io: Server, socket: Socket, gameId: string, cardAttackerId: number, cardDefenderId: number) {
        // get game
        const game = this.currentGames.find(g => g.gameId === gameId);
        if (!game || !cardAttackerId || !cardDefenderId || !game.nextTurn || !game.player2) {
            return;
        }
        console.log("Player " + game.nextTurn.surName + " is attacking");

        // get players
        const attacker = game.player1.id === game.nextTurn.id ? game.player1 : game.player2 as GameUserDTO;
        const defender = game.player1.id === game.nextTurn.id ? game.player2 : game.player1 as GameUserDTO;
        if(!attacker || !defender || !attacker.cards || !defender.cards || !attacker.actionPoints || attacker.actionPoints == 0) {
            return;
        }

        // get cards
        const cardAttacker = attacker.cards.find(c => c.id === cardAttackerId) as CardDTO;
        const cardDefender = defender.cards.find(c => c.id === cardDefenderId) as CardDTO;        
        if (!cardAttacker|| !cardDefender || cardAttacker.energy < 1 || cardDefender.hp < 1 || cardAttacker.hp < 1) {
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
        io.to(game.gameId).emit("updateGame", game);
    }

    public endTurn(io: Server, socket: Socket, gameId: string) {
        // get game
        const game = this.currentGames.find(g => g.gameId === gameId);
        if (!game || !game.nextTurn || !game.player2) {
            return;
        }
        console.log("Player " + game.nextTurn.surName + " is ending his turn");
        // add action points
        game.player1.actionPoints ? (game.player1.actionPoints * 2 > 100 ? game.player1.actionPoints = 100 : game.player1.actionPoints *= 2) : game.player1.actionPoints = 1;
        game.player2.actionPoints ? (game.player2.actionPoints * 2 > 100 ? game.player2.actionPoints = 100 : game.player2.actionPoints *= 2) : game.player2.actionPoints = 1;

        // change turn
        game.nextTurn = game.player1.id === game.nextTurn.id ? game.player2 : game.player1;
        // add energy to cards
        game.player1.cards?.forEach(c => {
            c.energy += 10 + Math.random() * 90
            c.energy > 1000 ? c.energy = 1000 : null;
        });
        game.player2.cards?.forEach(c => {
            c.energy += 10 + Math.random() * 90
            c.energy > 1000 ? c.energy = 1000 : null;
        });

        // send update to players
        io.to(game.gameId).emit("updateGame", game);
    }
}