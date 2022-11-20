
import Game from "../models/game";
import { Server, Socket } from "socket.io";
// import moment from 'moment';
import ChatUser from "../models/chatUser";
import axios from "axios";

const URL_MS_USER = "http://localhost:8081/api/users"
export default class ChatService {
    users: ChatUser[] = [];

    public joinRoom(io: Server, socket: Socket, userId: any, room: string) {
        // console.log(room)
        const user = this.newUser(socket.id, userId, room);
        socket.join(user.room);

        socket.emit('message', this.formatMessage("", 'Bienvenue '));

        // Broadcast everytime users connects
        socket.broadcast.to(user.room).emit('message', this.formatMessage("--", `${user.userId} a rejoint la discussion`));

        // Current active users and room name
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: this.getIndividualRoomUsers(user.room)
        });
    }

    public sendMessage(io: Server, socket: Socket, msg: string){
        const user = this.getActiveUser(socket.id);
        console.log("Sending message to everyone in the room : " + msg)
        io.to(user?.room).emit('chat:getMessage', this.formatMessage(user?.userId, msg));
        console.log(msg);
    }

    public getUsers(io: Server, socket: Socket) {
        io.sockets.emit('chat:sendUsers', this.formatMessage("", this.getActiveUser(socket.id)))
    }


    // Join user to chat
    public newUser(id: any, userId: any, room: any) {
        const user = new ChatUser(id, userId, room);
        this.users.push(user);
        return user;
    }

    // Get current user
    public getActiveUser(id: any) {
        return this.users.find(user => user.id === id);
    }

    // User leaves chat
    public exitRoom(id: any) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            return this.users.splice(index, 1)[0];
        }
    }

    // Get room this.users
    public getIndividualRoomUsers(room: String) {
        return this.users.filter(user => user.room === room);
    }

    public formatMessage(userId: any, text: any) {
        return {
            userId,
            text,
            time: "now"
        };
    }
}
