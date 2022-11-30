
import Game from "../models/game";
import { Server, Socket } from "socket.io";
// import moment from 'moment';
import ChatUser from "../models/chatUser";
import axios from "axios";
import { MessageDTO } from "../../../../client/src/entities/messageDTO";

const URL_MS_USER = process.env.URL + ":" + process.env.USERPORT + "/api/users";
const URL_MS_CHATHISTORY = process.env.URL + ":" + process.env.PORT + "/api/messages";
export default class ChatService {
    users: ChatUser[] = [];
    allUsers: any = [];
    public joinRoom(io: Server, socket: Socket, userId: any, userName:any, room: string) {
        const user = this.newUser(socket.id, userId, userName, room);
        if (user != null) {
            socket.join(user.room);

            socket.emit('message', this.formatMessage("", null , 'Bienvenue '));

            // Broadcast everytime users connects
            socket.broadcast.to(user.room).emit('message', this.formatMessage("--", null, `${user.userId} a rejoint la discussion`));

            // Current active users and room name
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: this.getIndividualRoomUsers(user.room)
            });
        }
    }

    public sendMessage(io: Server, msg: MessageDTO) {
        const returnMessage: MessageDTO = {...msg, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        if(msg.room){
            console.log("room", msg.room)
            io.to(msg.room).emit('chatMessage', returnMessage);
        }
        else{
            console.log("no room")
            io.emit('chatMessage', returnMessage);
        }
    }

    public getUsers(io: Server, socket: Socket) {
        io.sockets.emit('chat:sendUsers', this.formatMessage("", null, this.allUsers))
    }

    public sendBroadcast(io: Server, socket: Socket, username: string, msg: string) {
        const user = this.getActiveUser(socket.id);
        let formattedMessage = this.formatMessage("Broadcast from " + user?.userName, "Broadcast from " + user?.userName, msg)
        this.saveMessage(user?.id, user?.room, formattedMessage.text, formattedMessage.time);
        console.log(user, socket.id)
        io.emit('chat:getBroadcast', formattedMessage);
    }

    // Join user to chat
    public newUser(id: any, userId: any, userName:any, room: any) {
        const user = new ChatUser(id, userId, userName, room);
        if (this.users.find(user => user.id === id) == undefined) {
            this.users.push(user);
            return user;
        } else return null;
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

    public formatMessage(userId: any, userName: any,  text: any) {
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;
        return {
            userId,
            userName,
            text,
            time: dateTime
        };
    }

    public disconnect(io: Server, socket: Socket){
        const user = this.exitRoom(socket.id);

        if (user) {
          io.to(user.room).emit(
            'message',
            this.formatMessage("", "", `${user.userName}  a quitté la discussion`)
          );
  
        //   // Current active users and room name
        //   io.to(user.room).emit('roomUsers', {
        //     room: user.room,
        //     users: getIndividualRoomUsers(user.room)
        //   });
        }
    }

    public getAllUsers(){
        axios.get(URL_MS_USER).then(data =>{
            this.allUsers = data; 
        })
        return this.allUsers; 
    }

    public saveMessage(userId: any, room: any, message: any, time: any){
        axios.put(URL_MS_CHATHISTORY, {
            "userId": userId, 
            "room": room,
            "text": message, 
            "timestamp" : time
        })
    }
}
