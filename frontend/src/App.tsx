import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";

import Navbar from "./components/common/NavBar";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";

import type { StoredUser } from "./types/models";
import { getCurrentUser, logout as authLogout } from "./services/authAPI";
import "./App.css";

function Home({ user, onLogout }: { user: StoredUser | null; onLogout: () => void }) {
    const navigate = useNavigate();

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
                    onPress={onLogout}
                >
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    );
}

/**
 * ProtectedRoute mantiene la lógica de protección: si no hay user -> /login
 */
function ProtectedRoute({ user, children }: { user: StoredUser | null; children: React.ReactNode }) {
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
}

function AppContent() {
    const [user, setUser] = useState<StoredUser | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        void (async () => {
            const restored = await getCurrentUser();
            setUser(restored.user ?? null);
        })();
    }, []);

    const handleLogout = async () => {
        try {
            await authLogout();
        } finally {
            setUser(null);
            navigate("/login");
        }
    };

    return (
        <>
            <Navbar user={user} onLogout={handleLogout} />
            <Routes>
                <Route
                    path="/login"
                    element={
                        user ? <Navigate to="/" replace /> : <LoginPage onLoginSuccess={setUser} />
                    }
                />

                <Route
                    index
                    element={
                        <ProtectedRoute user={user}>
                            <Home user={user} onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/reservar"
                    element={
                        <ProtectedRoute user={user}>
                            <UserPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute user={user}>
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}
