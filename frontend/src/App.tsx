import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import UserPage from "./pages/UserPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import "./App.css";

function Home() {
    const navigate = useNavigate();
    return (
        <div className="p-6 w-max min-w-full min-h-screen bg-content1 flex flex-col items-center justify-center gap-6">
            <header className="text-center space-y-2">
                <h1 className="text-3xl font-bold title-conf">Salas DCC</h1>
                <p className="subtitle-conf">Reserva salas del DCC online.</p>
            </header>

            <div className="flex flex-col items-center gap-3">
                <Button
                    size="lg"
                    color="primary"
                    radius="full"
                    className="h-14 px-12 text-xl font-semibold"
                    onPress={() => navigate("/reservar")}
                >
                    Reservar
                </Button>

                <Button
                    size="lg"
                    color="secondary"
                    radius="full"
                    className="h-12 px-10 text-lg font-medium"
                    onPress={() => navigate("/admin")}
                >
                    Ingresar como Admin
                </Button>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
                <Route path="/reservar" element={<UserPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
