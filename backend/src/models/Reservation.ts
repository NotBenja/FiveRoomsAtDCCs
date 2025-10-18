import mongoose, { Schema, Document } from 'mongoose';

export interface IReservation extends Document {
    id: number;
    roomID: number;
    userID: number;
    time: string;
    status: 'accepted' | 'pending' | 'rejected';
}

const ReservationSchema = new Schema<IReservation>({
    id: { type: Number, required: true, unique: true },
    roomID: { type: Number, required: true },
    userID: { type: Number, required: true },
    time: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['accepted', 'pending', 'rejected'],
        default: 'pending'
    }
},
{
    timestamps: true,
    toJSON: {
        transform: (_doc, ret: any) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

export default mongoose.model<IReservation>('Reservation', ReservationSchema);