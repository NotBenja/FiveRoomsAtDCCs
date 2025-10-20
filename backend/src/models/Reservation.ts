import mongoose, { Schema, Document } from 'mongoose';

export interface IReservation extends Document {
    roomID: number;
    userID: number;
    time: string;
    status: 'pending' | 'accepted' | 'rejected' | 'aceptada' | 'pendiente' | 'rechazada';
}

const ReservationSchema: Schema = new Schema({
    roomID: { type: Number, required: true },
    userID: { type: Number, required: true },
    time: { type: String, required: true },
    status: {
        type: String,
        enum: ['accepted', 'pending', 'rejected', 'aceptada', 'pendiente', 'rechazada'],
        default: 'pending'
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret: any) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

export default mongoose.model<IReservation>('Reservation', ReservationSchema);