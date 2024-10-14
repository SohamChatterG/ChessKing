import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
const WS_URL = 'ws://localhost:3001';
export const useSocket = () => {
    const [socket,setSocket] = useState<null | WebSocket>(null)
    const navigate = useNavigate();
    useEffect(()=>{
    

        try{
            const token = localStorage.getItem('token'); // Get the JWT from local storage
            const ws = new WebSocket(`${WS_URL}?token=${token}`);
            ws.onopen = () => {
                console.log('connected to socket')
                setSocket(ws)
            }
            console.log('doneeee')
    
            ws.onclose = () => {
                console.log('disconnected')
                setSocket(null)
            }
            // return () => {
            //     ws.close()
            // }
        }
        catch(e){
            console.log('error while building connection with socket');
            navigate('/signin')
        }
        

        
    }, [])
    return socket;
}