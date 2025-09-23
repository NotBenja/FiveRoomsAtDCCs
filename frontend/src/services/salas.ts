import axios from "axios";
import type { Room } from "../types/models";

const baseUrl = "http://localhost:3001";

export const getRooms = () => {
  return axios.get<Room[]>(`${baseUrl}/rooms`).then(response => response.data);
};

export const createRoom = (nueva: Omit<Room, "id">) => {
  return axios.post<Room>(`${baseUrl}/rooms`, nueva).then(response => response.data);
};

export const updateRoom = (sala: Room) => {
  return axios.put<Room>(`${baseUrl}/rooms/${sala.id}`, sala).then(response => response.data);
};

export const deleteRoom = (id: number) => {
  return axios.delete(`${baseUrl}/rooms/${id}`).then(response => response.data);
};

export default {
    getRooms,
    createRoom,
    updateRoom,
    deleteRoom,
};