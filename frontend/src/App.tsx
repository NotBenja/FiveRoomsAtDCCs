import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Button, Spinner } from "@heroui/react";

import Navbar from "./components/common/NavBar";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import RegisterPage from "./pages/RegisterPage";

import type { StoredUser } from "./types/models";
import { getCurrentUser, logout as authLogout } from "./services/authAPI";
import "./App.css";

type HomeProps = { user: StoredUser | null; onLogout: () => void };

function Home({ user, onLogout }: HomeProps) {
    const navigate = useNavigate();

    return (
        <div className="home-shell">
            <div className="home-glow" aria-hidden />

            <main className="home-layout">
                <section className="home-hero">
                    <div className="home-pill">Salas DCC · Disponibles 24/7</div>
                    <h1 className="home-title">Reserva salas del DCC sin friccion</h1>
                    <p className="home-lead">
                        Elige sala, confirma horario y comparte con tu equipo. Recargas, back y forward funcionan sin perder tu contexto.
                    </p>
                    <div className="home-actions">
                        <Button
                            size="lg"
                            color="primary"
                            radius="full"
                            className="home-btn"
                            onPress={() => navigate("/reservar")}
                        >
                            Reservar ahora
                        </Button>
                        <Button
                            size="lg"
                            variant="bordered"
                            radius="full"
                            className="home-btn-alt"
                            onPress={() => navigate("/admin")}
                        >
                            Panel admin
                        </Button>
                    </div>
                    {user && (
                        <div className="home-user-chip">
                            <span className="chip-dot" aria-hidden />
                            Sesion activa: {user.first_name} {user.last_name} · ID {user.id}
                        </div>
                    )}
                </section>

                <section className="home-grid">
                    <article className="home-card">
                        <div className="card-badge">Acceso rapido</div>
                        <h3>Reserva en segundos</h3>
                        <p>Selecciona sala, horario y confirma. La sesion se mantiene al navegar o recargar.</p>
                        <div className="card-actions">
                            <Button color="primary" onPress={() => navigate("/reservar")} size="md">
                                Abrir agenda
                            </Button>
                            <Button variant="light" onPress={() => navigate("/reservar")} size="md">
                                Ver mis reservas
                            </Button>
                        </div>
                    </article>

                    <article className="home-card">
                        <div className="card-badge secondary">Equipo admin</div>
                        <h3>Control de salas</h3>
                        <p>Gestiona salas, acepta o rechaza solicitudes y monitorea disponibilidad.</p>
                        <div className="card-actions">
                            <Button color="secondary" onPress={() => navigate("/admin")} size="md">
                                Ir al panel
                            </Button>
                        </div>
                    </article>

                    <article className="home-card">
                        <div className="card-badge subtle">Sesion y seguridad</div>
                        <h3>Navegacion estable</h3>
                        <p>Back, forward y F5 preservan tu sesion gracias a rutas protegidas y validacion de usuario.</p>
                        <div className="card-actions">
                            <Button variant="flat" color="danger" onPress={onLogout} size="md">
                                Cerrar sesion
                            </Button>
                        </div>
                    </article>
                </section>
            </main>
        </div>
    );
}

/**
 * ProtectedRoute mantiene la logica de proteccion: si no hay user -> /login
 */
function ProtectedRoute({ user, children }: { user: StoredUser | null; children: React.ReactNode }) {
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return <>{children}</>;
}

function AppContent() {
    const [user, setUser] = useState<StoredUser | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        void (async () => {
            try {
                const restored = await getCurrentUser();
                setUser(restored.user ?? null);
            } catch (error) {
                console.error("Error al obtener usuario:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-content1">
                <Spinner size="lg" label="Cargando..." />
            </div>
        );
    }

    return (
        <>
            <Navbar user={user} onLogout={handleLogout} />
            <Routes>
                <Route
                    path="/login"
                    element={
                        user ? <Navigate to="/home" replace /> : <LoginPage onLoginSuccess={setUser} />
                    }
                />

                <Route
                    path="/register"
                    element={
                        user ? <Navigate to="/home" replace /> : <RegisterPage onRegisterSuccess={setUser} />
                    }
                />

                <Route
                    path="/home"
                    element={
                        <ProtectedRoute user={user}>
                            <Home user={user} onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />

                <Route path="/" element={<Navigate to="/home" replace />} />

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

                <Route path="*" element={<Navigate to="/home" replace />} />
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
