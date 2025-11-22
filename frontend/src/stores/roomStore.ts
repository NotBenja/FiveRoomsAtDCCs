import { create } from 'zustand';
import type { Room } from '../types/models';

type RoomState = {
    rooms: Room[];
    selectedRoom: Room | null;
    setRooms: (rooms: Room[]) => void;
    selectRoom: (room: Room | null) => void;
    createRoom: (room: Room) => void;
    deleteRoom: (roomId: number) => void;
    updateRoom: (room: Room) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
    rooms: [],
    selectedRoom: null,
    setRooms: (roomsData: Room[]) => { set({ rooms: roomsData }) },
    selectRoom: (room: Room | null) => set({ selectedRoom: room }),
    createRoom: (room: Room) => set((state) => ({ rooms: [...state.rooms, room] })),
    deleteRoom: (roomId: number) => set((state) => ({ rooms: state.rooms.filter(room => room.id !== roomId) })),
    updateRoom: (updatedRoom: Room) => set((state) => ({ rooms: state.rooms.map(room => room.id === updatedRoom.id ? updatedRoom : room)})),
}));