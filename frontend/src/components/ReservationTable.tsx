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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import reservationAPI from "../services/reservationAPI";
import type { ReservaDetalle } from "../types/models";

export default function ReservationTable() {
  const [reservations, setReservations] = useState<ReservaDetalle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationAPI.getReservationsWithDetails();
        setReservations(data);
      } catch (err) {
        console.error("Error loading reservations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // This function allows changing the status of a reservation
  const handleStatusChange = async (
    reservationId: number,
    newStatus: "aceptada" | "pendiente" | "rechazada"
  ) => {
    try {
      await reservationAPI.updateReservationStatus(reservationId, newStatus);
      
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === reservationId ? { ...reservation, estado: newStatus } : reservation
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // This function allows formatting dates prettier :p
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // A function made with the purpose of giving feedback with colors to the status of a reservation :D
  const getStatusColor = (status: string) => {
    switch (status) {
      case "aceptada": return "success";
      case "pendiente": return "warning";
      case "rechazada": return "danger";
      default: return "default";
    }
  };

  // A basic version of spinner xD
  if (loading) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reservas de Salas</h1>

      <Table aria-label="Tabla de reservas">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>SALA</TableColumn>
          <TableColumn>USUARIO</TableColumn>
          <TableColumn>FECHA</TableColumn>
          <TableColumn>ESTADO</TableColumn>
          <TableColumn>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.id}</TableCell>
              <TableCell>{reservation.nombreSala || `Sala ${reservation.sala}`}</TableCell>
              <TableCell>{reservation.nombreUsuario || `Usuario ${reservation.usuario}`}</TableCell>
              <TableCell>{formatDate(reservation.hora)}</TableCell>
              <TableCell>
                <Chip color={getStatusColor(reservation.estado)} variant="flat" size="sm">
                  {reservation.estado}
                </Chip>
              </TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" size="sm">
                      Cambiar Estado
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Cambiar estado de reserva"
                    onAction={(key) =>
                      handleStatusChange(reservation.id, key as "aceptada" | "pendiente" | "rechazada")
                    }
                  >
                    <DropdownItem
                      key="aceptada"
                      color="success"
                      className={reservation.estado === "aceptada" ? "opacity-50" : ""}
                    >
                      Aceptar
                    </DropdownItem>
                    <DropdownItem
                      key="pendiente"
                      color="warning"
                      className={reservation.estado === "pendiente" ? "opacity-50" : ""}
                    >
                      Dejar Pendiente
                    </DropdownItem>
                    <DropdownItem
                      key="rechazada"
                      color="danger"
                      className={reservation.estado === "rechazada" ? "opacity-50" : ""}
                    >
                      Rechazar
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

