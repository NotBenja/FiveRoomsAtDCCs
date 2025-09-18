export interface RoomFeatures {
    maxCapacity: number;
    hasProjector: boolean;
}

export interface Sala {
    id: number;
    nombre: string;
    caracteristicas: {
        cap_max: number;
        tiene_proyector: boolean;
        tiene_pizarra: boolean;
        tiene_audio: boolean;
        tiene_ventilacion: boolean;
    };
    horarios: {
        reservas: Reserva[];
    };
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

}