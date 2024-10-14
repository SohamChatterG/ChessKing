import WebSocket from "ws";
import {Chess} from 'chess.js'
import { GAME_OVER, MOVE, INIT_GAME } from "@soham54/chess-1/dist/messages";

interface moveType {
    from : string,
    to: string
}
export class Game{

    public player1 : WebSocket;
    public player2 : WebSocket;
    private board : Chess;
    private moveCount : number
    private startTime : Date;

    constructor(player1:WebSocket,player2:WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moveCount = 0;
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload : {
                color : "white"   
            }
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload : {
                color : "black"   
            }
        }))
        this.startTime = new Date();
        console.log('new game created')
    }
    makeMove(socket:WebSocket, move: moveType){
        // it's player 1's turn and player2 is trying to make a move
        if(this.moveCount % 2 === 0 && socket !== this.player2){
            console.log('player 1 turn')
            return
        }
        // it's player2's turn and player1 is trying to make a move
        if(this.moveCount % 2 === 1 && socket !== this.player1){
            console.log('player 2 turn')
            return
        }

        try{
            this.board.move(move)
            this.moveCount++;
        }
        catch(e){
            console.log(e);
            
          
        }

        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({ // emit is like send in websocket
                type: GAME_OVER,
                payload : {
                    winner : this.board.turn() === 'w' ? 'black' : 'white'
                }
            }))

            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload : {
                    winner : this.board.turn() === 'w' ? 'black' : 'white'
                }
            }))

            return;
        }

        if(this.moveCount % 2 === 1){
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload : {
                    move : move
                }
            }))
        } else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload : {
                    move : move
                }
            }))
        }

        
    }
}
// {
//   "type" : "move",
//   "move" : {
//     "from" :"g7",
//     "to": "g5"
//   }
// }


// {
//     "type" : "move",
//     "move" : {
//       "from" :"a2",
//       "to": "a3"
//     }
//   }