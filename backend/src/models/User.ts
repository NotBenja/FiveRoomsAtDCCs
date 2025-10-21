import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
    id: { type: Number, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret: any) => {
            const { _id, __v, password, ...rest } = ret;
            return rest;
        }
    }
});

// password is hashed before saving it to the database
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// method to compare input password with hashed password in the database
UserSchema.methods.comparePassword = async function(inputPass: string): Promise<boolean> {
    return bcrypt.compare(inputPass, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);