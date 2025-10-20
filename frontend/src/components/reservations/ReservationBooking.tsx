import { useState, useEffect } from "react";
import RoomFilterPanel from "../rooms/RoomFilterPanel.tsx";
import RoomListing from "../rooms/RoomListing.tsx";
import RoomCardSkeleton from "../rooms/RoomCardSkeleton.tsx";
import RoomFilterPanelSkeleton from "../rooms/RoomFilterPanelSkeleton.tsx";
import { Pagination } from "@heroui/react";
import type { Room, Reservation, RoomFilters } from "../../types/models.ts";
import "../../App.css";

interface ReservationBookingProps {
    rooms: Room[];
    reservations: Reservation[];
    loading: boolean;
    onReservePress: (room: Room) => void;
}

const ROOMS_PER_PAGE = 6;

export default function ReservationBooking({
    rooms,
    reservations,
    loading,
    onReservePress
}: ReservationBookingProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const caps = rooms.map((r) => r.features?.maxCapacity).filter((n): n is number => Number.isFinite(n as number));
    const MIN_CAP = caps.length ? Math.min(...caps) : 0;
    const MAX_CAP = caps.length ? Math.max(...caps) : 1000;

    const [filters, setFilters] = useState<RoomFilters>({
        capacityRange: [0, 1000],
        hasProjector: null,
        hasWhiteboard: null,
        hasAudio: null,
        hasVentilation: null
    });

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
        const projectorOk = filters.hasProjector === null || features.hasProjector === filters.hasProjector;
        const whiteboardOk = filters.hasWhiteboard === null || features.hasWhiteboard === filters.hasWhiteboard;
        const audioOk = filters.hasAudio === null || features.hasAudio === filters.hasAudio;
        const ventilationOk = filters.hasVentilation === null || features.hasVentilation === filters.hasVentilation;
        return inRange && projectorOk && whiteboardOk && audioOk && ventilationOk;
    });

    // Paginación
    const totalPages = Math.ceil(filteredRooms.length / ROOMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROOMS_PER_PAGE;
    const paginatedRooms = filteredRooms.slice(startIndex, startIndex + ROOMS_PER_PAGE);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    return (
        <div className="space-y-6 mt-6">
            {loading ? (
                <RoomFilterPanelSkeleton />
            ) : (
                MIN_CAP <= MAX_CAP && (
                    <RoomFilterPanel
                        value={filters}
                        onChange={setFilters}
                        minCapacity={MIN_CAP}
                        maxCapacity={MAX_CAP}
                    />
                )
            )}

            {loading ? (
                <div className="room-list grid gap-3 md:gap-4">
                    {Array.from({ length: ROOMS_PER_PAGE }).map((_, i) => (
                        <RoomCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center text-sm text-default-500">
                        <span>
                            Mostrando {startIndex + 1}-{Math.min(startIndex + ROOMS_PER_PAGE, filteredRooms.length)} de {filteredRooms.length} salas
                        </span>
                    </div>

                    <RoomListing
                        rooms={paginatedRooms}
                        reservations={reservations}
                        onReservePress={onReservePress}
                        showReservationsCount
                    />

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <Pagination
                                showControls
                                total={totalPages}
                                page={currentPage}
                                onChange={setCurrentPage}
                                classNames={{
                                    cursor: "bg-primary text-white",
                                }}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}