import { create } from "zustand";
import type { StoredUser } from "../types/models";

type UserState = {
    user: StoredUser | null;

    login(user: StoredUser): void;
    logout(): void;
};

export const useUserStore = create<UserState>((set) => ({
    user: null,
    login: (newUser: StoredUser) => set(() => ({ user: newUser})),
    logout: () => set(() => ({user: null})),
}));