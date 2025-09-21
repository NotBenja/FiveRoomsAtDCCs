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

export interface Reserva {
    id: number;
    sala: number;
    usuario: number;
    hora: string;
    estado: "aceptada" | "pendiente" | "rechazada";
}

export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    contraseña: string;
}

export interface ReservaDetalle extends Reserva {
    nombreSala?: string;
    nombreUsuario?: string;
}
