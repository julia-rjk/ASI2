import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import GameService from "../services/gameService";

export interface Components {
  
}

export function createApplication(
  httpServer: HttpServer,
  serverOptions: Partial<ServerOptions> = {}
): Server {
  const io = new Server(httpServer, serverOptions);
  const servive = new GameService();

  io.on("connection", (socket) => {
    socket.on('joinWaitingList', ({ user }:any) => {
      servive.joinWaitingList(io, socket, user);
    });
  });

  return io;
}
