import { test, expect } from "@playwright/test";

const apiBase = process.env.API_BASE_URL ?? "http://localhost:3001/api";

test.describe("Autenticacion - Login", () => {
    test.beforeEach(async ({page, request}) => {
        await request.post("/api/testing/reset");
        await page.goto('/login');
    });

    test("Flujo exitoso de inicio de sesion", async ({ page, request }) => {
        const timestamp = Date.now();
        const user = {
            id: timestamp,
            first_name: "Test",
            last_name: "User",
            email: `test-${timestamp}@example.com`,
            password: "test-pass",
        };

        await request.post(`${apiBase}/auth/register`, { data: user });

        await page.goto("/login");
        await page.getByLabel(/Correo/i).fill(user.email);
        await page.getByLabel(/Contrase/).fill(user.password);
        await page.getByRole("button", { name: "Ingresar" }).click();

        await expect(page).toHaveURL(/\/home$/);
        await expect(page.getByText("Sesion activa", { exact: false })).toBeVisible();
    });

    test("Flujo de inicio de sesion fallido debido a credenciales incorrectas", async ({ page }) => {
        await page.goto("/login");
        await page.getByLabel(/Correo/i).fill("correo@incorrecto.xd");
        await page.getByLabel(/Contrase/).fill("contrasena_incorrecta");
        await page.getByRole("button", { name: "Ingresar" }).click();

        await expect(page.getByText("Error on login: Either the email or password is incorrect")).toBeVisible();
    })

    test("Boton para navegar a la pagina de registro", async ({ page }) => {
        await page.getByRole("button", { name: "Crear cuenta nueva" }).click();
        await expect(page).toHaveURL(/\/register$/);
    })

    test("Correo electrónico y contraseña son campos obligatorios, por lo que si están vacios el boton de Ingresar está deshabilitado", async ({ page }) => {
        await expect(page.getByLabel(/Correo/i)).toBeEmpty();
        await expect(page.getByLabel(/Contrase/)).toBeEmpty();
        await expect(page.getByRole("button", { name: "Ingresar" })).toBeDisabled();
    })
});

test.describe("Autenticacion - Register", () => {
    test.beforeEach(async ({page, request}) => {
        await request.post("/api/testing/reset");
        await page.goto('/register');
    });

    test("Flujo exitoso de creación de cuenta", async ({ page, request }) => {
        const base = Math.random() >= 0.5 ? 1e7 : 1e8;
        const id = Math.floor(Math.random() * 9 * base) + base;
        const user = {
            id: id,
            first_name: "Test",
            last_name: "User",
            email: `test-${id}@example.com`,
            password: "test-pass",
        };

        await page.getByLabel(/RUT/i).fill(user.id.toString());
        await page.getByLabel(/Nombre/i).fill(user.first_name);
        await page.getByLabel(/Apellido/i).fill(user.last_name);
        await page.getByLabel(/Correo/i).fill(user.email);
        await page.getByLabel(/Contrase/).fill(user.password);
        await page.getByLabel(/Confirmar contrase/).fill(user.password);
        await page.getByRole("button", { name: "Crear Cuenta" }).click();

        await expect(page).toHaveURL(/\/home$/);
        await expect(page.getByText(`ID: ${id}`, { exact: false })).toBeVisible();
    });

    test("Boton para navegar a la pagina de login", async ({ page }) => {
        await page.getByRole("button", { name: "Iniciar Sesión" }).click();
        await expect(page).toHaveURL(/\/login$/);
    })

    test("Todos los campos son obligatorios, por lo que si alguno está vacio el boton de Crear Cuenta está deshabilitado", async ({ page }) => {
        await expect(page.getByLabel(/RUT/i)).toBeEmpty();
        await expect(page.getByLabel(/Nombre/i)).toBeEmpty();
        await expect(page.getByLabel(/Apellido/i)).toBeEmpty();
        await expect(page.getByLabel(/Correo/i)).toBeEmpty();
        await expect(page.getByLabel(/Contrase/)).toBeEmpty();
        await expect(page.getByLabel(/Confirmar contrase/)).toBeEmpty();
        await expect(page.getByRole("button", { name: "Crear Cuenta" })).toBeDisabled();
    })

    test("Las contraseñas deben coincidir. Si no coinciden, se muestra un mensaje de error.", async ({ page }) => {
        const base = Math.random() >= 0.5 ? 1e7 : 1e8;
        const id = Math.floor(Math.random() * 9 * base) + base;
        const user = {
            id: id,
            first_name: "Test",
            last_name: "User",
            email: `test-${id}@example.com`,
            password: "test-pass",
        };

        await page.getByLabel(/RUT/i).fill(user.id.toString());
        await page.getByLabel(/Nombre/i).fill(user.first_name);
        await page.getByLabel(/Apellido/i).fill(user.last_name);
        await page.getByLabel(/Correo/i).fill(user.email);
        await page.getByLabel(/Contrase/).fill(user.password);
        await page.getByLabel(/Confirmar contrase/).fill(user.password + 'typo');
        await page.getByRole("button", { name: "Crear Cuenta" }).click();
        await expect(page).toHaveURL(/\/register$/);
        await expect(page.getByText(/Las contraseñas no coinciden/)).toBeVisible();
    })
});
