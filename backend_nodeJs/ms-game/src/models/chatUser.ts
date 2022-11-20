// import { ChatUserDTO } from "../../../client/src/entities/chatUserDTO";

export default class ChatUser {
    id: any;
    room: any;
    userId: any;

    constructor( id: any, userId: any, room: any ){
        this.id = id;
        this.room = room;
        this.userId = userId;
    }
}