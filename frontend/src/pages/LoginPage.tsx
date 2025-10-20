import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Input, Card, CardBody, CardHeader } from "@heroui/react";
import loginService from "../services/authAPI";
import type { StoredUser } from "../types/models";

interface LoginPageProps {
  onLoginSuccess: (user: StoredUser) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userResponse = await loginService.login({ email, password });
      onLoginSuccess(userResponse.user);

      const state = location.state as { from?: { pathname?: string } } | null;
      const from = state?.from?.pathname;
      const isAdmin = email.includes("admin");
      const fallback = isAdmin ? "/admin" : "/reservar";

      navigate(from ?? fallback, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Credenciales incorrectas");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
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
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              label="Correo electrónico"
              value={email}
              onValueChange={setEmail}
              variant="bordered"
              isRequired
              autoFocus
              isDisabled={loading}
            />

            <Input
              type="password"
              label="Contraseña"
              value={password}
              onValueChange={setPassword}
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
              isDisabled={!email || !password || loading}
              className="mt-2"
            >
              Ingresar
            </Button>
          </form>

          <div className="text-sm text-center text-default-500">
            <p>Usuario de prueba:</p>
            <p className="font-mono">juan.perez@ejemplo.com / 1234</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}