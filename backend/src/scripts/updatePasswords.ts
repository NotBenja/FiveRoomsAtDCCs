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
            // Check if the password is already hashed. Bcrypt hashes start with '$2'.
            if (!user.password.startsWith('$2')) {
                const plainPassword = user.password;
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(plainPassword, salt);

                // todo: No se si dejar un middleware para esto o hacerlo directo en el script.
                // todo: Aquí lo hago directo en el script para que no pete.
                await User.updateOne(
                    { _id: (user as any)._id },
                    { $set: { password: hashedPassword } }
                );

                console.log(`Password update for user with email: ${user.email} (password: ${plainPassword})`);
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