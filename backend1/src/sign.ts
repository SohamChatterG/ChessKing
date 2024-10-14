import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client';
import { SignUpInput, SignInInput,signInInput,signUpInput } from '@soham54/chess-1';


const app = express();
app.use(cors());
app.use(express.json());
const prisma = new PrismaClient();

app.post('/signup',async (req,res)=>{
    const {username,password,email} = req.body;
    const zodParse = signUpInput.safeParse({
        username,
        email,
        password
    })

    if(!zodParse.success){
        return res.status(400).json(
            'invalid input'
        )
    }

    const existingUser = await prisma.user.findFirst({
        where : {
            username : username
        }

    })
    if(existingUser){
        return res.status(401).json('username already exists');
    }
    try{
        const hashPassword = await bcrypt.hash(password,10)
        const newUser = await prisma.user.create({
            data : {
                username,
                email,
                password : hashPassword
            }
        })

        res.status(200).json('user created succesfully');
    } catch(e){
        res.status(402).json('unsuccessful in creating user, please try again!');
    }
})

app.post('/signin', async (req,res)=>{
    const {username,password,email} = req.body;

    const zodParse = signInInput.safeParse({
        username,
        email,
        password
    })

    if(!zodParse){
        return res.status(400).json('invalid inputs')
    }

    

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: email },
                { username: username }
            ]
        }
    });
    

    if(!user) return res.json(401).json("username or email doesn't exist")

    const hashedPassword = user.password;
    try{
        const isPsswordValid = bcrypt.compare(password,hashedPassword)
        if(!isPsswordValid){
            return res.status(402).json('wrong password')
        }
    }
    catch(e){
        console.log(e)
    }
    

    const jwtSecretKey = process.env.JWT_SECRET_KEY || "";

    const token = jwt.sign({id : user.id},jwtSecretKey)

    return res.status(200).json({"token": token});

})

app.listen(3000,()=>{
    console.log('listening on port 3000')
})