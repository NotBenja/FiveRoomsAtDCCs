import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { logout } from "../../services/login";

export default function Navbar() {
    const navigate = useNavigate();
    const raw = localStorage.getItem("user");
    const user = raw ? JSON.parse(raw) as { id?: number; name?: string; email?: string } : null;
    const displayName = user?.name ?? user?.email ?? "Invitado";

    const initials = displayName
        .split(" ")
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const handleLogout = async () => {
        await logout();
        window.dispatchEvent(new Event("authChanged"));
        navigate("/login", { replace: true });
    };

    return (
        <header className="w-full bg-content1 text-foreground border-b border-default-200 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <div
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate("/")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && navigate("/")}
                >
                    <h1 className="text-lg font-semibold">Salas DCC</h1>
                    <span className="text-sm text-foreground-500 hidden sm:inline">
                        Reserva salas del DCC
                    </span>
                </div>

                {user && (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary-100 text-primary flex items-center justify-center font-semibold text-sm">
                                {initials}
                            </div>
                            <div className="hidden sm:flex flex-col">
                                <span className="text-sm font-medium">{displayName}</span>
                                <span className="text-xs text-foreground-500">ID: {user.id}</span>
                            </div>
                        </div>

                        <Button
                            color="secondary"
                            variant="light"
                            size="sm"
                            onPress={handleLogout}
                            className="ml-2"
                        >
                            Cerrar sesión
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}