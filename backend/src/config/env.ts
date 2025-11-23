import * as dotenv from "dotenv";
dotenv.config();

export const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3001,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/reservasalasdcc',
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};