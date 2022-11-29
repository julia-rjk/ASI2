import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import ChatService from "../services/chatService";
import GameService from "../services/gameService";

export interface Components {

}

export function createApplication(
  httpServer: HttpServer,
  serverOptions: Partial<ServerOptions> = {}
): Server {
  const io = new Server(httpServer, serverOptions);
  const service = new GameService();
  const chatService = new ChatService();
  io.on("connection", (socket) => {
    // ------------------ Game ------------------
    socket.on('joinWaitingList', (user: any) => {
      service.joinWaitingList(io, socket, user);
    });

    socket.on('joinGame', (gameId: string) => {
      service.joinGame(socket, gameId);
    });

    socket.on('attack', (details:any) => {
      service.attack(io, socket, details.gameId, details.attackerId, details.defenderId);
    });

    
    
    // ----------------- Chat -----------------
    socket.on('chat:joinRoom', ({ userId, userName, room }) => {
      chatService.joinRoom(io, socket, userId, userName, room);
    });

    socket.on('chat:getUsers', () => {
      chatService.getUsers(io, socket);
    });

    // Listen for client message
    socket.on('chat:sendMessage', msg => {
      chatService.sendMessage(io, socket, msg);
    });

    // Listen for client message
    socket.on('chat:sendBroadcast',({username, msg}) => {
      chatService.sendBroadcast(io, socket, username, msg);
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
      
    });



  });

  return io;
}
