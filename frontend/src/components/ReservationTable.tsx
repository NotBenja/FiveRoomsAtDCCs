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
  Pagination,
} from "@heroui/react";
import reservationAPI from "../services/reservationAPI";
import type { ReservationDetails } from "../types/models";

export default function ReservationTable() {
  const [reservations, setReservations] = useState<ReservationDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);

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

  const getFilteredReservations = () => {
    let filtered = reservations;

    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter((reservation) =>
        statusFilter.includes(reservation.status)
      );
    }

    return filtered;
  };

  const filteredReservations = getFilteredReservations();
  const pages = Math.max(1, Math.ceil(filteredReservations.length / 5));
  
  const getPageItems = () => {
    const start = (page - 1) * 5;
    return filteredReservations.slice(start, start + 5);
  };
  
  const pageItems = getPageItems();

  // This function allows changing the status of a reservation
  const handleStatusChange = async (
    reservationId: number,
    newStatus: "aceptada" | "pendiente" | "rechazada"
  ) => {
    try {
      await reservationAPI.updateReservationStatus(reservationId, newStatus);
      
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === reservationId ? { ...reservation, status: newStatus } : reservation
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
      {/* Filtros */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger>
                <Button size="sm" variant="flat">
                  Estado
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Filtrar por estado"
                closeOnSelect={false}
                selectionMode="multiple"
                selectedKeys={new Set(statusFilter)}
                onSelectionChange={(keys) => {
                  if (keys === "all") {
                    setStatusFilter([]);
                  } else {
                    setStatusFilter(Array.from(keys) as string[]);
                  }
                }}
              >
                <DropdownItem key="pendiente">Pendiente</DropdownItem>
                <DropdownItem key="aceptada">Aceptada</DropdownItem>
                <DropdownItem key="rechazada">Rechazada</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {filteredReservations.length} de {reservations.length} reservaciones
          </span>
        </div>
      </div>

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
          {pageItems.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.id}</TableCell>
              <TableCell>{reservation.room_name || `Sala ${reservation.roomID}`}</TableCell>
              <TableCell>{reservation.user_name || `Usuario ${reservation.userID}`}</TableCell>
              <TableCell>{formatDate(reservation.time)}</TableCell>
              <TableCell>
                <Chip color={getStatusColor(reservation.status)} variant="flat" size="sm">
                  {reservation.status}
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
                      className={reservation.status === "aceptada" ? "opacity-50" : ""}
                    >
                      Aceptar
                    </DropdownItem>
                    <DropdownItem
                      key="pendiente"
                      color="warning"
                      className={reservation.status === "pendiente" ? "opacity-50" : ""}
                    >
                      Dejar Pendiente
                    </DropdownItem>
                    <DropdownItem
                      key="rechazada"
                      color="danger"
                      className={reservation.status === "rechazada" ? "opacity-50" : ""}
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

      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{ cursor: "bg-foreground text-background" }}
          color="default"
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          Página {page} de {pages}
        </span>
      </div>
    </div>
  );
}

