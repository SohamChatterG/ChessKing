import { SignInInput } from '@soham54/chess-1'
import LabelledInput from '../components/LabelledInput'
import { Button } from '../components/Button'
import React, { useState , ChangeEvent } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Signin = () => {
    const [signIn,setSignIn] = useState<SignInInput>({
        password : "",
        username : "",
        email : "",
    })
    const navigate = useNavigate();
    const identifierHandler = (e:ChangeEvent<HTMLInputElement>) => {
        setSignIn({
            ...signIn,
            username : e.target.value,
            email : e.target.value
        })
    }

    const signInHandler = async () => {
        try{
            const response = await axios.post('http://localhost:3001/signin',
                signIn
            )
            localStorage.setItem('token',response.data.token)
            navigate('/landing')
        }
        catch(e){
            console.log(e)
        }
        
    }

  return (
    <div>
      <LabelledInput placeholder='email or username' label='email or username' name='identifier' onChange={identifierHandler} />

      <LabelledInput placeholder='password' label='password' name='password' onChange={(e:ChangeEvent<HTMLInputElement>)=>{
        setSignIn({
            ...signIn,
            password : e.target.value
        })
      }} />

      <Button onClick={signInHandler}>Sign In</Button>
    </div>
  )
}

export default Signin
