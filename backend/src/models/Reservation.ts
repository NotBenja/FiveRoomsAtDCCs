import mongoose, { Schema, Document } from 'mongoose';
import { config } from '../config/env';

export interface IReservation extends Document {
    roomID: number;
    userID: number;
    time: string;
    status: 'pendiente' | 'aceptada' | 'rechazada';
}

const ReservationSchema: Schema = new Schema({
    roomID: { type: Number, required: true },
    userID: { type: Number, required: true },
    time: { type: String, required: true },
    status: {
        type: String,
        enum: ['aceptada', 'pendiente', 'rechazada'],
        default: 'pendiente'
    }
}, {
    timestamps: true,
    collection: `${config.mongodbCollectionPrefix}reservations`,
    toJSON: {
        transform: (_doc, ret: Record<string, unknown>) => {
            const mongoId = ret._id as { toString: () => string } | undefined;
            const normalized = {
                ...ret,
                id: mongoId ? mongoId.toString() : undefined
            };
            delete (normalized as Record<string, unknown>)._id;
            delete (normalized as Record<string, unknown>).__v;
            return normalized;
        }
    }
});

export default mongoose.model<IReservation>('Reservation', ReservationSchema);