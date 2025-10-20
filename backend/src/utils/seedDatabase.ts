import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from "dotenv";
dotenv.config();

import Room from '../models/Room';
import User from '../models/User';
import Reservation from '../models/Reservation';

interface DbData {
    rooms: Array<{
        id: number;
        room_name: string;
        features: {
            maxCapacity: number;
            hasProjector: boolean;
            hasWhiteboard: boolean;
            hasAudio: boolean;
            hasVentilation: boolean;
        };
    }>;
    users: Array<{
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string;
    }>;
    reservations: Array<{
        roomID: number;
        userID: number;
        time: string;
        status: 'accepted' | 'pending' | 'rejected' | 'aceptada' | 'pendiente' | 'rechazada';
    }>;
}

/**
 * Function to seed the database with initial data from a JSON file (the same one previously used for json-server on Hito 1).
 */
const seedDatabase = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/reservasalasdcc';
        await mongoose.connect(mongoUri);
        console.log('1.   Connected to MongoDB');

        const dbJsonPath = path.join(__dirname, '../../seedDB.json');
        const dbData: DbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf-8'));

        await Room.deleteMany({});
        await User.deleteMany({});
        await Reservation.deleteMany({});
        console.log('2.   The database has been cleared');

        console.log('3.   Seeding the database with initial data...');
        if (dbData.rooms && dbData.rooms.length > 0) {
            await Room.insertMany(dbData.rooms);
            console.log(`    3.1.   ${dbData.rooms.length} rooms have been inserted into the database`);
        }

        if (dbData.users && dbData.users.length > 0) {
            await User.insertMany(dbData.users);
            console.log(`    3.2.   ${dbData.users.length} users have been inserted into the database`);
        }

        if (dbData.reservations && dbData.reservations.length > 0) {
            await Reservation.insertMany(dbData.reservations);
            console.log(`    3.3.   ${dbData.reservations.length} reservations have been inserted into the database`);
        }

        console.log('4.   The database has been successfully seeded');
        process.exit(0);
    } catch (error) {
        console.error('An error has occured while seeding the database:', error);
        process.exit(1);
    }
};

void seedDatabase();