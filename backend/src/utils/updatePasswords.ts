import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { connectDB } from '../config/database';
import User from '../models/User';

dotenv.config();

const updatePasswords = async () => {
    try {
        await connectDB();

        const users = await User.find();

        console.log(`\nUpdating passwords of: ${users.length} users...`);

        for (const user of users) {
            // Check if the password is already hashed. Bcrypt hashes start with '$2'
            if (!user.password.startsWith('$2')) {
                const plainPassword = user.password;
                const salt = await bcrypt.genSalt(10);
                const newHash = await bcrypt.hash(plainPassword, salt);
                await User.updateOne({ _id: user._id }, { $set: { password: newHash } });
            } else {
                console.log(`Password is already hashed for user with email: ${user.email}`);
            }
        }
        console.log('\nAll passwords have been updated\n');
        process.exit(0);
    } catch (error) {
        console.error('Error un updatePasswords, could not update passwords: ', error);
        process.exit(1);
    }
};

updatePasswords();