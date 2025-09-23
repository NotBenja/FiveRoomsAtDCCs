import { useEffect, useState } from "react";
import RoomFilterPanel from "../components/RoomFilterPanel.tsx";
import RoomListing from "../components/RoomListing.tsx";
import RoomCardSkeleton from "../components/RoomCardSkeleton.tsx";
import type { Room, Reservation, RoomFilters } from "../types/models.ts";
import { getRooms, getReservations } from "../services/reservationAPI.ts";
import "../App.css";

export default function UserPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const caps = rooms
        .map(r => r.features?.maxCapacity)
        .filter((n): n is number => Number.isFinite(n as number));
    const MIN_CAP = caps.length ? Math.min(...caps) : 0;
    const MAX_CAP = caps.length ? Math.max(...caps) : 1000;

    const [filters, setFilters] = useState<RoomFilters>({
        capacityRange: [0, 1000],
        hasProjector: null,
        hasWhiteboard: null,
        hasAudio: null,
        hasVentilation: null,
    });

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            const [roomsData, reservationsData] = await Promise.all([getRooms(), getReservations()]);
            setRooms(roomsData);
            setReservations(reservationsData);
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        setFilters((f: RoomFilters) => {
            const [curMin, curMax] = f.capacityRange;
            const clampedMin = Math.max(MIN_CAP, Math.min(curMin, MAX_CAP));
            const clampedMax = Math.max(MIN_CAP, Math.min(curMax, MAX_CAP));
            return {
                ...f,
                capacityRange:
                    MIN_CAP <= MAX_CAP ? ([clampedMin, clampedMax] as [number, number]) : ([0, 1000] as [number, number]),
            };
        });
    }, [MIN_CAP, MAX_CAP]);

    const filteredRooms = rooms.filter((s) => {
        const features = s.features ?? {};
        const cap = features.maxCapacity ?? 0;

        const inRange = cap >= filters.capacityRange[0] && cap <= filters.capacityRange[1];

        const projectorOk   = filters.hasProjector   === null || features.hasProjector   === filters.hasProjector;
        const whiteboardOk  = filters.hasWhiteboard  === null || features.hasWhiteboard  === filters.hasWhiteboard;
        const audioOk       = filters.hasAudio       === null || features.hasAudio       === filters.hasAudio;
        const ventilationOk = filters.hasVentilation === null || features.hasVentilation === filters.hasVentilation;

        return inRange && projectorOk && whiteboardOk && audioOk && ventilationOk;
    });

    return (
        <div className="p-6 w-max min-w-full min-h-screen bg-content1">
            <header className="mb-6 text-center">
                <h1 className="text-3xl font-bold title-conf">Gestión de Salas de Reuniones</h1>
                <p className="subtitle-conf">Explora y reserva salas según tus necesidades</p>
            </header>

            <div className="mx-auto w-full max-w-4xl space-y-6">
                {MIN_CAP <= MAX_CAP && (
                    <RoomFilterPanel
                        value={filters}
                        onChange={setFilters}
                        minCapacity={MIN_CAP}
                        maxCapacity={MAX_CAP}
                    />
                )}

                {error && (
                    <div className="rounded-lg border border-danger-300 bg-danger-50 p-3 text-danger-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="room-list grid gap-3 md:gap-4">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <RoomCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <RoomListing rooms={filteredRooms} reservations={reservations} showReservationsCount />
                )}
            </div>
        </div>
    );
}
