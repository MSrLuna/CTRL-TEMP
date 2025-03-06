# Proyecto CTRL-TEMP

## Descripción
CTRL-TEMP es un sistema de monitoreo de temperatura para refrigeradores en Rhenania. Permite registrar y visualizar las temperaturas de los equipos, así como configurar niveles de peligro y gestionar usuarios.

## Estructura del Proyecto
El proyecto está organizado de la siguiente manera:

- `/src/pages`: Contiene las páginas del frontend.
  - `index.astro`: Página de inicio.
  - `login.astro`: Página de inicio de sesión.
  - `views/refrigeradores.astro`: Página para ver los equipos registrados.
  - `views/refrigerador.astro`: Página para ver los registros de temperatura de un equipo específico.
  - `admin/configuracion.astro`: Página de configuración y ajustes.
  - `admin/wifi.astro`: Página para configurar los datos de WiFi.
  - `admin/usuarios.astro`: Página para gestionar usuarios.
  - `admin/temperaturas.astro`: Página para configurar los niveles de peligro de temperatura.
- `/src/scripts`: Contiene los scripts de JavaScript.
  - `index.js`: Script para la página de inicio.
  - `auth.js`: Script para la autenticación.
  - `refrigeradores.js`: Script para la página de equipos registrados.
  - `refrigerador.js`: Script para la página de registros de temperatura.
  - `config/wifi.js`: Script para la configuración de WiFi.
  - `config/usuarios.js`: Script para la gestión de usuarios.
  - `config/modificaciones.js`: Script para la configuración de niveles de peligro.
- `/src/styles`: Contiene los estilos CSS.
  - `style.css`: Estilos globales.
  - `index.css`: Estilos para la página de inicio.
  - `temperaturas.css`: Estilos para la página de configuración de niveles de peligro.
- `/backend`: Contiene el servidor backend.
  - `server.js`: Servidor Express para manejar las API y WebSocket.

## Instalación
1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd CTRL-TEMP
   ```

2. Instala las dependencias del backend:
   ```bash
   cd backend
   npm install
   ```

3. Configura la base de datos MySQL:
   - Crea una base de datos llamada `pasteleria_rhenania`.
   - Ajusta la configuración de conexión en `server.js` según tu entorno.

4. Inicia el servidor backend:
   ```bash
   node server.js
   ```

5. Abre el proyecto en tu navegador:
   - Navega a `http://localhost:3000` para ver la aplicación en funcionamiento.

## Uso
- **Inicio de Sesión**: Navega a `/login` para iniciar sesión.
- **Ver Equipos Registrados**: Navega a `/views/refrigeradores` para ver los equipos registrados.
- **Ver Registros de Temperatura**: Haz clic en un equipo para ver sus registros de temperatura.
- **Configuración y Ajustes**: Navega a `/admin/configuracion` para acceder a las opciones de configuración.

## API
- **Obtener refrigeradores**: `GET /api/refrigeradores`
- **Insertar datos de temperatura**: `POST /api/refrigerador/datos`
- **Obtener datos de temperatura de un refrigerador**: `GET /api/refrigerador/:id/datos`
- **Actualizar nombre del equipo**: `PUT /api/updateEquipo/:id`
- **Autenticar usuario**: `POST /api/auth`
- **Obtener todos los usuarios**: `GET /api/usuarios`
- **Obtener un usuario por ID**: `GET /api/usuarios/:id`
- **Obtener configuración del dispositivo**: `GET /api/configuracion/:uid`
- **Guardar configuración del WiFi**: `POST /api/guardarWifi`
- **Actualizar niveles de peligro**: `POST /api/temperaturas`

## Contribución
Si deseas contribuir a este proyecto, por favor sigue los siguientes pasos:
1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva funcionalidad'`).
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

### Licencia MIT
La Licencia MIT es una licencia de software permisiva que es simple y concisa. Permite a los desarrolladores usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del software. A continuación se muestra un resumen de la licencia:

- **Permisos**: Uso comercial, modificación, distribución, uso privado.
- **Condiciones**: Incluir el aviso de copyright y la licencia en todas las copias o partes sustanciales del software.
- **Limitaciones**: No hay garantías, el software se proporciona "tal cual".

Para más información, consulta el archivo `LICENSE` en el repositorio.
