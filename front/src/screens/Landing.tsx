import React, { useEffect } from 'react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import chessImage from '../assets/chessImage.jpeg';
import { useSocket } from '../hooks/useSocket';
import { INIT_GAME } from '@soham54/chess-1/dist/messages';


const Landing = () => {
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {

    const token = localStorage.getItem('token');

  },[])

  if (!socket) {
    return ; // Render null if socket is not available
  }

  return (
    <div className="mt-2 flex w-screen h-screen justify-evenly">
      <img className='w-1/2 h-2/3 mt-12' src={chessImage} alt="Image Loading..." />
      <div className='flex flex-col items-center justify-center'>
        <div className='text-white'>Play chess on the #2 site!</div>
        <Button onClick={() => {
          
          navigate('/game');
        }}>
          Play Online
        </Button>
      </div>
    </div>
  );
}

export default Landing;
