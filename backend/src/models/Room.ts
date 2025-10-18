import mongoose, { Schema, Document } from 'mongoose';

export interface IRoomFeatures {
    maxCapacity: number;
    hasProjector: boolean;
    hasWhiteboard: boolean;
    hasAudio: boolean;
    hasVentilation: boolean;
}

export interface IRoom extends Document {
    id: number;
    room_name: string;
    features: IRoomFeatures;
}

const RoomFeaturesSchema = new Schema<IRoomFeatures>({
    maxCapacity: { type: Number, required: true },
    hasProjector: { type: Boolean, required: true },
    hasWhiteboard: { type: Boolean, required: true },
    hasAudio: { type: Boolean, required: true },
    hasVentilation: { type: Boolean, required: true }
},
{
    _id: false
});

const RoomSchema = new Schema<IRoom>({
    id: { type: Number, required: true, unique: true },
    room_name: { type: String, required: true },
    features: { type: RoomFeaturesSchema, required: true }
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

export default mongoose.model<IRoom>('Room', RoomSchema);