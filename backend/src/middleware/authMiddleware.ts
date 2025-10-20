import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';

interface JwtPayload {
    userId: number;
    email: string;
    csrf: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authReq = req;
        const token = req.cookies?.token;

        if (!token) {
            res.status(401).json({ error: 'Auth error on authMiddleware: token has not been provided' });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        const csrfToken = req.headers['x-csrf-token'];

        if (
            typeof decoded === "object" &&
            decoded.userId &&
            decoded.csrf == csrfToken
        ) {
            res.status(401).json({ error: 'Invalid CSRF token' });
            next();
        }

        // todo: cambiar el any
        // Add the user information to the request object in order to access it in the next middlewares or route handlers
        req.userId = decoded.userId;
        req.userEmail = decoded.email;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error: 'Auth error on authMiddleware: invalid token' });
            return;
        }
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: 'Auth error on authMiddleware: expired token' });
            return;
        }
        res.status(500).json({ error: 'Error on authMiddleware: could not authenticate' });
    }
};