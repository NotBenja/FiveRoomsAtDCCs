// todo: Devolver esto a como estaba antes, supongo que el BenjaR hizo algo parecido
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import UserPage from "./pages/UserPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import { isAuthenticated, logout, getStoredUser } from "./services/authAPI";
import "./App.css";

function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = getStoredUser();
        setUser(storedUser);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            window.location.href = '/login';
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <div className="p-6 w-max min-w-full min-h-screen bg-content1 flex flex-col items-center justify-center gap-6">
            <header className="text-center space-y-2">
                <h1 className="text-3xl font-bold title-conf">Salas DCC</h1>
                <p className="subtitle-conf">Reserva salas del DCC online.</p>
                {user && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Bienvenido, {user.first_name} {user.last_name}
                    </p>
                )}
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

                <Button
                    size="md"
                    color="danger"
                    variant="light"
                    className="mt-4"
                    onPress={handleLogout}
                >
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
}

export default function App() {
    const [authenticated, setAuthenticated] = useState(isAuthenticated());

    const handleLoginSuccess = () => {
        setAuthenticated(true);
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        authenticated ?
                            <Navigate to="/" replace /> :
                            <LoginPage onLoginSuccess={handleLoginSuccess} />
                    }
                />
                <Route
                    index
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reservar"
                    element={
                        <ProtectedRoute>
                            <UserPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
