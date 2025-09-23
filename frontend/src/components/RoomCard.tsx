import { useState } from "react";
import { Card, CardBody, Chip, Button } from "@heroui/react";
import type { PressEvent } from "@react-aria/interactions";
import type { Room, Reservation } from "../types/models";
import ReservationForm, { type ReserveFormValues } from "./ReservationForm.tsx";
import "../App.css";

export type SalaCardProps = {
    room: Room;
    reservations: Reservation[];
    onPress?: (salaId: number) => void;
    className?: string;
    accentColor?: string;
    showReservasCount?: boolean;
};

function pickAccentFromId(id: number): string {
    const hue = (id * 37) % 360;
    return `hsl(${hue} 80% 85%)`;
}

export default function SalaCard({ room, reservations, onPress, className, accentColor, showReservasCount = false }: SalaCardProps) {
    const [open, setOpen] = useState(false);

    const { id, room_name, features } = room;
    const accent = accentColor ?? pickAccentFromId(id);
    const reservasCount = Array.isArray(reservations) ? reservations.length : 0;

    const handleReservePress = (e: PressEvent) => {
        if (typeof (e as unknown as Event).stopPropagation === "function") (e as unknown as Event).stopPropagation();
        setOpen(true);
    };

    const handleSubmit = async (data: ReserveFormValues, s: Room) => {
        console.log("Reserva enviada:", { sala: s.id, ...data });
    };

    console.log(room)
    return (
        <>
            <Card
                isPressable={!!onPress}
                onPress={() => onPress?.(id)}
                radius="lg"
                className={[
                    "room-card",
                    "border",
                    "bg-content1",
                    "shadow-sm",
                    "hover:shadow-md",
                    className,
                ]
                    .filter(Boolean)
                    .join(" ")}
                style={{
                    borderColor: "rgba(15, 23, 42, 0.08)",
                    overflow: "hidden",
                    isolation: "isolate",
                }}
            >
                <div className="room-accent" aria-hidden style={{ background: accent }} />

                <CardBody className="p-4 md:p-5">
                    <div className="flex items-start gap-4">
                        <div
                            className="shrink-0 rounded-2xl border room-thumb"
                            style={{
                                borderColor: "rgba(15, 23, 42, 0.08)",
                                background: `color-mix(in srgb, ${accent} 35%, white)`,
                            }}
                        />

                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                                <h3 className="room-title text-base md:text-lg font-semibold truncate">
                                    {room_name}
                                </h3>

                                <Button
                                    className="shrink-0"
                                    color="primary"
                                    radius="full"
                                    size="sm"
                                    variant="solid"
                                    onPress={handleReservePress}
                                >
                                    Reservar
                                </Button>
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-foreground-500">
                                <Chip size="sm" variant="flat">
                                    Capacidad: {features.maxCapacity}
                                </Chip>

                                {features.hasProjector && (
                                    <Chip size="sm" variant="flat" color="secondary">
                                        Proyector
                                    </Chip>
                                )}

                                {features.hasWhiteboard && (
                                    <Chip size="sm" variant="flat">
                                        Pizarra
                                    </Chip>
                                )}

                                {features.hasAudio && (
                                    <Chip size="sm" variant="flat" color="warning">
                                        Audio
                                    </Chip>
                                )}

                                {features.hasVentilation && (
                                    <Chip size="sm" variant="flat" color="success">
                                        Ventilación
                                    </Chip>
                                )}

                                {showReservasCount && reservasCount > 0 && (
                                    <Chip size="sm" variant="flat">
                                        Reservas: {reservasCount}
                                    </Chip>
                                )}
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <ReservationForm
                open={open}
                onOpenChange={setOpen}
                room={room}
                onSubmit={handleSubmit}
            />
        </>
    );
}