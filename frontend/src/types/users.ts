import type { Reservation } from "./models";

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    reservations?: Reservation[];
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

// Tipo para el usuario almacenado en localStorage
export interface StoredUser {
    id: number;
    name: string;
    email: string;
}