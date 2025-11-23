import { app, connectDB } from './app';
import mongoose from 'mongoose';
import { config } from './config/env';

const HOST = config.host;
const PORT = config.port;

const startServer = async (): Promise<void> => {
    try {
        if (!config.jwtSecret) {
                console.error('FATAL ERROR: JWT_SECRET is not defined.');
                process.exit(1);
            }

        await connectDB();

        mongoose.connection.on('error', (err) => {
            console.error('Error on MongoDB while setting up the database:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected! Attempting to reconnect...');
            setTimeout(async () => {
                try {
                    await connectDB();
                } catch (error) {
                    console.error('Reconnection attempt failed:', error);
                }
            }, 5000);
        });

        app.listen({ port: PORT, host: HOST }, () => {
            console.log(`Server running on port: ${PORT}`);
            console.log(`Server running on environment: ${config.nodeEnv || 'non defined environment'}`);
            console.log(`URL: http://${HOST}:${PORT}`);
        });
    } catch (error) {
        console.error('Error on startServer, could not start the server::', error);
        process.exit(1);
    }
};

startServer();