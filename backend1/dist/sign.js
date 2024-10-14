"use strict";
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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const chess_1_1 = require("@soham54/chess-1");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const prisma = new client_1.PrismaClient();
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    const zodParse = chess_1_1.signUpInput.safeParse({
        username,
        email,
        password
    });
    if (!zodParse.success) {
        return res.status(400).json('invalid input');
    }
    const existingUser = yield prisma.user.findFirst({
        where: {
            username: username
        }
    });
    if (existingUser) {
        return res.status(401).json('username already exists');
    }
    try {
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield prisma.user.create({
            data: {
                username,
                email,
                password: hashPassword
            }
        });
        res.status(200).json('user created succesfully');
    }
    catch (e) {
        res.status(402).json('unsuccessful in creating user, please try again!');
    }
}));
app.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    const zodParse = chess_1_1.signInInput.safeParse({
        username,
        email,
        password
    });
    if (!zodParse) {
        return res.status(400).json('invalid inputs');
    }
    const user = yield prisma.user.findFirst({
        where: {
            OR: [
                { email: email },
                { username: username }
            ]
        }
    });
    if (!user)
        return res.json(401).json("username or email doesn't exist");
    const hashedPassword = user.password;
    try {
        const isPsswordValid = bcrypt_1.default.compare(password, hashedPassword);
        if (!isPsswordValid) {
            return res.status(402).json('wrong password');
        }
    }
    catch (e) {
        console.log(e);
    }
    const jwtSecretKey = process.env.JWT_SECRET_KEY || "";
    const token = jsonwebtoken_1.default.sign({ id: user.id }, jwtSecretKey);
    return res.status(200).json({ "token": token });
}));
app.listen(3000, () => {
    console.log('listening on port 3000');
});
