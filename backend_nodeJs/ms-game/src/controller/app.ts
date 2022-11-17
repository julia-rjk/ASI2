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
    socket.on('joinWaitingList', ({ user }: any) => {
      service.joinWaitingList(io, socket, user);
    });

    socket.on('chat:joinRoom', ({ userId, room }) => {
       chatService.joinRoom(io, socket, userId, room);
    });

    socket.on('chat:getUsers', () => {
      chatService.getUsers(io, socket);
   });

    // // Listen for client message
    // socket.on('chatMessage', msg => {
    //   chatService.chatMessage(io, msg)
    // });

    // socket.on('sendEveryone', msg => {
    //   const user = getActiveUser(socket.id);
    //   io.sockets.emit('broadcast', formatMessage(user.username, msg))


    //   // METTRE LA SAUVEGARDE DES MESSAGES ICI
    //   saveText(user.username, user.room, msg);


    // });

    // // Runs when client disconnects
    // socket.on('disconnect', () => {
    //   const user = exitRoom(socket.id);

    //   if (user) {
    //     io.to(user.room).emit(
    //       'message',
    //       formatMessage("", `${user.username}  a quitté la discussion`)
    //     );

    //     // Current active users and room name
    //     io.to(user.room).emit('roomUsers', {
    //       room: user.room,
    //       users: getIndividualRoomUsers(user.room)
    //     });
    //   }
    // });



  });

  return io;
}
