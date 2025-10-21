# Five Rooms at DCC's 🐻

Sistema de reserva de salas del DCC.

---

## Integrantes

### Equipo Peppa Git
- Benjamín Madrid
- Sebastián Bustos

### Equipo Kolog
- Marcela Vega 
- Benjamín Reyes

---

## Estructura del Proyecto
El proyecto está dividido en dos partes principales: backend y frontend.
- **Backend**: Maneja la lógica del servidor, la base de datos y las APIs.
- - **src**
- - - **config**: Configuraciones del servidor y base de datos.
- - - **controllers**: Controladores para manejar las solicitudes HTTP.
- - - **models**: Modelos de datos para MongoDB.
- - - **routes**: Definición de rutas y endpoints.
- - - **middlewares**: Funciones intermedias para manejo de autenticación y errores.
- - - **utils**: Utilidades y funciones auxiliares.
- - - **app.ts**: Archivo principal para iniciar el servidor.
- - - **server.ts**: Configuración del servidor y conexión a la base de datos.
- - **.env**: Variables de entorno para configuración.
- - **package.json**: Dependencias y scripts del proyecto.
- - **tsconfig.json**: Configuración de TypeScript.
- - **seedDB.json**: Datos iniciales para poblar la base de datos.
- **Frontend**: Interfaz de usuario para interactuar con el sistema de reservas.
- - **src**
- - - **components**: Componentes reutilizables de React.
- - - **pages**: Páginas principales de la aplicación.
- - - **services**: Servicios para interactuar con el backend.
- - - **App.tsx**: Componente raíz de la aplicación.
- - - **main.tsx**: Punto de entrada de la aplicación.
- - **public**: Archivos estáticos públicos.
- - **package.json**: Dependencias y scripts del proyecto.
- - **tsconfig.json**: Configuración de TypeScript.

---

## Tecnologías Utilizadas

### Backend
- **TypeScript** - Tipado estático
- **Express.js** - Framework web
- **MongoDB + Mongoose** - Base de datos NoSQL
- **JWT** - Autenticación con tokens
- **bcrypt** - Encriptación de contraseñas
- **cookie-parser** - Manejo de cookies

### Frontend
- **React** - Librería de UI
- **TypeScript** - Tipado estático
- **Axios** - Cliente HTTP
- **React Router** - Navegación SPA

---

## Variables de Entorno Requeridas

### Backend (`backend/.env`)

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/reservas-salas-dcc
JWT_SECRET=cambiar_este_secret_en_produccion_por_uno_seguro
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Instrucciones de inicialización y ejecución

Prerrequisitos:
- Tener instalada la última versión de Node.js
- Tener MongoDB corriendo localmente o una URI de MongoDB accesible
- npm instalado
- Git instalado

1. Clonar el repositorio:
```bash
git clone https://github.com/NotBenja/FiveRoomsAtDCCs.git
cd ProyectoReservaSalasDCC
```

2. Instalar dependencias:
```bash
npm run install
# Y si no funciona probar con:
npm run install:all
```

3. Configurar variables de entorno:
- Crear un archivo `.env` en la carpeta `backend/` con las variables mencionadas anteriormente.
- Crear un archivo `.env` en la carpeta `frontend/` con las variables mencionadas anteriormente.
- Ajustar las variables según sea necesario.

4. Poblar la base de datos (opcional, recomendado):
```bash
npm run initdb
```

5. Iniciar la aplicación:
```bash
# Desde la raíz del proyecto
npm run dev
```

Si no funciona, iniciar backend y frontend por separado:
- En una terminal, iniciar el backend:
```bash
# Desde la raíz del proyecto
cd backend
npm run dev
```
- En otra terminal, iniciar el frontend:
```bash
# Desde la raíz del proyecto
cd frontend
npm run dev
```

6. Acceder a la aplicación:
- Cliente: [http://localhost:5173](http://localhost:5173)
- Servidor: [http://localhost:3001](http://localhost:3001)

En caso de haber cambiado los puertos, usar los correspondientes.

---

## Rutas principales

### Frontend
- Home: ["/"](http://localhost:5173)
- Portal de reservas: ["/reservar"](http://localhost:5173/reservar)
- Portal de administración: ["/admin"](http://localhost:5173/admin)
- Login: ["/login"](http://localhost:5173/login)
- Registro: ["/register"](http://localhost:5173/register)

### Backend

#### Auth

| **Método** | **Ruta**           | **Descripción**                             | **Requiere Auth** |
|------------|--------------------|---------------------------------------------|-------------------|
| POST       | /api/auth/register | Registrar un nuevo usuario                  | No                |
| POST       | /api/auth/login    | Iniciar sesión                              | No                |
| POST       | /api/auth/logout   | Cerrar sesión                               | Sí                |
| GET        | /api/auth/me       | Obtener información del usuario autenticado | Sí                |

#### Salas
| **Método** | **Ruta**       | **Descripción**                         | **Requiere Auth** |
|------------|----------------|-----------------------------------------|-------------------|
| GET        | /api/rooms     | Obtener todas las salas                 | Sí                |
| GET        | /api/rooms/:id | Obtener detalles de una sala específica | Sí                |
| POST       | /api/rooms     | Crear una nueva sala                    | Sí                |
| PUT        | /api/rooms/:id | Actualizar una sala existente           | Sí                |
| DELETE     | /api/rooms/:id | Eliminar una sala                       | Sí                |

#### Reservas
| **Método** | **Ruta**              | **Descripción**                                    | **Requiere Auth** |
|------------|-----------------------|----------------------------------------------------|-------------------|
| GET        | /api/reservations     | Obtener todas las reservas del usuario autenticado | Sí                |
| GET        | /api/reservations/:id | Obtener detalles de una reserva específica         | Sí                |
| POST       | /api/reservations     | Crear una nueva reserva                            | Sí                |
| PUT        | /api/reservations/:id | Actualizar una reserva existente                   | Sí                |
| DELETE     | /api/reservations/:id | Eliminar una reserva                               | Sí                |

### Usuarios
| **Método** | **Ruta**       | **Descripción**                           | **Requiere Auth** |
|------------|----------------|-------------------------------------------|-------------------|
| GET        | /api/users     | Obtener todos los usuarios                | Sí                |
| GET        | /api/users/:id | Obtener detalles de un usuario específico | Sí                |
| PUT        | /api/users/:id | Actualizar un usuario existente           | Sí                |
| DELETE     | /api/users/:id | Eliminar un usuario                       | Sí                |