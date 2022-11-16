import User from "../models/user";

export default class GameService{
    usersWaiting:User[] = []
    users = {}
    currentGames = {}
    finishedGames = {}

    public joinWaitingList(socket:any, user:User) {
        console.log('joinWaitingList', user.id);
        socket.join("waitingRoom");
        this.usersWaiting.push(user);
        // users[user.id] = user
    
    
        // S'il n'y a pas 2 utilisateurs en attente
        // if (usersWaiting.length < 2) {
    
        //     // On lui envoi l'information concernant la liste d'attente
        //     io.to("waitingRoom").emit('roomUsers', {
        //         room: "waitingRoom",
        //         users: usersWaiting
        //     });
    
        // } else {
        //     // On sélectionne les 2 joueurs de la liste, on lance un nouveau jeu et on vide la liste d'attente
        //     let usersPlaying = [ usersWaiting[0], usersWaiting[1] ]
        //     startNewPlay(usersPlaying)
        //     usersWaiting = []
        // }
    }
}