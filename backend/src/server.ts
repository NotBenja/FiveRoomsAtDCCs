import { app, connectDB } from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3001;

const startServer = async (): Promise<void> => {
    try {
        await connectDB();

        mongoose.connection.on('error', (err) => {
            console.error('❌ Error on MongoDB while setting up the database:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected! Attempting to reconnect...');
            setTimeout(async () => {
                try {
                    await connectDB();
                } catch (error) {
                    console.error('❌ Reconnection attempt failed:', error);
                }
            }, 5000);
        });

        app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
        console.log(`Server running on environment: ${process.env.NODE_ENV || 'non defined environment'}`);
        console.log(`URL: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error on startServer, could not start the server::', error);
        process.exit(1);
    }
};

startServer();