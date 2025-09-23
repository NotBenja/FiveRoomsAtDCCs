import React, { useState } from "react";
import { Button, Input, Form } from "@heroui/react";
import type { Room } from "../types/models";
import "../App.css";

export type ReserveFormValues = {
    firstName: string;
    lastName: string;
    email: string;
};

export type ReservationFormProps = {
    room: Room;
    selectedBlock?: string;
    onSubmit?: (data: ReserveFormValues, room: Room, selectedBlock?: string) => Promise<void> | void;
    onCancel?: () => void;
    submitLabel?: string;
    submittingText?: string;
};

export default function ReservationForm({
                                            room,
                                            selectedBlock,
                                            onSubmit,
                                            onCancel,
                                            submitLabel = "Confirmar reserva",
                                            submittingText = "Enviando...",
                                        }: ReservationFormProps) {
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const payload: ReserveFormValues = {
            firstName: String(fd.get("first_name") || "").trim(),
            lastName: String(fd.get("last_name") || "").trim(),
            email: String(fd.get("email") || "").trim(),
        };

        setSubmitting(true);
        try {
            await onSubmit?.(payload, room, selectedBlock);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-1 mb-2">
                <h3 className="text-lg font-semibold">Reservar: {room?.room_name}</h3>
                {selectedBlock && (
                    <p className="text-sm text-foreground-500">
                        Bloque seleccionado: {new Date(selectedBlock).toLocaleString("es-CL")}
                    </p>
                )}
            </div>

            <Form id="reserve-form" className="flex flex-col gap-4" validationBehavior="native" onSubmit={handleSubmit}>
                <Input name="first_name" label="Nombre" placeholder="Nombre" autoFocus isRequired />
                <Input name="last_name" label="Apellido" placeholder="Apellido" autoFocus isRequired />
                <Input name="email" label="Correo" type="email" placeholder="example@email.com" isRequired />

                <div className="flex justify-end gap-2">
                    {onCancel && (
                        <Button variant="flat" onPress={onCancel} isDisabled={submitting}>
                            Volver
                        </Button>
                    )}
                    <Button color="primary" type="submit" isLoading={submitting}>
                        {submitting ? submittingText : submitLabel}
                    </Button>
                </div>

                <input type="submit" hidden />
            </Form>
        </div>
    );
}
