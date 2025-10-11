import type { Room, Reservation } from "../types/models";
import RoomCard from "./RoomCard";
import "../App.css";

export type SalaListProps = {
    rooms: Room[];
    reservations: Reservation[];
    onRoomPress?: (id: number | string) => void;
    className?: string;
    showReservationsCount?: boolean;
    onReservePress: (room: Room) => void;
};

export default function SalaList({ rooms, reservations, onRoomPress, className, showReservationsCount, onReservePress}: SalaListProps) {
    if (!rooms?.length) {
        return (
            <div className={["room-list", className].filter(Boolean).join(" ")}>
                <p className="text-foreground-500">No hay salas.</p>
            </div>
        );
    }

    return (
        <div className={["room-list grid gap-3 md:gap-4", className].filter(Boolean).join(" ")}>
            {rooms.map((s) => (
                <RoomCard
                    key={s.id}
                    reservations={reservations.filter(r => r.roomID === s.id)}
                    room={s}
                    onPress={onRoomPress}
                    showReservasCount={showReservationsCount}
                    handleReservePress={onReservePress}
                />
            ))}
        </div>
    );
}