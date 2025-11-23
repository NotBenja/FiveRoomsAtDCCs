import * as dotenv from "dotenv";
// Here you can change the environment file to load
// For example, for production use 'environments/production.env'
dotenv.config({ path: 'environments/development.env' });

export const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3001,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    mongoDbName: process.env.MONGODB_DBNAME || 'reservasalasdcc',
    mongodbCollectionPrefix: process.env.MONGODB_COLLECTION_PREFIX || '',
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};