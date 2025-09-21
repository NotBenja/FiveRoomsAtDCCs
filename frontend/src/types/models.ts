export interface RoomFeatures {
    maxCapacity: number;
    hasProjector: boolean;
    hasWhiteboard: boolean;
    hasAudio: boolean;
    hasVentilation: boolean;
}

export interface Room {
    id: number;
    name: string;
    features: RoomFeatures;
}

export interface Reservation {
    id: number;
    salaId: number;
    userId: number;
    hora: string;
    estado: "aceptada" | "pendiente" | "rechazada";
}
