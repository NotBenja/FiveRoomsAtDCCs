import { test, expect } from "@playwright/test";
import { createUser, ApiClient } from "../helpers/apiHelpers";

test.describe("Flujo de Reservas", () => {
    let api: ApiClient;

    test.beforeEach(async ({ request }) => {
        const response = await request.post("http://localhost:3001/api/testing/reset");
        if (!response.ok()) {
            console.error('Reset failed:', response.status(), await response.text());
        }
        
        api = new ApiClient(request);
        await api.loginAsSetupAdmin();
    });

    test("Usuario puede crear una reserva exitosamente", async ({ page, request }) => {
        const user = {
            id: 11111111,
            first_name: "Pedro",
            last_name: "User",
            email: "pedro@user.com",
            password: "password123"
        };
        
        await createUser(request, user);
        await api.createRoom("Sala de Pruebas E2E");

        await page.goto("/login");
        await page.getByLabel(/Correo/i).fill(user.email);
        await page.getByLabel(/Contrase/i).fill(user.password);
        await page.getByRole("button", { name: "Ingresar" }).click();
        
        await expect(page).toHaveURL(/\/home/);

        await page.goto("/reservar");
        
        const roomCard = page.locator('.room-card').filter({ hasText: 'Sala de Pruebas E2E' });
        await expect(roomCard).toBeVisible();

        await roomCard.getByRole('button', { name: 'Reservar' }).click();
        await page.getByRole('button', { name: ':00-09:00' }).first().click();
        await page.getByRole("button", { name: "Continuar" }).click();
        
        await page.getByRole("button", { name: "Confirmar reserva" }).click();
        
        await expect(page.getByText(/Reserva creada/i)).toBeVisible({ timeout: 10000 });
    });

    test("Admin puede ACEPTAR una reserva", async ({ page, request }) => {
        const adminUser = {
            id: 99999999,
            first_name: "Admin",
            last_name: "Boss",
            email: "admin@dcc.uchile.cl",
            password: "adminpass"
        };
        const normalUser = {
            id: 22222222,
            first_name: "Juan",
            last_name: "Alumno",
            email: "juan@alumno.com",
            password: "userpass"
        };

        await createUser(request, adminUser);
        await createUser(request, normalUser);
        
        const roomData = await api.createRoom("Sala Admin Test");

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);

        await api.createReservation({
            roomID: roomData.id,
            userID: normalUser.id,
            time: tomorrow.toISOString(),
            status: "pendiente"
        });

        await page.goto("/login");
        await page.getByLabel(/Correo/i).fill(adminUser.email);
        await page.getByLabel(/Contrase/i).fill(adminUser.password);
        await page.getByRole("button", { name: "Ingresar" }).click();

        await expect(page).toHaveURL(/\/admin/);

        await page.getByRole("tab", { name: "Reservaciones" }).click();

        const row = page.getByRole("row").filter({ hasText: "Sala Admin Test" });
        await expect(row).toBeVisible();
        await expect(row.getByText("pendiente")).toBeVisible();

        await row.getByRole("button", { name: "Cambiar Estado" }).click();
        await page.getByRole("menuitem", { name: "Aceptar" }).click();

        await expect(row.getByText("aceptada")).toBeVisible();
    });

    test("Admin puede RECHAZAR una reserva", async ({ page, request }) => {
        const adminUser = {
            id: 88888888,
            first_name: "Admin",
            last_name: "Dos",
            email: "admin2@dcc.uchile.cl",
            password: "adminpass"
        };
        const dummyUser = { id: 333333, first_name: "Dummy", last_name: "D", email: "d@d.cl", password: "123" };
        
        await createUser(request, adminUser);
        await createUser(request, dummyUser);
        
        const roomData = await api.createRoom("Sala Rechazo");
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 2);
        tomorrow.setHours(12, 0, 0, 0);

        await api.createReservation({
            roomID: roomData.id,
            userID: dummyUser.id,
            time: tomorrow.toISOString(),
            status: "pendiente"
        });

        await page.goto("/login");
        await page.getByLabel(/Correo/i).fill(adminUser.email);
        await page.getByLabel(/Contrase/i).fill(adminUser.password);
        await page.getByRole("button", { name: "Ingresar" }).click();

        await page.getByRole("tab", { name: "Reservaciones" }).click();

        const row = page.getByRole("row").filter({ hasText: "Sala Rechazo" });
        await expect(row).toBeVisible();
        
        await row.getByRole("button", { name: "Cambiar Estado" }).click();
        await page.getByRole("menuitem", { name: "Rechazar" }).click();

        await expect(row.getByText("rechazada")).toBeVisible();
    });
});