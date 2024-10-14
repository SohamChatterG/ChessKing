import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;

    if (!authorization || typeof authorization !== 'string') {
        return res.status(401).json({ message: 'No authorization header or invalid format' });
    }
    
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!jwtSecretKey) {
        return res.status(500).json({ message: 'JWT secret key not configured' });
    }

    try {
        const token = authorization.replace('Bearer ', ''); // assuming Bearer token format
        const decoded = jwt.verify(token, jwtSecretKey);
        //@ts-ignore
        req.userId = decoded.id; // attaching user data to req object, optional
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
