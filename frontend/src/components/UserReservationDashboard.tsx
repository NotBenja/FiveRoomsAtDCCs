import { useState, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import reservationAPI from "../services/reservationAPI";
import type { ReservationDetails } from "../types/models";

export default function UserReservationDashboard() {
    const [reservations, setReservations] = useState<ReservationDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReservation, setSelectedReservation] = useState<ReservationDetails | null>(null);

    const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    useEffect(() => {
        fetchUserReservations();
    }, []);

    const fetchUserReservations = async () => {
        try {
            // TEMPORAL: Hardcoded user ID for testing in frontend without login
            const user = { id: 12345678 }; // Cambia este ID según los usuarios en tu db.json

            // const user = JSON.parse(localStorage.getItem("user") || "{}");

            const allReservations = await reservationAPI.getReservationsWithDetails();
            // Filter by current user
            const userReservations = allReservations.filter((r: ReservationDetails) => r.userID === user.id);
            setReservations(userReservations);
        } catch (err) {
            console.error("Error loading reservations:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedReservation) return;
        try {
            await reservationAPI.deleteReservation(selectedReservation.id);
            setReservations(prev => prev.filter(r => r.id !== selectedReservation.id));
            onDeleteClose();
        } catch (err) {
            console.error("Error deleting reservation:", err);
        }
    };
    // Format date to readable string
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    // Color mapping for reservation status
    const getStatusColor = (status: string) => {
        switch (status) {
            case "aceptada": return "success";
            case "pendiente": return "warning";
            case "rechazada": return "danger";
            default: return "default";
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Cargando tus reservas...</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Mis Reservas</h2>

            {reservations.length === 0 ? (
                <div className="text-center p-8 text-default-400">
                    No tienes reservas todavía
                </div>
            ) : (
                <Table aria-label="Mis reservas">
                    <TableHeader>
                        <TableColumn>SALA</TableColumn>
                        <TableColumn>FECHA</TableColumn>
                        <TableColumn>ESTADO</TableColumn>
                        <TableColumn>ACCIONES</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {reservations.map((reservation) => (
                            <TableRow key={reservation.id}>
                                <TableCell>{reservation.room_name || `Sala ${reservation.roomID}`}</TableCell>
                                <TableCell>{formatDate(reservation.time)}</TableCell>
                                <TableCell>
                                    <Chip color={getStatusColor(reservation.status)} variant="flat" size="sm">
                                        {reservation.status}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="flat"
                                            onPress={() => {
                                                setSelectedReservation(reservation);
                                                onDetailOpen();
                                            }}
                                        >
                                            Ver detalle
                                        </Button>
                                        <Button
                                            size="sm"
                                            color="danger"
                                            variant="flat"
                                            onPress={() => {
                                                setSelectedReservation(reservation);
                                                onDeleteOpen();
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Modal isOpen={isDetailOpen} onClose={onDetailClose}>
                <ModalContent>
                    <ModalHeader>Detalle de Reserva</ModalHeader>
                    <ModalBody>
                        {selectedReservation && (
                            <div className="space-y-2">
                                <p><strong>Sala:</strong> {selectedReservation.room_name}</p>
                                <p><strong>Fecha:</strong> {formatDate(selectedReservation.time)}</p>
                                <p><strong>Estado:</strong> {selectedReservation.status}</p>
                                <p><strong>ID:</strong> {selectedReservation.id}</p>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={onDetailClose}>Cerrar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                <ModalContent>
                    <ModalHeader>Confirmar Cancelación</ModalHeader>
                    <ModalBody>
                        ¿Estás seguro de que deseas cancelar esta reserva?
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onDeleteClose}>
                            No
                        </Button>
                        <Button color="danger" onPress={handleDelete}>
                            Sí, cancelar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}