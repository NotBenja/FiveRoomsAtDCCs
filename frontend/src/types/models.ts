export interface RoomFeatures {
    maxCapacity: number;
    hasProjector: boolean;
    hasWhiteboard: boolean;
    hasAudio: boolean;
    hasVentilation: boolean;
}

export interface Room {
    id: number;
    room_name: string;
    features: RoomFeatures;
}

export interface Reservation {
    id: number;
    roomID: number;
    userID: number;
    time: string;
    status: "aceptada" | "pendiente" | "rechazada";
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export interface StoredUser {
    id: number;
    name: string;
    email: string;
}

export interface ReservationDetails extends Reservation {
    room_name?: string;
    user_name?: string;
}

export type RoomFilters = {
    capacityRange: [number, number];
    hasProjector: boolean | null;
    hasWhiteboard: boolean | null;
    hasAudio: boolean | null;
    hasVentilation: boolean | null;
}
