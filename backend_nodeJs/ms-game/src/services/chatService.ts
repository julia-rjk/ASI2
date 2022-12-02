
import Game from "../models/game";
import { Server, Socket } from "socket.io";
// import moment from 'moment';
import ChatUser from "../models/chatUser";
import axios from "axios";
import { MessageDTO } from "../../../../client/src/entities/messageDTO";
import * as dotenv from "dotenv";

dotenv.config();

const URL_MS_USER = process.env.URL + ":" + process.env.USERPORT + "/api/users";
const URL_MS_CHATHISTORY = process.env.URL + ":" + process.env.MESSAGEPORT + "/api/messages";
export default class ChatService {

    public async sendMessage(io: Server, msg: MessageDTO) {
        msg = {...msg, date: new Date()};
        await this.saveMessage(msg);
        if(msg.room){
            io.to(msg.room).emit('chatMessage', msg);
        }
        else{
            io.emit('chatMessage', msg);
        }
    }
    
    public async saveMessage(message: MessageDTO){
        await axios.post(URL_MS_CHATHISTORY, {...message});
        console.log(await this.getAllMessagesOfRoom(message.room));
    }

    public async getAllMessagesOfRoom(room?: string){
        const res = await axios.get(`${URL_MS_CHATHISTORY}/room/${room || ''}`);
        return res.data;
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
