import WebSocket from "ws";
import { Game } from "./Game";
import { INIT_GAME,MOVE } from "@soham54/chess-1/dist/messages"
type UserType = WebSocket | null;
export class GameManager{
    private games : Game[];
    private pendingUser : UserType;
    private users : WebSocket[];

    constructor(){
        this.games =[];
        this.users=[]
        this.pendingUser=null;
    }

    addUser(socket:WebSocket){
        this.users.push(socket)
        this.addHandler(socket)
    }

    removeUser(socket:WebSocket){
        this.users = this.users.filter((user)=>user!==socket)
    } 

    private addHandler(socket:WebSocket){
        socket.on('message',(data)=>{
            const message = JSON.parse(data.toString())

            if(message.type === INIT_GAME){
                console.log('init game message received')
                if(this.pendingUser){
                    // start the game
                    const game = new Game(this.pendingUser,socket);
                    this.games.push(game);
                    this.pendingUser = null;
                } else{
                    // make current user as the pending user
                    this.pendingUser = socket;
                }
            }

            if(message.type === MOVE){
                const game = this.games.find((game)=>game.player1 === socket || game.player2 === socket)

                if(game){
                    game.makeMove(socket,message.payload.move);
                }
            }
        })
    }
}