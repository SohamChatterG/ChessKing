"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("@soham54/chess-1/dist/messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moveCount = 0;
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
        this.startTime = new Date();
        console.log('new game created');
    }
    makeMove(socket, move) {
        // it's player 1's turn and player2 is trying to make a move
        if (this.moveCount % 2 === 0 && socket !== this.player2) {
            console.log('player 1 turn');
            return;
        }
        // it's player2's turn and player1 is trying to make a move
        if (this.moveCount % 2 === 1 && socket !== this.player1) {
            console.log('player 2 turn');
            return;
        }
        try {
            this.board.move(move);
            this.moveCount++;
        }
        catch (e) {
            console.log(e);
        }
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            }));
            return;
        }
        if (this.moveCount % 2 === 1) {
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move: move
                }
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: {
                    move: move
                }
            }));
        }
    }
}
exports.Game = Game;
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
