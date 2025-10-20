import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card, CardBody, CardHeader } from "@heroui/react";
import authService from "../services/authAPI";
import type { StoredUser } from "../types/models";

interface RegisterPageProps {
    onRegisterSuccess: (user: StoredUser) => void;
}

export default function RegisterPage({ onRegisterSuccess }: RegisterPageProps) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validaciones
        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            setLoading(false);
            setTimeout(() => setError(""), 5000);
            return;
        }

        if (formData.password.length < 4) {
            setError("La contraseña debe tener al menos 4 caracteres");
            setLoading(false);
            setTimeout(() => setError(""), 5000);
            return;
        }

        const idNum = parseInt(formData.id);
        if (isNaN(idNum) || idNum <= 0) {
            setError("El RUT debe ser un número válido");
            setLoading(false);
            setTimeout(() => setError(""), 5000);
            return;
        }

        try {
            const response = await authService.register({
                id: idNum,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password
            });

            onRegisterSuccess(response.user);
            navigate("/reservar", { replace: true });
        } catch (err: unknown) {
            console.error("Error en registro:", err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Error al crear la cuenta. Verifica que el RUT y correo no estén registrados.");
            }
            setTimeout(() => setError(""), 5000);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return (
            formData.id &&
            formData.first_name &&
            formData.last_name &&
            formData.email &&
            formData.password &&
            formData.confirmPassword &&
            !loading
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-content1 px-4 py-8">
            <Card className="w-full max-w-md p-4 shadow-lg rounded-2xl">
                <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                    <h2 className="text-2xl font-bold">Crear Cuenta</h2>
                    <p className="text-sm text-default-500">Regístrate en el sistema DCC</p>
                </CardHeader>

                <CardBody className="space-y-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                        <Input
                            type="number"
                            label="RUT (sin puntos ni guión)"
                            placeholder="12345678"
                            value={formData.id}
                            onValueChange={(value) => handleChange("id", value)}
                            variant="bordered"
                            isRequired
                            autoFocus
                            isDisabled={loading}
                        />

                        <Input
                            type="text"
                            label="Nombre"
                            value={formData.first_name}
                            onValueChange={(value) => handleChange("first_name", value)}
                            variant="bordered"
                            isRequired
                            isDisabled={loading}
                        />

                        <Input
                            type="text"
                            label="Apellido"
                            value={formData.last_name}
                            onValueChange={(value) => handleChange("last_name", value)}
                            variant="bordered"
                            isRequired
                            isDisabled={loading}
                        />

                        <Input
                            type="email"
                            label="Correo electrónico"
                            value={formData.email}
                            onValueChange={(value) => handleChange("email", value)}
                            variant="bordered"
                            isRequired
                            isDisabled={loading}
                        />

                        <Input
                            type="password"
                            label="Contraseña"
                            value={formData.password}
                            onValueChange={(value) => handleChange("password", value)}
                            variant="bordered"
                            isRequired
                            isDisabled={loading}
                        />

                        <Input
                            type="password"
                            label="Confirmar contraseña"
                            value={formData.confirmPassword}
                            onValueChange={(value) => handleChange("confirmPassword", value)}
                            variant="bordered"
                            isRequired
                            isDisabled={loading}
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
                            type="submit"
                            isLoading={loading}
                            isDisabled={!isFormValid()}
                            className="mt-2"
                        >
                            Crear cuenta
                        </Button>
                    </form>

                    <div className="pt-2 border-t border-default-200">
                        <p className="text-sm text-center text-default-500 mb-2">
                            ¿Ya tienes cuenta?
                        </p>
                        <Button
                            variant="flat"
                            fullWidth
                            onPress={() => navigate("/login")}
                            isDisabled={loading}
                        >
                            Iniciar sesión
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}