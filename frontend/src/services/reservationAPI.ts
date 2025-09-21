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
    .get(`${baseUrl}/reservas/${reservationId}`)
    .then(response => {
      // Get the full reservation object in order to clone it
      const updatedReservation = { ...response.data, estado: newStatus };
      return axios.put(`${baseUrl}/reservas/${reservationId}`, updatedReservation);
    })
    .then(response => response.data);
};

const getReservationsWithDetails = () => {
  return Promise.all([
    getReservas(),
    getSalas(),
    getUsuarios()
  ]).then(([reservations, rooms, users]) => {
    return reservations.map((reservation: Reserva) => {
      // Convertir IDs a string para comparar correctamente
      const room = rooms.find((s: Sala) => s.id.toString() === reservation.sala.toString());
      const user = users.find((u: Usuario) => u.id.toString() === reservation.usuario.toString());
      
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