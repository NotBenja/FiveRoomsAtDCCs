# Informe Hito 3: Manejo de estados, tests e2e y deploy de la aplicación

## Información del hito:

### Integrantes del equipo:
- Integrante 1: Sebastián Bustos Andrade
- Integrante 2: Benjamín Madrid Fuenzalida
- Integrante 3: Benjamín Reyes Bravo
- Integrante 4: Marcela Vega Magliarelli (QEPD)

### Equipo docente:
- Profesor de cátedra: Matías Toro
- Profesores auxiliares: Ignacio Cornejo, Carlos Ruiz

### Ayudantes:
- Ayudante: Bastián Corrales, Javier Kauer, Juan I. Valdivia, Martín Pinochet

### Fecha de entrega:
- 23 de noviembre de 2025


## Descripción del hito
Actualmente, el sistema de reserva de horas en las salas del DCC se realiza de manera manual, lo que lo convierte en un proceso poco eficiente y engorroso, dependiente en gran medida de la disponibilidad de los administradores. En muchas ocasiones, los estudiantes deben esperar varias horas para recibir la confirmación de su solicitud y la asignación de sala, y si el horario ya estaba ocupado por otras solicitudes, recién entonces se les informa, obligándolos a reiniciar el proceso con una nueva propuesta de horario.

Este sistema también presenta limitaciones en cuanto a la asignación de salas: aunque los usuarios pueden expresar preferencias, con frecuencia no es posible reservar la sala deseada, y en general solo se pide una sala, dejando en manos del administrador la elección de esta. Además, no existe un acceso inmediato a la información sobre las características y capacidades de cada sala, y en algunos casos las solicitudes incluso se pierden entre mensajes.

Nuestro proyecto consiste en el desarrollo de una aplicación web para la gestión de salas y reservas de horas. El objetivo principal es ofrecer una plataforma centralizada donde estudiantes y administradores puedan interactuar de forma eficiente: los estudiantes revisan la disponibilidad de horarios y realizan sus reservas, mientras que los administradores gestionan las salas y supervisan las solicitudes.

La aplicación integrará herramientas de filtrado y visualización que permitirán acceder rápidamente a la información relevante de las salas. Así, los usuarios podrán seleccionar la sala más adecuada a sus necesidades, mientras que los administradores contarán con un sistema ordenado para gestionar solicitudes, actualizar estados de reserva y mantener un registro claro del uso de los espacios.

De esta forma, buscamos mejorar la experiencia de los usuarios y facilitar el trabajo de administración, asegurando el uso óptimo de espacios.


## Listado de funcionalidades

### Vista Login/Register
Esta vista fue desarrollada para la creación y autenticación de usuarios en nuestra plataforma. De esta manera, las demás vistas solo pueden ser accedidas por usuarios registrados en la aplicación. Esta vista cuenta con las siguientes funcionalidades y su estado de avance:
- Hito 2:
    - Registro/Creación de usuarios con RUT **(Realizada)**.
    - Autenticación de usuario mediante correo y contraseña **(Realizada)**.

### Navbar
Se agregó una barra de navegación que permite:
- Hito 2:
    - Ver el usuario autenticado actualmente **(Realizada)**.
    - Volver a la página de inicio **(Realizada)**.
    - Cerrar sesión del usuario actual **(Realizada)**.

### Vista Administrador
La vista de administrador está pensada como un panel de gestión para la persona encargada de administrar las salas y las reservas. En esta sección se incluyen las siguientes funcionalidades, junto con su estado de avance:
- Hito 1:
    - Visualización de una tabla con todas las salas disponibles y sus características (capacidad, proyector, pizarra, audio y ventilación) **(Realizada)**.

    - Visualización de una tabla con las reservas realizadas, incluyendo atributos como sala, usuario, fecha y estado. **(Realizada)**.

    - Actualización del estado de una reserva, pudiendo marcarla como aceptada, pendiente o rechazada **(Realizada)**.

    - Edición y eliminación de salas previamente creadas **(Realizada)**.

    - Aplicación de filtros para mostrar únicamente las reservas según su estado. **(Realizada)**.

    - Aplicación de filtros sobre las salas según sus características (proyector, pizarra, audio y ventilación) **(Realizada)**.

    - Creación de nuevas salas desde el panel **(Realizada)**.

    - Búsqueda de salas por nombre **(Realizada)**.


### Vista para Reservar Horas
La vista para reservar horas permite que el usuario pueda navegar dentro de un listado de salas del DCC y seleccionar una para poder reservarla en un horario específico. En esta sección se incluyen las siguientes funcionalidades, junto con su estado de avance:

- Hito 1:

    - Visualización del listado de salas del DCC con sus características **(Realizada)**.

    - Visualización de bloques de horarios en una sala seleccionada. Los bloques se muestran de forma semanal y señalan si han sido ocupados o no **(Realizada)**.

    - Envío de reserva mediante formulario seleccionando el horario especificado **(Realizada)**.

    - Aplicación de filtros sobre el listado de salas según sus características (capacidad, proyector, pizarra, audio y ventilación) **(Realizada)**.

- Hito 2:
    - Visualización de tabla resumen de reservas del usuario activo **(Realizada)**.
    - Paginación de listado de salas para reservar **(Realizada)**.
    - Tabulación de página de reservas de hora en funcionalidades: "Reservar Sala" y "Mis Reservas" **(Realizada)**.


### Estado Global utilizando Zustand
Para este hito se implementó un sistema de estado global utilizando Zustand con el objetivo principal de evitar la sobrecarga de la aplicación al manejar estados duplicados y simplificar el uso de props entre componentes.

Para esto se definieron dos stores, uno para el usuario (UserStore) y otro para las salas (RoomStore). Evitando manejar estados separados para elementos como la barra de navegación, el sistema de reservas, la página principal y otros componentes que dependen tanto de la información del usuario como del listado de salas actuales o la sala seleccionada actualmente.

El almacenamiento global implementado permitiría mantener información compartida del usuario autenticado y las salas disponibles actualizada y accesible desde cualquier parte de la aplicación.

#### UserStore
Para el store del user se creó el tipo UserState, el cual simplemente contiene el usuario atentificado de tipo StoredUser (Usuario obtenido de la base de datos), además de funciones para login y logout.

En el UserStore se inicializa el usuario en null, y se definen las funciones login y logout, las cuales simplemente cambian el usuario actual a un nuevo usuario entregado para login o a null para logout.

```ts
import { create } from "zustand";
import type { StoredUser } from "../types/models";

type UserState = {
    user: StoredUser | null;

    login(user: StoredUser): void;
    logout(): void;
};

export const useUserStore = create<UserState>((set) => ({
    user: null,
    login: (newUser: StoredUser) => set(() => ({ user: newUser})),
    logout: () => set(() => ({user: null})),
}));
```

Luego este estado nuevo se utiliza en todos los componentes que mantienen un estado user usando useState. Por ejemplo.

En App se utilizaba:
```
const [user, setUser] = useState<StoredUser | null>(null);
```
El usuario se obtenía de la api de autentificación y luego se extendía a la home page, user page, y admin page.
Además, para login y register se le entregaba el metodo setUser, para que estos pudieran cambiar el estado del user una vez que este se autentificara correctamente.

Al cambiarlo por un estado global, ya no es necesario pasarle el user o setUser a cada uno de estos componentes, sino que estos pueden modificarlos por si mismos ya que esta disponible desde cualquier punto de la aplicación.

Ejemplo de utilización del store:

- En la figura 2 se puede observar como user deja de manejarse con useState pasando a ser manejado por useUserStore.

Luego cada vez que se utilice set se utilizan login y logout en reemplazo dependiendo si era un set de usuario nuevo o set de null.
```ts
function AppContent() {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    const { user, login, logout } = useUserStore();
}
```

- Otro observable en la figura 3, antes Home utilizaba user como prop, obtenido de AppContent, sin embargo con el estado global esto ya no es necesario.
```ts
import {useUserStore} from "../stores/UserStore";
type HomeProps = { onLogout: () => void };

function Home() {
    const navidate = useNavigate();
    const { user } = useUserStore();
}
```

- Esto se realizó en cada componente que utilizaba el usuario manejado por useState u obtenido de un prop por parte del componente padre.

#### RoomStore



### 4. Ruteo (React Router)

#### 4.1 Implementación de rutas privadas y públicas

Para la navegación dentro de la aplicación, se utilizó la librería `react-router-dom`, que permite manejar el enrutamiento del lado del cliente en aplicaciones web React. La estructura principal de navegación se define en el componente `App`, donde se utiliza `BrowserRouter` para envolver la aplicación y `Routes` para definir las distintas rutas disponibles.

Se implementó un componente llamado `ProtectedRoute` para manejar el acceso a las rutas privadas. Este componente verifica si existe un usuario autenticado en el estado global (`UserStore`). Si no hay un usuario activo, redirige automáticamente a la página de inicio de sesión (`/login`).

Las rutas definidas en la aplicación son:

- **/login**: Página de inicio de sesión. Si el usuario ya está autenticado, redirige a `/home`.
- **register**: Página de registro de nuevos usuarios. También redirige a `/home` si ya hay sesión activa.
- **home**: Página principal de la aplicación (Ruta protegida).
- **reservar**: Vista para buscar y reservar salas (Ruta protegida).
- **admin**: Panel de administración para gestión de salas y reservas (Ruta protegida).
- **/**: Ruta raíz que redirige automáticamente a `/home`.

Además, se configuró una ruta que actua como un else (`*`), pues captura cualquier URL no definida y redirige al usuario a la página principal, de esta forma, el usuario nunca es dirigido a una página de error 404.

#### 4.2 Consideraciones
Dicho esto, creemos que es necesario mencionar que gran parte de los ruteos presentes en el proyecto llevan implementados desde el Hito 2, sin embargo, en este hito se implementaron manejos de estado que permitieron un ruteo más profundo entre las rutas. Por ejemplo, aprovechando la incorporación de un manejo de estado para el usuario, se mejoro la redirección hacia la ruta #strong[/]*reservar*, lo que habilitó redirecciones especificas a cualquiera de los dos tabs presentes en dicha ruta ("Reservar sala y "Mis reservas").


### Pruebas E2E
Para asegurar la calidad y el correcto funcionamiento de los flujos críticos de la aplicación, se implementaron pruebas de extremo a extremo (e2e) utilizando Playwright. Estas pruebas simulan la interacción de un usuario real con la aplicación en navegadores especificos, verificando que los procesos y flujos funcionen como se espera.

Los tests se encuentran en el directorio `e2e-tests` y se enfocan principalmente en dos (?) procesos de la aplicación:
- Los flujos de autenticación, cuyas pruebas están en `e2e-tests/tests/auth.spec.ts`
- ... en `...` (lo tiene que hacer el benja)

A continuación se detallan las pruebas que ejecutan cada uno de estos archivos:

#### `e2e-tests/tests/auth.spec.ts`

##### Login
- **Flujo exitoso**: Se verifica que un usuario registrado pueda iniciar sesión correctamente, siendo redirigido a la página de inicio y visualizando su sesión activa.
- **Credenciales incorrectas**: Se valida que el sistema muestre un mensaje de error adecuado cuando se ingresan correos o contraseñas inválidas.
- **Validación de campos**: Se comprueba que el botón de "Ingresar" permanezca deshabilitado si los campos obligatorios están vacíos, lo que implica que no se puede enviar el formulario de inicio de sesión si no están llenos todos los campos obligatorios.
- **Navegación**: Se testea el enlace para redirigir a la página de registro.

##### Registro
- **Creación de cuenta**: Se simula el registro de un usuario nuevo con RUT, nombre, apellido, correo y contraseña, verificando la redirección exitosa y la visualización del ID de usuario generado.
- **Validación de contraseñas**: Se asegura que el sistema detecte y notifique si la contraseña y su confirmación no coinciden.
- **Campos obligatorios**: Se verifica que no se pueda enviar el formulario si falta algún dato requerido.

Para garantizar la independencia y correctitud de las pruebas, se utiliza un `beforeEach` que resetea el estado de la base de datos de prueba antes de cada ejecución.

#### `e2e-tests/tests/...`

##### ...

##### ...


### Diseño y Estilo
El diseño de la interfaz de usuario se construyó con la intención de lograr una estética moderna, limpia y responsiva. Para ello, se utilizó una combinación de Tailwind CSS para utilidades de estilo y HeroUI para componentes de interfaz preconstruidos.

#### Uso de HeroUI y Tailwind CSS
Para facilitar la implementación de componentes interactivos como botones, inputs, modales, tarjetas, spinners, entre otros; se utilizó HeroUI, que es una librería de componentes creados con Tailwind CSS. De esta forma, fue posible personalizar facilmente el aspecto visual de los componentes según las necesidades del proyecto.

#### Estilos Personalizados en App.css
Se definieron estilos globales y específicos en `App.css` para lograr los efectos visuales deseados.

- Se implementaron efectos de desenfoque y transparencia en componentes clave como el `home-hero` y las tarjetas de información (`home-card`).
- Se utilizaron gradientes radiales y lineales suaves para el fondo de la aplicación (`home-shell`), evitando así interfaces con colores planos.
- Se añadieron transiciones suaves (`transition`) para interacciones de hover en las tarjetas de salas, mejorando la respuesta visual ante las acciones del usuario.

#### Modo Oscuro
La aplicación soporta modo oscuro. Mediante el uso de variables CSS y modificadores de Tailwind (`dark:`), todos los componentes y colores de fondo se adaptan automáticamente. Por ejemplo, los fondos blancos (`bg-content1`) cambian a tonos oscuros de azul/gris, y los textos se ajustan para mantener un contraste óptimo y reducir la fatiga visual.

#### Consideraciones
Cabe mencionar que la mayoría de estas implementaciones de diseño estuvieron asentadas desde el Hito 1, sin embargo, en este tercer Hito se corrigieron algunas inconsistencias. Por ejemplo, se rediseñó la página de inicio mediante la incorporación de grids y cards para que tuviera un aspecto visual más consistente con el del resto de la aplicación web.


### Despliegue en producción

...



### Siguientes hitos.

#### Mockups de las vistas no desarrolladas

Para el próximo hito, además de enfocarnos en pulir y optimizar lo implementado en los hitos anteriores, planeamos implementar las siguientes vistas:

1. **Vista de perfil de usuario:**
Esta vista permitirá a los usuarios visualizar y editar su información personal, incluyendo foto de perfil, datos de contacto y otros elementos por definir. Además, los usuarios podrán consultar su historial de reservas, con detalles sobre el estado de cada una, facilitando el seguimiento de sus actividades dentro de la plataforma.
...

2. *Vista de estadísticas para el usuario administrador:*
Esta vista permitirá al administrador visualizar gráficos y estadísticas relacionados con las distintas reservas. Entre los posibles datos a mostrar se incluyen reservas pendientes, días con mayor cantidad de reservas, bloques horarios más utilizados y salas más reservadas. Los tipos de gráficos y la información exacta que se presentará se definirán y discutirán en el siguiente hito, por lo que los mostrados en el siguiente mockup son temporales.
...


### Link al repositorio

[Link al repositorio](https://github.com/NotBenja/FiveRoomsAtDCCs.git) (https://github.com/NotBenja/FiveRoomsAtDCCs.git)