import { useState } from "react";
import { Input, Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../../services/login";
import type { LoginCredentials } from "../../types/users";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setLoading(true);
        setError("");

        const credentials: LoginCredentials = {
            email,
            password
        };

        try {
            const response = await login(credentials);

            // Guardar token y usuario en localStorage
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));

            // Notificar cambios de autenticación
            window.dispatchEvent(new Event("authChanged"));

            // Redirigir según el origen o usar fallback
            const state = location.state as { from?: { pathname?: string } } | null;
            const from = state?.from?.pathname;

            // Determinar si es admin por el email
            const isAdmin = email.includes("admin");
            const fallback = isAdmin ? "/admin" : "/reservar";

            navigate(from ?? fallback, { replace: true });
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Error al iniciar sesión. Intenta de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && email && password) {
            handleLogin();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-content1 px-4">
            <Card className="w-full max-w-sm p-4 shadow-lg rounded-2xl">
                <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                    <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
                    <p className="text-sm text-default-500">Accede a tu cuenta del DCC</p>
                </CardHeader>
                <CardBody className="space-y-4">
                    <Input
                        type="email"
                        label="Correo electrónico"
                        value={email}
                        onValueChange={setEmail}
                        onKeyDown={handleKeyPress}
                        variant="bordered"
                        isRequired
                        autoFocus
                    />
                    <Input
                        type="password"
                        label="Contraseña"
                        value={password}
                        onValueChange={setPassword}
                        onKeyDown={handleKeyPress}
                        variant="bordered"
                        isRequired
                    />

                    {error && (
                        <div className="p-2 bg-danger-50 border border-danger-200 rounded-lg">
                            <p className="text-danger text-sm">{error}</p>
                        </div>
                    )}

                    <Button
                        color="primary"
                        fullWidth
                        size="lg"
                        onPress={handleLogin}
                        isLoading={loading}
                        isDisabled={!email || !password}
                        className="mt-2"
                    >
                        Ingresar
                    </Button>

                    <Button
                        color="secondary"
                        variant="light"
                        fullWidth
                        onPress={() => navigate("/")}
                    >
                        Volver al inicio
                    </Button>

                    <div className="mt-4 p-3 bg-default-100 rounded-lg">
                        <p className="text-xs text-default-600 font-semibold mb-2">Usuarios de prueba:</p>
                        <p className="text-xs text-default-500">📧 juan.perez@ejemplo.com - 🔑 1234</p>
                        <p className="text-xs text-default-500">📧 maria.gonzalez@ejemplo.com - 🔑 abcd</p>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
