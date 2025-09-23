import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Form } from "@heroui/react";
import type { Room } from "../types/models";
import "../App.css";

export type ReserveFormValues = {
    fullName: string;
    email: string;
};

export type ReserveRoomDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    room: Room;
    onSubmit?: (data: ReserveFormValues, room: Room) => Promise<void> | void;
    submittingText?: string;
};

export default function ReserveRoomDialog({
                                              open,
                                              onOpenChange,
                                              room,
                                              onSubmit,
                                              submittingText = "Enviando...",
                                          }: ReserveRoomDialogProps) {
    const [submitting, setSubmitting] = useState(false);

    const handleClose = () => {
        if (!submitting) onOpenChange(false);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fd = new FormData(e.currentTarget);
        const payload: ReserveFormValues = {
            fullName: String(fd.get("fullName") || "").trim(),
            email: String(fd.get("email") || "").trim(),
        };

        setSubmitting(true);

        const p = Promise.resolve().then(() => onSubmit?.(payload, room));

        p.then(() => {
            onOpenChange(false);
        }).finally(() => {
            setSubmitting(false);
        });
    };

    return (
        <Modal
            isOpen={open}
            onOpenChange={onOpenChange}
            backdrop="blur"
            placement="center"
            classNames={{
                base: "dark text-foreground bg-background",
                backdrop: "dark"
            }}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Reservar: {room?.room_name}</ModalHeader>
                        <ModalBody>
                            <Form
                                id="reserve-form"
                                className="flex flex-col gap-4"
                                validationBehavior="native"
                                onSubmit={handleSubmit}
                            >
                                <Input name="fullName" label="Nombre completo" placeholder="Nombre y apellido" autoFocus isRequired />
                                <Input name="email" label="Correo" type="email" placeholder="example@email.com" isRequired />
                                <input type="submit" hidden />
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="flat" onPress={handleClose} isDisabled={submitting}>
                                Cancelar
                            </Button>
                            <Button color="primary" type="submit" form="reserve-form" isLoading={submitting}>
                                {submitting ? submittingText : "Confirmar reserva"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}