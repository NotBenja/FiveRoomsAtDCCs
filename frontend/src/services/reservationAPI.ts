import axios from "axios";
import type { Reserva, Sala, Usuario, ReservaDetalle } from "../types/models";

const baseUrl = "http://localhost:3001";

const getReservas = () => {
  return axios.get(`${baseUrl}/reservas`).then(response => response.data);
};

const getSalas = () => {
  return axios.get(`${baseUrl}/salas`).then(response => response.data);
};

const getUsuarios = () => {
  return axios.get(`${baseUrl}/usuarios`).then(response => response.data);
};

const updateReservationStatus = (reservationId: number, newStatus: "aceptada" | "pendiente" | "rechazada") => {
  return axios
    .put(`${baseUrl}/reservas/${reservationId}`, { estado: newStatus })
    .then(response => response.data);
};

const getReservationsWithDetails = () => {
  return Promise.all([
    getReservas(),
    getSalas(),
    getUsuarios()
  ]).then(([reservations, rooms, users]) => {
    return reservations.map((reservation: Reserva) => {
      const room = rooms.find((s: Sala) => s.id === reservation.sala);
      const user = users.find((u: Usuario) => u.id === reservation.usuario);
      
      return {
        ...reservation,
        nombreSala: room?.nombre,
        nombreUsuario: user ? `${user.nombre} ${user.apellido}` : undefined
      } as ReservaDetalle;
    });
  });
};

export default {
  getReservas,
  getSalas,
  getUsuarios,
  updateReservationStatus,
  getReservationsWithDetails,
};