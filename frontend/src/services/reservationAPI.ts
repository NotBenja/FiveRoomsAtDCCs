import axios from "axios";
import type { Reservation, Room, User, ReservationDetails } from "../types/models";
import axiosSecure from "../utils/axiosSecure";

const baseUrl = "http://localhost:3001";

const reservationAPI = {
  getReservations: () => {
    return axios.get<Reservation[]>(`${baseUrl}/reservations`).then(response => response.data);
  },
  getRooms: () => {
    return axios.get<Room[]>(`${baseUrl}/rooms`).then(response => response.data);
  },
  getUsers: () => {
    return axios.get<User[]>(`${baseUrl}/users`).then(response => response.data);
  },
  updateReservationStatus: (reservationId: number, newStatus: "aceptada" | "pendiente" | "rechazada") => {
    return axios
      .get(`${baseUrl}/reservations/${reservationId}`)
      .then(response => {
        const updatedReservation = { ...response.data, status: newStatus };
        return axios.put(`${baseUrl}/reservations/${reservationId}`, updatedReservation);
      })
      .then(response => response.data);
  },
  getReservationsWithDetails: async () => {
    const [reservations, rooms, users] = await Promise.all([
      reservationAPI.getReservations(),
      reservationAPI.getRooms(),
      reservationAPI.getUsers()
    ]);

    return reservations.map((reservation: Reservation) => {
      const room = rooms.find((s: Room) => s.id === reservation.roomID);
      const user = users.find((u: User) => u.id === reservation.userID);
      return {
        ...reservation,
        room_name: room?.room_name,
        user_name: user ? `${user.first_name} ${user.last_name}` : undefined
      } as ReservationDetails;
    });
  },
  getWeekReservations: async (weekStart: string, weekEnd: string, roomId: number) => {
    const reservations = await reservationAPI.getReservations();
    const salaIdNum = Number(roomId);
    return reservations.filter((r: Reservation) => {
      return (Number(r.roomID) === salaIdNum && r.time >= weekStart && r.time < weekEnd);
    });
  },
  createReservation: (newReservation: Omit<Reservation, "id">) => {
    return axios.post<Reservation>(`${baseUrl}/reservations`, newReservation).then(response => response.data);
  },
  createUser: (newUser: User) => {
    return axios.post<User>(`${baseUrl}/users`, newUser).then(res => res.data);
  },
  deleteReservation: async (id: number): Promise<void> => {
    await axiosSecure.delete(`${baseUrl}/reservations/${id}`);
  }
};

export default reservationAPI;