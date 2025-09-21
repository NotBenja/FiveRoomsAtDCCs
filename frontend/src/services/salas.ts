import axios from "axios";
import type { Sala } from "../types/models";

const baseUrl = "http://localhost:3001";

const getSalas = () => {
  return axios.get<Sala[]>(`${baseUrl}/salas`).then(response => response.data);
};

const createSala = (nueva: Omit<Sala, "id">) => {
  return axios.post<Sala>(`${baseUrl}/salas`, nueva).then(response => response.data);
};

const updateSala = (sala: Sala) => {
  return axios.put<Sala>(`${baseUrl}/salas/${sala.id}`, sala).then(response => response.data);
};

const deleteSala = (id: number) => {
  return axios.delete(`${baseUrl}/salas/${id}`).then(response => response.data);
};

export default { 
  getSalas, 
  createSala, 
  updateSala, 
  deleteSala 
};