import Game from "../models/game";
import { Server, Socket } from "socket.io";
// import moment from 'moment';

import ChatUser from "../models/chatUser";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
import { MessageDTO } from "../models/messageDTO";
const URL_MS_USER = process.env.URL + "/api/users";
const URL_MS_CHATHISTORY = process.env.URL + "/api/messages";

import { UserDTO } from "../models/userDTO";



export default class ChatService {
  public sendMessage(io: Server, msg: MessageDTO) {
    msg = { ...msg, date: new Date() };
    axios.post(URL_MS_CHATHISTORY, {...msg, date: msg.date?.getTime()});
    if (msg.room) { 
      io.to(msg.room).emit("chatMessage", msg);
    } else {
      io.emit("chatMessage", msg);
    }
  }

  public async getAllMessagesOfRoom(socket: Socket, room?: string) {
    const messages: MessageDTO[] = (
      await axios.get(`${URL_MS_CHATHISTORY}/room/${room || ""}`)
    ).data;
    const uniqueUsersId = [...new Set(messages.map((msg) => msg.userId))];
    const users: UserDTO[] = await Promise.all(
      uniqueUsersId.map(async (id) => {
        return (await axios.get(`${URL_MS_USER}/${id}`)).data;
      })
    );
    const messagesWithUsers = messages.map((msg) => {
      const user = users.find((user) => user.id === msg.userId)!;
      return { ...msg, sender: `${user.lastName} ${user.surName}`, date: msg.date ? new Date(msg.date) : msg.date };
    });

    socket.emit("chatRoomMessages", messagesWithUsers);
  }

  // users: ChatUser[] = [];
  // allUsers: any = [];
  // public joinRoom(io: Server, socket: Socket, userId: any, userName:any, room: string) {
  //     const user = this.newUser(socket.id, userId, userName, room);
  //     if (user != null) {
  //         socket.join(user.room);

  //         socket.emit('message', this.formatMessage("", null , 'Bienvenue '));

  //         // Broadcast everytime users connects
  //         socket.broadcast.to(user.room).emit('message', this.formatMessage("--", null, `${user.userId} a rejoint la discussion`));

  //         // Current active users and room name
  //         io.to(user.room).emit('roomUsers', {
  //             room: user.room,
  //             users: this.getIndividualRoomUsers(user.room)
  //         });
  //     }
  // }

  // public getUsers(io: Server, socket: Socket) {
  //     io.sockets.emit('chat:sendUsers', this.formatMessage("", null, this.allUsers))
  // }

  // // Join user to chat
  // public newUser(id: any, userId: any, userName:any, room: any) {
  //     const user = new ChatUser(id, userId, userName, room);
  //     if (this.users.find(user => user.id === id) == undefined) {
  //         this.users.push(user);
  //         return user;
  //     } else return null;
  // }

  // // Get current user
  // public getActiveUser(id: any) {
  //     return this.users.find(user => user.id === id);
  // }

  // // User leaves chat
  // public exitRoom(id: any) {
  //     const index = this.users.findIndex(user => user.id === id);
  //     if (index !== -1) {
  //         return this.users.splice(index, 1)[0];
  //     }
  // }

  // // Get room this.users
  // public getIndividualRoomUsers(room: String) {
  //     return this.users.filter(user => user.room === room);
  // }

  // public disconnect(io: Server, socket: Socket){
  //     const user = this.exitRoom(socket.id);

  //     if (user) {
  //       io.to(user.room).emit(
  //         'message',
  //         this.formatMessage("", "", `${user.userName}  a quitté la discussion`)
  //       );

  //     //   // Current active users and room name
  //     //   io.to(user.room).emit('roomUsers', {
  //     //     room: user.room,
  //     //     users: getIndividualRoomUsers(user.room)
  //     //   });
  //     }
  // }

  // public getAllUsers(){
  //     axios.get(URL_MS_USER).then(data =>{
  //         this.allUsers = data;
  //     })
  //     return this.allUsers;
  // }
}
