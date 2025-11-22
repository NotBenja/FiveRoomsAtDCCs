import { create } from 'zustand';
import type { Room } from '../types/models';

type RoomState = {
    rooms: Room[];
    selectedRoom: Room | null;
    setRooms: (rooms: Room[]) => void;
    selectRoom: (room: Room) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
    rooms: [],
    selectedRoom: null,
    setRooms: (roomsData: Room[]) => { set({ rooms: roomsData }) },
    selectRoom: (room: Room) => set({ selectedRoom: room }),
}));