import axios from "axios";
import type { Reservation, Room, User, ReservationDetails } from "../types/models";

const baseUrl = "http://localhost:3001";

export const getReservations = () => {
    return axios.get(`${baseUrl}/reservations`).then(response => response.data);
};

export const getRooms = () => {
    return axios.get(`${baseUrl}/rooms`).then(response => response.data);
};

export const getUsers = () => {
    return axios.get(`${baseUrl}/users`).then(response => response.data);
};

export const updateReservationStatus = (reservationId: number, newStatus: "aceptada" | "pendiente" | "rechazada") => {
  return axios
    .get(`${baseUrl}/reservations/${reservationId}`)
    .then(response => {
      // Get the full reservation object in order to clone it
      const updatedReservation = { ...response.data, estado: newStatus };
      return axios.put(`${baseUrl}/reservations/${reservationId}`, updatedReservation);
    })
    .then(response => response.data);
};

export const getReservationsWithDetails = () => {
  return Promise.all([
    getReservations(),
    getRooms(),
    getUsers()
  ]).then(([reservations, rooms, users]) => {
    return reservations.map((reservation: Reservation) => {
      const room = rooms.find((s: Room) => s.id === reservation.roomID);
      const user = users.find((u: User) => u.id === reservation.userID);
      
      return {
        ...reservation,
        room_name: room?.nombre,
        user_name: user ? `${user.nombre} ${user.apellido}` : undefined
      } as ReservationDetails;
    });
  });
};

export const getWeekReservations = async (weekStart: string, weekEnd: string, roomId: number) => {
    const reservations = await getReservations()
    const salaIdNum = Number(roomId);
    return reservations.filter((r: Reservation) => {
        return (Number(r.roomID) === salaIdNum && r.time >= weekStart && r.time < weekEnd);
    })
    // NO FUNCIONÓ
    //const startISO = weekStart.toISOString();
    //const endISO = weekEnd.toISOString();
    //return axios.get(`${baseUrl}/reservas?hora_gte=${startISO}&hora_lt=${endISO}&salaId=${salaId}`)
    //    .then(response => response.data);
}

export default {
    getReservations,
    getRooms,
    getUsers,
    updateReservationStatus,
    getReservationsWithDetails,
};