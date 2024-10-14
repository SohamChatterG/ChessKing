import { Chess, Color, PieceSymbol, Square } from 'chess.js';
import React, { useState } from 'react'
import { MOVE } from '@soham54/chess-1/dist/messages';
import Snackbar from '@mui/material/Snackbar';
import { red } from '@mui/material/colors';
const ChessBoard = ({board,socket,setBoard,chess} : {
  chess : Chess;
  board : ({
    square : Square;
    type : PieceSymbol;
    color : Color;
  } |  null)[][];
  socket : WebSocket;
  setBoard : React.Dispatch<typeof board>;
}) => 
  {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [from,setFrom] = useState<Square | null>(null)
    const [to,setTo] = useState<Square | null>(null)
    const handleCloseSnackbar = () => {
      setSnackbarOpen(false);
    };

  return (
    <div className='text-white-200'>
      {
        board.map((row,i) => {
          return <div key={i} className='flex'>
            {row.map((square,j)=>{
          
              return  <div onClick={()=>{
                const squareRepresentation = String.fromCharCode(97 + (j%8))+""+(8-i) as Square;
                  if(!from) setFrom(squareRepresentation)
                    else {
                      setTo(prevTo => {
                        const newTo = squareRepresentation;
                    
                        // Send the move immediately after setting the `to` value
                        try{
                          socket.send(JSON.stringify({
                            type: MOVE,
                            payload: {
                              move:
                              {
                                from: from,
                                to: newTo
                              }
                            }
                            
                          }));
                      
                          // Reset the `from` value
                          setFrom(null);
                          // for making the changes in own board
                          chess.move({
                            from: from,
                            to: newTo
                          });
                          setBoard(chess.board());

                          
                      }
                      catch(e){
                        setSnackbarMessage('Wrong move, try again');
                        setSnackbarOpen(true);

                      }

                        // Return the new `to` value
                        return newTo;
                      });
                    }
                    
               }}
               key={j} 
               className={`w-16 h-16 ${(i+j)%2===0? 'bg-green-500' : 'bg-white'}`}>
                <div className='flex w-full h-full justify-center items-center'>
                  
                  {square? <img className='w-8' src={`${square?.color}${square?.type}.png`} />: ""}
                </div>
                
              </div>
            })}
          </div>
        })
      }

      <Snackbar 
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        sx={{ 
          '& .MuiSnackbarContent-root': {
            backgroundColor: red[500], 
            borderRadius: '15px', 
            padding: '8px 16px',
          } 
        }}
      />

    </div>
  )
}

export default ChessBoard
