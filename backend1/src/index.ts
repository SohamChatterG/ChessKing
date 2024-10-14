// import {WebSocketServer} from 'ws'
// import express from 'express'
// import cors from 'cors'
// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'
// import { PrismaClient } from '@prisma/client';
// import { SignUpInput, SignInInput,signInInput,signUpInput } from '@soham54/chess-1';
// import { GameManager } from './GameManager';

// const app = express();
// app.use(cors());
// app.use(express.json());
// const prisma = new PrismaClient();


// const server = app.listen(3000,()=>{
//     console.log('listening on port 3000')
// })



// // -------------------------------


// app.post('/signup',async (req,res)=>{
//     const {username,password,email} = req.body;
//     const zodParse = signUpInput.safeParse({
//         username,
//         email,
//         password
//     })

//     if(!zodParse.success){
//         return res.status(400).json(
//             'invalid input'
//         )
//     }

//     const existingUser = await prisma.user.findFirst({
//         where : {
//             username : username
//         }

//     })
//     if(existingUser){
//         return res.status(401).json('username already exists');
//     }
//     try{
//         const hashPassword = await bcrypt.hash(password,10)
//         const newUser = await prisma.user.create({
//             data : {
//                 username,
//                 email,
//                 password : hashPassword
//             }
//         })

//         res.status(200).json('user created succesfully');
//     } catch(e){
//         res.status(402).json('unsuccessful in creating user, please try again!');
//     }
// })

// app.post('/signin', async (req,res)=>{
//     const {username,password,email} = req.body;

//     const zodParse = signInInput.safeParse({
//         username,
//         email,
//         password
//     })

//     if(!zodParse){
//         return res.status(400).json('invalid inputs')
//     }

    

//     const user = await prisma.user.findFirst({
//         where: {
//             OR: [
//                 { email: email },
//                 { username: username }
//             ]
//         }
//     });
    

//     if(!user) return res.json(401).json("username or email doesn't exist")

//     const hashedPassword = user.password;
//     try{
//         const isPsswordValid = bcrypt.compare(password,hashedPassword)
//         if(!isPsswordValid){
//             return res.status(402).json('wrong password')
//         }
//     }
//     catch(e){
//         console.log(e)
//     }
    

//     const jwtSecretKey = process.env.JWT_SECRET_KEY || "";

//     const token = jwt.sign({id : user.id},jwtSecretKey)

//     return res.status(200).json({"token": token});

// })



// const wss = new WebSocketServer({server});

// const gameManager  = new GameManager();

// wss.on('connection', function connection(ws){
//     gameManager.addUser(ws);
//     ws.on('error',console.error);

//     ws.on('close',()=>{
//         gameManager.removeUser(ws);
//     })

//     ws.send('hello')
// })



// server.on('upgrade', (request, socket, head) => {
//     wss.handleUpgrade(request, socket, head, (ws) => {
//         wss.emit('connection', ws, request);
//     });
// });

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { SignUpInput, SignInInput, signInInput, signUpInput } from '@soham54/chess-1';
import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());
const prisma = new PrismaClient();

// Start Express server
const server = app.listen(3001, () => {
    console.log('Express server listening on port 3001');
});

// Initialize WebSocket server
const wss = new WebSocketServer({ server });

// Initialize GameManager
const gameManager = new GameManager();

wss.on('connection', (ws,request) => {
    // gameManager.addUser(ws);
    // ws.on('error', console.error);

    // ws.on('close', () => {
    //     gameManager.removeUser(ws);
    // });

    // ws.send('hello');
    //@ts-ignore
    const url = new URL(request.url, `http://${request.headers.host}`);
    const token = url.searchParams.get('token');

    if (token) {
        try {
            const jwtSecretKey = process.env.JWT_SECRET_KEY || '';
            const decoded = jwt.verify(token, jwtSecretKey);
            // Token is valid, proceed with the connection
            gameManager.addUser(ws);
            ws.on('error', console.error);

            ws.on('close', () => {
                gameManager.removeUser(ws);
            });

            ws.send('hello');
        } catch (error) {
            // Invalid token, close connection
            ws.close();
            console.log(error)
        }
    } else {
        // No token provided, close connection
        ws.close();
    }
});

// Upgrade handler for WebSocket connections
// server.on('upgrade', (request, socket, head) => {
//     wss.handleUpgrade(request, socket, head, (ws) => {
//         wss.emit('connection', ws, request);
//     });
// });

// Sign-up endpoint
app.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;
    const zodParse = signUpInput.safeParse({ username, email, password });

    if (!zodParse.success) {
        return res.status(400).json('Invalid input');
    }

    const existingUserUsername = await prisma.user.findFirst({ where: { username } });
    if (existingUserUsername) {
        return res.status(401).json('Username already exists');
    }
    const existingUserEmail = await prisma.user.findFirst({ where: { email } });
    if (existingUserEmail) {
        return res.status(401).json('Email already exists');
    }
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({ data: { username, email, password: hashPassword } });
        res.status(200).json('User created successfully');
    } catch (e) {
        console.error(e);
        res.status(500).json('Error creating user, please try again');
    }
});

// Sign-in endpoint
app.post('/signin', async (req, res) => {
    console.log(0)
    const { username, password, email } = req.body;
    const zodParse = signInInput.safeParse({ username, email, password });
    console.log(1)
    if (!zodParse.success) {
        console.log(zodParse.success)
        return res.status(400).json('Invalid input');
    }
    console.log(2)
    const user = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
    });
    console.log(3)
    if (!user) {
        return res.status(401).json("Username or email doesn't exist");
    }
    console.log(4)
    try {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(402).json('Wrong password');
        }

        const jwtSecretKey = process.env.JWT_SECRET_KEY || '';
        const token = jwt.sign({ id: user.id }, jwtSecretKey);
        return res.status(200).json({ token });
    } catch (e) {
        console.error(e);
        return res.status(505).json('Error during sign-in');
    }
});
