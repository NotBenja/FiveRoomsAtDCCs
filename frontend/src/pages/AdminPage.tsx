import { Tabs, Tab } from "@heroui/react";
import ReservationTable from "../components/reservations/ReservationTable.tsx";
import RoomsTable from "../components/rooms/RoomsTable.tsx";
import '../App.css';

export default function AdminPage() {
  return (
    <div className="p-6 w-max min-w-full min-h-screen bg-content1">
      <h1 className="text-3xl font-bold mb-6">Portal de Administración</h1>

      <Tabs variant="underlined" size="lg">
        <Tab key="rooms" title="Salas">
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Gestión de Salas</h2>
            <RoomsTable />
          </div>
        </Tab>

        <Tab key="reservations" title="Reservaciones">
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Gestión de Reservaciones</h2>
            <ReservationTable />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}