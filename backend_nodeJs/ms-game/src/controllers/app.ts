import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import { CardDTO } from "../models/cardDTO";
import Game from "../models/game";
import ChatService from "../services/chatService";
import GameService from "../services/gameService";
import { MessageDTO } from "../../../../client/src/entities/messageDTO";

export function createApplication(
  httpServer: HttpServer,
  serverOptions: Partial<ServerOptions> = {}
): Server {
  const io = new Server(httpServer, serverOptions);
  const service = new GameService();
  const chatService = new ChatService();
  io.on("connection", (socket) => {
    // ------------------ Game ------------------
    socket.on("isInGame", (user: any) => {
      service.isInGame(io, socket, user);
    });
    socket.on("joinWaitingList", (user: any) => {
      service.joinWaitingList(io, socket, user);
    });

    socket.on(
      "attack",
      (gameId: string, attacker: number, defender: number) => {
        service.attack(io, socket, gameId, attacker, defender);
      }
    );

    socket.on("endTurn", (gameId: string) => {
      service.endTurn(io, socket, gameId);
    });

    socket.on("endGame", (gameId: string, looserId: number) => {
      service.endGame(io, socket, gameId, looserId);
    });

    socket.on("leaveGame", (gameId: string, looserId: number) => {
      service.leaveGame(io, socket, gameId, looserId);
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
