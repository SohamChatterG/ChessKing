import React, { ChangeEvent, useEffect, useState } from 'react'
import { SignUpInput } from '@soham54/chess-1'
import axios from 'axios'
import { Button } from '../components/Button'
import Snackbar from '@mui/material/Snackbar';
import LabelledInput from '../components/LabelledInput'
import { useNavigate } from 'react-router-dom'
const Signup = () => {
    const [signUp,setSignUp] = useState<SignUpInput>({ username: "", email: "", password: "" })
    const navigate = useNavigate()
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    async function SignUpHandler(){
        try{
            const res = await axios.post('http://localhost:3001/signup',signUp)
            navigate("/signin");
        } 
        catch (e){
            console.log('error while signing up')
            console.log(e)
            setSnackbarMessage('Wrong sign up credentials');
            setSnackbarOpen(true);
        }
    }

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

  return (
    <div>
        <LabelledInput name='email' label='email' placeholder='soham@gmail.com'  onChange={(e:ChangeEvent<HTMLInputElement>)=>{
            setSignUp({
                ...signUp,
                email : e.target.value
            })
        }}/>
        <LabelledInput name='username' label='username' placeholder='username'  onChange={(e:ChangeEvent<HTMLInputElement>)=>{
            setSignUp({
                ...signUp,
                username : e.target.value
            })
        }}/>
        <LabelledInput name='password' label='password' placeholder='password'  onChange={(e:ChangeEvent<HTMLInputElement>)=>{
            setSignUp({
                ...signUp,
                password : e.target.value
            })
        }}/>
        <Button onClick={SignUpHandler}>Sign Up</Button>
        <p>Already have an account? <span className='underline' onClick={()=>{
            navigate('/Signup')
        }}>Sign In</span></p>
        <Snackbar 
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        sx={{ 
          '& .MuiSnackbarContent-root': {
             
            borderRadius: '15px', 
            padding: '8px 16px',
          } 
        }}  />
    </div>
  )
}

export default Signup

/*
// import { ChangeEvent, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { SignupInput,SigninInput } from "@soham54/common";
// import axios from "axios";
// import { string } from "zod";
// import BACKEND_URL from '../config'
// type AuthProps =  "signup" | "signin"
// export const Auth = ( {type} : {type:AuthProps}) => {
//     // we cannot write type AuthState<T> = T === "signin" ? SigninInput : SignupInput; 
//     // because                              T is a type here we cannot use === with type we need to use extends
//     type AuthState<T> = T extends "signin" ? SigninInput : SignupInput;
//     const navigate = useNavigate();
//     const [postInputs, setPostInputs] = useState<AuthState<typeof type>>(type === "signin" ? {
//         username: "",
//         password: ""
//     } as SigninInput : {
//         name: "",
//         username: "",
//         password: ""
//     } as SignupInput);

//     async function sendRequest() {
//         try {
//             const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs);
//             // const response = {data:"so"};
//             const jwt = response.data;
//             localStorage.setItem("token", jwt);
//             navigate("/blogs");
//         } catch(e) {
//             alert("Error while signing up")
//             // alert the user here that the request failed
//         }
//     }
    
//     return <div className="h-screen flex justify-center flex-col">
//         <div className="flex justify-center">
//             <div>
//                 <div className="px-10">
//                     <div className="text-3xl font-extrabold">
//                         Create an account
//                     </div>
//                     <div className="text-slate-500">
//                         {type === "signin" ? "Don't have an account?" : "Already have an account?" }
//                         <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
//                             {type === "signin" ? "Sign up" : "Sign in"}
//                         </Link>
//                     </div>
//                 </div>
//                 <div className="pt-8">
//                     {type === "signup" ? <LabelledInput label="Name" placeholder="Harkirat Singh..." onChange={(e) => {
//                         setPostInputs({
//                             ...postInputs,
//                             name: e.target.value
//                           })
//                     }} /> : null}
//                     <LabelledInput label="Username" placeholder="harkirat@gmail.com" onChange={(e) => {
//                         setPostInputs({
//                             ...postInputs,
//                             username: e.target.value
//                         })
//                     }} />
//                     <LabelledInput label="Password" type={"password"} placeholder="123456" onChange={(e) => {
//                         setPostInputs({
//                             ...postInputs,
//                             password: e.target.value
//                         })
//                     }} />
//                     <button onClick={sendRequest} type="button" className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"}</button>
//                 </div>
//             </div>
//         </div>
//     </div>
// }

// interface LabelledInputType {
//     label: string;
//     placeholder: string;
//     onChange: (e: ChangeEvent<HTMLInputElement>) => void;
//     type?: string;
// }

// function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
//     return <div>
//         <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
//         <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
//     </div>
// }

import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@soham54/common";
import axios from "axios";
import  BACKEND_URL  from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        email: "",
        name: "",
        password: ""
    });

    async function sendRequest() {
        try {
            console.log(postInputs)
            const response = await axios.post(`${BACKEND_URL}/api/v1/users/${type === "signup" ? "signup" : "signin"}`, postInputs);
            const jwt = response.data.jwt;
            // console.log(jwt.jwt)
            localStorage.setItem("token", jwt);
            navigate("/blogs");
        } catch(e) {
            console.log(e)
            alert("Error while signing up")
            // alert the user here that the request failed
        }
    }
    
    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="px-10">
                    <div className="text-3xl font-extrabold">
                        Create an account
                    </div>
                    <div className="text-slate-500">
                        {type === "signin" ? "Don't have an account?" : "Already have an account?" }
                        <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                            {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </div>
                </div>
                <div className="pt-8">
                    {type === "signup" ? <LabelledInput label="Name" placeholder="Harkirat Singh..." onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            name: e.target.value
                        })
                    }} /> : null}
                    <LabelledInput label="Username" placeholder="harkirat@gmail.com" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            email: e.target.value
                        })
                    }} />
                    <LabelledInput label="Password" type={"password"} placeholder="123456" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        })
                    }} />
                    <button onClick={sendRequest} type="button" className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"}</button>
                </div>
            </div>
        </div>
    </div>
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return <div>
        <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
        <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
    </div>
}
*/