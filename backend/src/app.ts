import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as dotenv from "dotenv";
dotenv.config();

import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';
import roomRoutes from './routes/roomRoutes';
import userRoutes from './routes/userRoutes';
import reservationRoutes from './routes/reservationRoutes';
import { authMiddleware } from './middleware/authMiddleware';

const app: Application = express();

const authPrefix = '/api/auth';
const reservationPrefix = '/api/reservations';
const roomPrefix = '/api/rooms';
const userPrefix = '/api/users';

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes that do not require authentication.
// It uses a prefix in order to redirect to the corresponding routes.
app.use(authPrefix, authRoutes);

// Routes that require authentication by using an auth middleware.
// It uses prefixes in order to redirect to the corresponding routes.
app.use(reservationPrefix, authMiddleware, reservationRoutes);
app.use(roomPrefix, authMiddleware, roomRoutes);
app.use(userPrefix, authMiddleware, userRoutes);

// Health check endpoint. For testing purposes, we could erase it later.
app.get('/health', (req: Request, res: Response) => {
    res.json({
        message: 'API de Reserva de Salas DCC',
        version: '1.0.0',
        endpoints: {
            auth: '/auth',
            rooms: '/rooms',
            users: '/users',
            reservations: '/reservations'
        }
    });
});

// Handler for unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    details: err.message
  });
});

export { app, connectDB };