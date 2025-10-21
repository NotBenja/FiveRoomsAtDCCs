import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import type { StoredUser } from "../../types/models";

interface NavbarProps {
    user: StoredUser | null;
    onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
    const navigate = useNavigate();

    const displayName = user?.first_name + (user?.last_name ? ` ${user.last_name}` : "");

    const initial = displayName ? displayName.charAt(0).toUpperCase() : "?";

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
                                {initial}
                            </div>
                            <div className="hidden sm:flex flex-col">
                                <span className="text-sm font-medium">
                                    {displayName}
                                </span>
                                <span className="text-xs text-foreground-500">ID: {user.id}</span>
                            </div>
                        </div>

                        <Button
                            color="secondary"
                            variant="light"
                            size="sm"
                            onPress={onLogout}
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