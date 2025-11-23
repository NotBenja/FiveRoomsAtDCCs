import { APIRequestContext } from '@playwright/test';

export const apiBase = process.env.API_BASE_URL ?? 'http://localhost:3001/api';

// Helper simple para crear usuarios (público)
export async function createUser(request: APIRequestContext, userObj: any) {
  const response = await request.post(`${apiBase}/auth/register`, { data: userObj });
  if (!response.ok()) {
      console.log(`Error creando usuario: ${await response.text()}`);
  }
}

// Clase Cliente que maneja la sesión (privado)
export class ApiClient {
  private headers: { [key: string]: string } = {};

  constructor(private request: APIRequestContext) {}

  // Se loguea y guarda las credenciales (Cookie + CSRF) internamente
  async loginAsSetupAdmin() {
    const timestamp = Date.now();
    const response = await this.request.post(`${apiBase}/auth/register`, {
      data: {
        id: Math.floor(Math.random() * 100000000),
        first_name: "Setup",
        last_name: "Admin",
        email: `setup-${timestamp}@admin.com`,
        password: "password123"
      }
    });

    if (!response.ok()) {
      throw new Error(`Error en loginAsSetupAdmin: ${response.status()} - ${await response.text()}`);
    }

    // 1. Capturar Cookie
    const cookies = response.headers()['set-cookie'];
    if (!cookies) throw new Error("No se recibió cookie en el setup");
    const tokenCookie = cookies.split(';')[0];

    // 2. Capturar CSRF Token (Si tu backend lo pide en headers)
    const csrfToken = response.headers()['x-csrf-token'];

    // 3. Guardar headers
    this.headers = {
      'Cookie': tokenCookie,
      ...(csrfToken && { 'X-CSRF-Token': csrfToken }) // Solo lo agrega si existe
    };
  }

  async createRoom(name: string) {
    const response = await this.request.post(`${apiBase}/rooms`, {
      headers: this.headers, // <--- ¡AQUÍ ESTÁ LA CLAVE! Enviamos credenciales
      data: {
        room_name: name,
        features: {
          maxCapacity: 10,
          hasProjector: true,
          hasWhiteboard: true,
          hasAudio: true,
          hasVentilation: true
        }
      }
    });
    
    if (!response.ok()) {
        throw new Error(`Error creando sala: ${response.status()} ${await response.text()}`);
    }
    
    return await response.json(); // Retornamos la sala creada (con su ID real)
  }

  async createReservation(reservationObj: any) {
    const response = await this.request.post(`${apiBase}/reservations`, {
      headers: this.headers, // <--- ¡AQUÍ TAMBIÉN!
      data: reservationObj
    });

    if (!response.ok()) {
        throw new Error(`Error creando reserva: ${response.status()} ${await response.text()}`);
    }
    
    return await response.json();
  }
}