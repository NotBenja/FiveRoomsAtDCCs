import './App.css'
import ReservationTable from './components/ReservationTable'
import RoomsTable from "./components/RoomsTable";


function App() {
  return (
    <ReservationTable />
  )
}

export function RoomsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Salas</h1>
      <RoomsTable />
    </div>
  );
}

export default App
