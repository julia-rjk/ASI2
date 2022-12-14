import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import { CardDTO } from "../models/cardDTO";
import Game from "../models/game";
import ChatService from "../services/chatService";
import GameService from "../services/gameService";
import { MessageDTO } from '../models/messageDTO';

export function createApplication(
  httpServer: HttpServer,
  serverOptions: Partial<ServerOptions> = {}
): Server {
  const io = new Server(httpServer, serverOptions);
  const gameService = new GameService();
  const chatService = new ChatService();
  io.on("connection", (socket) => {
    // ------------------ Game ------------------
    socket.on("isInGame", (user: any) => {
      const isAlreadyInGameId = gameService.isInGame(io, socket, user);
      if(isAlreadyInGameId) {
        chatService.getAllMessagesOfRoom(socket, isAlreadyInGameId);
      }
    });
    socket.on("joinWaitingList", (user: any) => {
      const gameId = gameService.joinWaitingList(io, socket, user);
      chatService.getAllMessagesOfRoom(socket, gameId);
    });

    socket.on(
      "attack",
      (gameId: string, attacker: number, defender: number) => {
        gameService.attack(io, socket, gameId, attacker, defender);
      }
    );

    socket.on("endTurn", (gameId: string) => {
      gameService.endTurn(io, socket, gameId);
    });

    socket.on("endGame", (gameId: string, looserId: number) => {
      gameService.endGame(io, socket, gameId, looserId);
    });

    socket.on("leaveGame", (gameId: string, looserId: number) => {
      gameService.leaveGame(io, socket, gameId, looserId);
    });

    // ----------------- Chat -----------------
    chatService.getAllMessagesOfRoom(socket);
    socket.on("sendMessage", async (msg: MessageDTO) => {
      chatService.sendMessage(io, msg);
    });

    // Runs when client disconnects
    socket.on("disconnect", () => {});
  });

  return io;
}
