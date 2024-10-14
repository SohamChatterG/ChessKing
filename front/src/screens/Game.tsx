import React, { useEffect, useState } from 'react'
import ChessBoard from '../components/ChessBoard'
import { Button } from '../components/Button'
import { useSocket } from '../hooks/useSocket'
import { Chess } from 'chess.js'

import {MOVE,INIT_GAME,GAME_OVER} from '@soham54/chess-1/dist/messages'

const Game = () => {
  const socket = useSocket();
  const [chess,setChess] = useState(new Chess()); // The chess object holds all the information about the current game
  // including the positions of the pieces, which player's turn it is, whether castling is available, and whether the game is over. This object provides methods to make moves, validate moves, check the game status (e.g., checkmate, stalemate), and more.
  const [board,setBoard] = useState(chess.board()); // The board state is a two-dimensional array that visually represents the chessboard.
  // Each element in the array corresponds to a square on the chessboard, and it contains information about the piece (if any) that occupies that square.
  //Each element can either be null (indicating an empty square) or an object representing a chess piece (indicating a piece of a specific type and color).
  const [started,setStarted] = useState(false);
  useEffect(()=>{
    if(!socket) return;
    socket.onmessage = (event) => {
      
      const message = JSON.parse(event.data);
     
      switch(message.type){
        case INIT_GAME:
          setStarted(true)
          setBoard(chess.board())
          break;
        case MOVE:
          // console.log('message comes inside MOVE condiion')
          
          const move = message.payload.move;
          chess.move(move); // If the move is legal, it updates the internal state of the chess object (including the board layout, whose turn it is, etc.) and returns an object representing the move that was made.
          // If the move is illegal, it returns null and the game state remains unchanged.
          setBoard(chess.board())
          
          break;
        case GAME_OVER:
          setStarted(false)
          break;
      }
      
    }
  }, [socket])

  if(!socket){
    return(
      <>
      connecting...
      </>
    )
  }
  return (
    <div className='w-screen h-screen flex justify-center gap-2'>
      <div className='m-4'>
        <ChessBoard board={board} socket={socket} setBoard={setBoard} chess={chess}/>
      </div>
      
      <div className='m-8'>
        {true ?( <Button onClick={()=>{
          
          socket.send(JSON.stringify({
            type : INIT_GAME
            
        }))
        console.log('init game message sent')
      }}>
         Play
      </Button>) : ""}

      </div>
      
    </div>
  )
}

export default Game

// i also want type not looking on the keyboard
// just like hitesh doe ir maybe il someday why maybe for sure someday i will is not so