import axios from "axios";
import type {Reservation, Room} from "../types/models";

const baseUrl = "http://localhost:3001";

const getReservas = () => {
    return axios.get(`${baseUrl}/reservas`).then(response => response.data);
};

const getSalas = (): Promise<Room[]> => {
    return axios.get(`${baseUrl}/salas`).then(response => response.data as Room[]);
};

const getWeekReservations = async (weekStart: string, weekEnd: string, roomId: number) => {
    const reservations = await getReservas()
    const salaIdNum = Number(roomId);
    return reservations.filter((r: Reservation) => {
        return (Number(r.salaId) === salaIdNum && r.hora >= weekStart && r.hora < weekEnd);
    })
    // NO FUNCIONÓ
    //const startISO = weekStart.toISOString();
    //const endISO = weekEnd.toISOString();
    //return axios.get(`${baseUrl}/reservas?hora_gte=${startISO}&hora_lt=${endISO}&salaId=${salaId}`)
    //    .then(response => response.data);
}

export default {
    getReservas,
    getSalas,
    getWeekReservations,
};