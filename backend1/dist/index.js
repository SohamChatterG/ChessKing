"use strict";
// import {WebSocketServer} from 'ws'
// import express from 'express'
// import cors from 'cors'
// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'
// import { PrismaClient } from '@prisma/client';
// import { SignUpInput, SignInInput,signInInput,signUpInput } from '@soham54/chess-1';
// import { GameManager } from './GameManager';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const chess_1_1 = require("@soham54/chess-1");
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
// Initialize Express app
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const prisma = new client_1.PrismaClient();
// Start Express server
const server = app.listen(3001, () => {
    console.log('Express server listening on port 3001');
});
// Initialize WebSocket server
const wss = new ws_1.WebSocketServer({ server });
// Initialize GameManager
const gameManager = new GameManager_1.GameManager();
wss.on('connection', (ws, request) => {
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
            const decoded = jsonwebtoken_1.default.verify(token, jwtSecretKey);
            // Token is valid, proceed with the connection
            gameManager.addUser(ws);
            ws.on('error', console.error);
            ws.on('close', () => {
                gameManager.removeUser(ws);
            });
            ws.send('hello');
        }
        catch (error) {
            // Invalid token, close connection
            ws.close();
            console.log(error);
        }
    }
    else {
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
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    const zodParse = chess_1_1.signUpInput.safeParse({ username, email, password });
    if (!zodParse.success) {
        return res.status(400).json('Invalid input');
    }
    const existingUserUsername = yield prisma.user.findFirst({ where: { username } });
    if (existingUserUsername) {
        return res.status(401).json('Username already exists');
    }
    const existingUserEmail = yield prisma.user.findFirst({ where: { email } });
    if (existingUserEmail) {
        return res.status(401).json('Email already exists');
    }
    try {
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        yield prisma.user.create({ data: { username, email, password: hashPassword } });
        res.status(200).json('User created successfully');
    }
    catch (e) {
        console.error(e);
        res.status(500).json('Error creating user, please try again');
    }
}));
// Sign-in endpoint
app.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(0);
    const { username, password, email } = req.body;
    const zodParse = chess_1_1.signInInput.safeParse({ username, email, password });
    console.log(1);
    if (!zodParse.success) {
        console.log(zodParse.success);
        return res.status(400).json('Invalid input');
    }
    console.log(2);
    const user = yield prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
    });
    console.log(3);
    if (!user) {
        return res.status(401).json("Username or email doesn't exist");
    }
    console.log(4);
    try {
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(402).json('Wrong password');
        }
        const jwtSecretKey = process.env.JWT_SECRET_KEY || '';
        const token = jsonwebtoken_1.default.sign({ id: user.id }, jwtSecretKey);
        return res.status(200).json({ token });
    }
    catch (e) {
        console.error(e);
        return res.status(505).json('Error during sign-in');
    }
}));
