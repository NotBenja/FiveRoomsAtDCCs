import axios from "axios";
import type { Reservation, Room, User, ReservationDetails } from "../types/models";

const baseUrl = "http://localhost:3001/api";

// Configurar axios para enviar cookies y token
axios.defaults.withCredentials = true;

// Interceptor para agregar token a todas las peticiones
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getReservations = () => {
  return axios.get(`${baseUrl}/reservations`).then(response => response.data);
};

export const getRooms = () => {
  return axios.get(`${baseUrl}/rooms`).then(response => response.data);
};

export const getUsers = () => {
  return axios.get(`${baseUrl}/users`).then(response => response.data);
};

export const updateReservationStatus = (reservationId: string, newStatus: "aceptada" | "pendiente" | "rechazada") => {
  return axios
    .get(`${baseUrl}/reservations/${reservationId}`)
    .then(response => {
      const updatedReservation = { ...response.data, status: newStatus };
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
        room_name: room?.room_name,
        user_name: user ? `${user.first_name} ${user.last_name}` : undefined
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
}

export const createReservation = (newReservation: {
  roomID: number;
  userID: number;
  time: string;
  status: string;
}) => {
  return axios.post<Reservation>(`${baseUrl}/reservations`, newReservation).then(response => response.data);
}

export const deleteReservation = (id: string) => {
  return axios.delete(`${baseUrl}/reservations/${id}`).then(response => response.data);
}

export default {
  getReservations,
  getRooms,
  getUsers,
  updateReservationStatus,
  getReservationsWithDetails,
  getWeekReservations,
  createReservation,
  deleteReservation
};