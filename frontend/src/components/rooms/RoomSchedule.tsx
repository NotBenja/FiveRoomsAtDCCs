import type { Reservation, Room } from "../../types/models";
import { useEffect, useState } from "react";
import ScheduleBlock from "./ScheduleBlock";
import reservationAPI from "../../services/reservationAPI";
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
  weekEnd.setHours(0, 0, 0, 0);
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
      try {
        const all = await reservationAPI.getReservations();
        const weekStart = getWeekStart(currentWeek);
        const weekEnd = getWeekEnd(currentWeek);

        const filtered = all.filter((r: Reservation) => {
          const t = r.time ? new Date(r.time) : null;
          if (!t) return false;
          // compatibilidad roomID / roomId
          const roomIdMatch = (r.roomID ?? r.roomID) === room.id;
          return t >= weekStart && t < weekEnd && roomIdMatch;
        });

        setReservations(filtered);
      } catch (err) {
        console.error("Error fetching reservations for schedule", err);
        setReservations([]);
      }
    };

    void fetchReservations();
  }, [currentWeek, room.id]);

  const handleBlockClick = (blockId: string) => {
    setSelectedBlock(blockId);
    onClickBlock(blockId);
  };

  const isReserved = (blockId: string) => reservations.some((r) => r.time === blockId && r.status === "aceptada");

  const prevWeek = () => {
    const p = new Date(currentWeek);
    p.setDate(p.getDate() - 7);
    setCurrentWeek(p);
  };

  const nextWeek = () => {
    const n = new Date(currentWeek);
    n.setDate(n.getDate() + 7);
    setCurrentWeek(n);
  };

  return (
    <div className="room-schedule">
      <div className="table-head w-full flex items-center justify-between mb-6">
        <Button onPress={prevWeek}>← Semana anterior</Button>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold mb-1">Sala: {room.room_name}</h2>
          <h3 className="text-lg font-semibold">
            Semana del {currentWeek.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" })}
          </h3>
        </div>
        <Button onPress={nextWeek}>Semana siguiente →</Button>
      </div>

      <table className="table-fixed border-separate border-spacing-0 shadow-sm rounded-xl main-color w-full">
        <thead>
          <tr>
            <th className="px-4 py-3 font-bold text-lg subtitle-conf">Horas</th>
            {DAYS.map((d, idx) => {
              const currentDayDate = new Date(currentWeek);
              currentDayDate.setDate(currentWeek.getDate() + idx);
              const currentDayNumber = currentDayDate.getDate();
              return (
                <th key={d} className="px-4 py-3 font-bold text-lg subtitle-conf">
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
              {DAYS.map((_, dayIndex) => {
                const blockId = getBlockId(currentWeek, dayIndex, h);
                return (
                  <td key={blockId} className="p-1 min-w-[120px] min-h-[56px]">
                    <ScheduleBlock
                      onClickBlock={() => handleBlockClick(blockId)}
                      block={h}
                      reserved={isReserved(blockId)}
                      selected={selectedBlock === blockId}
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