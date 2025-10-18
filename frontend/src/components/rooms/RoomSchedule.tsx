import type { Reservation, Room } from "../../types/models.ts";
import { useEffect, useState } from "react";
import ScheduleBlock from "./ScheduleBlock.tsx";
import reservationAPI from "../../services/reservationAPI.ts";
import { Button } from "@heroui/react";
import "../../App.css";

interface ScheduleProps {
    onClickBlock: (blockID: string) => void;
    room: Room;
}

const getWeekStart = (date: Date) => {
    const actualDate = new Date(date);
    const day = actualDate.getDay();
    const diff = (day === 0 ? -6 : 1 - day);
    actualDate.setDate(actualDate.getDate() + diff);
    actualDate.setHours(0, 0, 0, 0);
    return actualDate;
};

const getWeekEnd = (date: Date) => {
    const weekEnd = new Date(date);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return weekEnd;
};

const getBlockId = (weekStart: Date, index: number, hourBlock: string) => {
    const startHour = Number(hourBlock.split(":")[0]);
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    date.setHours(startHour, 0, 0, 0);
    return date.toISOString();
};

const DAYS: string[] = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
const HOURS = Array.from({ length: 12 }, (_, i) => 8 + i).map((h) => {
    const startHour = h.toString().padStart(2, "0") + ":00";
    const endHour = (h + 1).toString().padStart(2, "0") + ":00";
    return startHour + "-" + endHour;
});

export default function RoomSchedule({ onClickBlock, room }: ScheduleProps) {
    const [currentWeek, setCurrentWeek] = useState(getWeekStart(new Date()));
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

    useEffect(() => {
        const fetchReservations = async () => {
            const weekEnd = getWeekEnd(currentWeek);
            const data = await reservationAPI.getWeekReservations(
                currentWeek.toISOString(),
                weekEnd.toISOString(),
                room.id
            );
            setReservations(data);
        };
        fetchReservations();
    }, [currentWeek, room.id]);

    const handleBlockClick = (blockId: string) => {
        setSelectedBlock(blockId);
        onClickBlock(blockId);
    };

    const isReserved = (blockId: string) => {
        return reservations.some((r) => r.time === blockId && r.status === "aceptada");
    };

    const goToPreviousWeek = () => {
        const prevWeek = new Date(currentWeek);
        prevWeek.setDate(prevWeek.getDate() - 7);
        setCurrentWeek(prevWeek);
    };

    const goToNextWeek = () => {
        const nextWeek = new Date(currentWeek);
        nextWeek.setDate(nextWeek.getDate() + 7);
        setCurrentWeek(nextWeek);
    };

    return (
        <div className="room-schedule">
            <div className="table-head w-full flex items-center justify-between mb-6">
                <Button size="sm" onPress={goToPreviousWeek}>
                    ← Semana anterior
                </Button>
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-1">Sala: {room.room_name}</h2>
                    <h3 className="text-lg font-semibold">
                        Semana del {currentWeek.toLocaleDateString("es-CL", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })}
                    </h3>
                </div>
                <Button size="sm" onPress={goToNextWeek}>
                    Semana siguiente →
                </Button>
            </div>

            <table className="table-fixed border-separate border-spacing-0 shadow-sm rounded-xl main-color w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-3 font-bold text-lg subtitle-conf">Horas</th>
                        {DAYS.map((d: string, index: number) => {
                            const currentDayDate = new Date(currentWeek);
                            currentDayDate.setUTCDate(currentWeek.getUTCDate() + index);
                            const currentDayNumber = currentDayDate.getUTCDate();
                            return (
                                <th key={index} className="px-4 py-3 font-bold text-lg subtitle-conf">
                                    {d} {currentDayNumber}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {HOURS.map((h, i) => (
                        <tr key={i}>
                            <td className="px-2 py-3 p-0 font-semibold text-gray-700">{h}</td>
                            {DAYS.map((_: string, index: number) => {
                                const blockId = getBlockId(currentWeek, index, h);
                                const reserved = isReserved(blockId);
                                const selected = selectedBlock === blockId;

                                return (
                                    <td key={blockId} className="p-1 min-w-[120px] min-h-[56px]">
                                        <ScheduleBlock
                                            onClickBlock={() => handleBlockClick(blockId)}
                                            block={h}
                                            reserved={reserved}
                                            selected={selected}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}