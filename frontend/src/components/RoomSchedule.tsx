import type {Reservation, Room} from "../types/models.ts";
import React, {useEffect, useState} from "react";
import ScheduleBlock from "./ScheduleBlock.tsx";
import { getWeekReservations } from "../services/reservationAPI.ts";
import { Button } from "@heroui/react";
import "../App.css";

interface ScheduleProps {
    onClickBlock: (blockID: string) => void;
    room: Room
}

/**
 * Calculates a certain date's first day of the week
 * @param date
 */
const getWeekStart = (date: Date) => {
    const actualDate = new Date(date);
    const day = actualDate.getDay();
    const diff = (day === 0 ? -6 : 1 - day);
    actualDate.setDate(actualDate.getDate() + diff);
    actualDate.setHours(0,0,0,0);
    return actualDate;
}

/**
 * Calculates the weekend given a certain date
 * @param date
 */
const getWeekEnd = (date: Date) => {
    const weekEnd = new Date(date);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return weekEnd;
}

const getBlockId = (weekStart: Date, index: number, hourBlock: string) => {
    const startHour = Number(hourBlock.split(":")[0])
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    date.setHours(startHour,0,0,0);

    return date.toISOString();
}

const DAYS: string[] = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
const HOURS = (Array.from({length: 12}, (_, i) => 8 + i)).map((h) => {
    const startHour = h.toString().padStart(2, "0") + ":00";
    const endHour = (h+1).toString().padStart(2, "0") + ":00";
    return startHour + "-" + endHour;
});


const RoomSchedule: React.FC<ScheduleProps> = ({ onClickBlock, room }) => {
    const [currentBlock, setCurrentBlock] = useState<string | null>(null);
    const [currentWeekStart, setWeekStart] = useState<Date>(getWeekStart(new Date()));
    const [reservations, setReservations] = useState<Reservation[]>([]);
    useEffect(() => {
        if (room.id){
            getWeekReservations(currentWeekStart.toISOString(), getWeekEnd(currentWeekStart).toISOString(), room.id).then((data) => {
                setReservations(data);
            }); 
        }
        
    }, [currentWeekStart, room.id])

    const isReserved = (blockId: string) => {
        return reservations.some((reservation: Reservation) => {
            console.log(blockId);
            return reservation.time === blockId && reservation.status==="aceptada";
        })
    }
    const getPrevWeekDate = () => {
        const prevWeek = new Date(currentWeekStart);
        prevWeek.setDate(prevWeek.getDate() -1);
        return prevWeek;
    }

    return (
        <div className="room-schedule">
            <div className="table-head w-full flex items-center justify-between mb-6">
                <Button onPress={() => setWeekStart(getWeekStart(getPrevWeekDate()))}>Semana anterior</Button>
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-1" >Sala: {room.room_name}</h2>
                    <h3 className="text-lg font-semibold">Semana del {currentWeekStart.toLocaleDateString('es-CL', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}</h3>
                </div>
                <Button onPress={() => setWeekStart(getWeekEnd(currentWeekStart))}>Semana siguiente</Button>
            </div>
            <table className="table-fixed border-separate border-spacing-0 shadow-sm rounded-xl main-color w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-3 font-bold text-lg subtitle-conf">Horas</th>
                        {DAYS.map((d: string, index: number) => {
                            const currentDayDate = new Date(currentWeekStart)
                            currentDayDate.setUTCDate(currentWeekStart.getUTCDate() + index);
                            const currentDayNumber = currentDayDate.getUTCDate();
                            return (
                            <th key={index} className="px-4 py-3 font-bold text-lg subtitle-conf">{d} {currentDayNumber}</th>
                        )})}
                    </tr>
                </thead>
                <tbody>
                {HOURS.map((h, i) => (
                    <tr key={i}>
                        <td className="px-2 py-3 p-0 font-semibold text-gray-700">{h}</td>
                        {DAYS.map((_: string, index: number) => {
                            const blockId = getBlockId(currentWeekStart, index, h)
                            return (
                                <td key={blockId} className="p-1 min-w-[120px] min-h-[56px]">
                                    <ScheduleBlock
                                        onClickBlock={() => {
                                            setCurrentBlock(blockId);
                                            onClickBlock(blockId)
                                        }}
                                        block={h}
                                        reserved={isReserved(blockId)}
                                        selected={currentBlock === blockId}/>
                                </td>
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default RoomSchedule