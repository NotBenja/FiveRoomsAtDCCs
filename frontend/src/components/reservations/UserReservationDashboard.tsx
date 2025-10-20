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
    Spinner,
} from "@heroui/react";
import reservationAPI from "../../services/reservationAPI";
import { getCurrentUser } from "../../services/authAPI";
import type { ReservationDetails } from "../../types/models";

export default function UserReservationDashboard() {
    const [reservations, setReservations] = useState<ReservationDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedReservation, setSelectedReservation] = useState<ReservationDetails | null>(null);

    const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    useEffect(() => {
        fetchUserReservations();
    }, []);

    const fetchUserReservations = async () => {
        setLoading(true);
        setError(null);

        try {
            // Obtener usuario actual desde la autenticación
            const resp = await getCurrentUser();
            const currentUser = resp?.user ?? null;

            if (!currentUser) {
                setError("No hay usuario autenticado");
                setReservations([]);
                setLoading(false);
                return;
            }

            console.log("👤 Usuario actual:", currentUser);

            // Obtener todas las reservas con detalles
            const allReservations = await reservationAPI.getReservationsWithDetails();

            // Filtrar por el ID del usuario actual
            const userReservations = allReservations.filter(
                (r: ReservationDetails) => r.userID === currentUser.id
            );

            console.log("📋 Reservas del usuario:", userReservations);
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
            alert("Error al cancelar la reserva");
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
        return (
            <div className="flex justify-center items-center p-8">
                <Spinner size="lg" label="Cargando tus reservas..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <p className="text-danger mb-4">{error}</p>
                <Button color="primary" onPress={fetchUserReservations}>
                    Reintentar
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Mis Reservas</h2>
                <Button
                    size="sm"
                    variant="flat"
                    onPress={fetchUserReservations}
                    isLoading={loading}
                >
                    Actualizar
                </Button>
            </div>

            {reservations.length === 0 ? (
                <div className="text-center p-8 text-default-400">
                    <p className="text-lg mb-2">No tienes reservas todavía</p>
                    <p className="text-sm">Las reservas que hagas aparecerán aquí</p>
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
                        <p>¿Estás seguro de que deseas cancelar esta reserva?</p>
                        {selectedReservation && (
                            <div className="mt-4 p-3 bg-default-100 rounded-lg">
                                <p className="text-sm"><strong>Sala:</strong> {selectedReservation.room_name}</p>
                                <p className="text-sm"><strong>Fecha:</strong> {formatDate(selectedReservation.time)}</p>
                            </div>
                        )}
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