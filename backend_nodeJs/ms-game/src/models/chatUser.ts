// import { ChatUserDTO } from "../../../client/src/entities/chatUserDTO";

export default class ChatUser {
    id: any;
    room: any;
    userId: any;
    userName: any;

    constructor( id: any, userId: any, userName:any, room: any ){
        this.id = id;
        this.userName = userName;
        this.room = room;
        this.userId = userId;
    }
}