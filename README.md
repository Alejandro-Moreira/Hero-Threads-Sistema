# Hero Threads - Superhero T-Shirt Shop

Una aplicación web para una tienda de camisetas de superhéroes con frontend en React y backend en Node.js.

## Estructura del Proyecto

```
Hero-Threads/
├── backend/          # Servidor Node.js con Express y MongoDB
│   ├── src/
│   │   ├── controllers/    # Controladores de la API
│   │   ├── models/         # Modelos de MongoDB
│   │   ├── routers/        # Rutas de la API
│   │   ├── database.js     # Configuración de MongoDB
│   │   ├── index.js        # Punto de entrada del servidor
│   │   ├── server.js       # Configuración de Express
│   │   ├── seed.js         # Script para poblar la base de datos
│   │   └── seed_ventas.js  # Script para poblar datos de ventas
│   └── package.json
└── frontend/         # Aplicación React
    ├── index.html    # Página principal
    └── Icono2.png    # Icono de la aplicación
```

## Características

- **Frontend**: React con TailwindCSS para una interfaz moderna y responsive
- **Backend**: Node.js con Express y MongoDB
- **Autenticación**: Sistema de login con roles (admin/cliente)
- **Gestión de Productos**: CRUD completo para administradores
- **Carrito de Compras**: Funcionalidad completa para clientes
- **Pagos**: Simulación de métodos de pago (tarjeta/transferencia)
- **Reportes y Análisis**: Sistema completo de reportes de ventas y análisis de plataforma

## Instalación y Configuración

### Prerrequisitos

- Node.js (versión 14 o superior)
- MongoDB instalado y ejecutándose

### Backend

1. Navega al directorio del backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno (crea un archivo `.env`):
```env
port=3000
MONGODB_URI=mongodb://localhost:27017/hero-threads
```

4. Ejecuta la migración para establecer restricciones únicas:
```bash
npm run migrate
```

5. Pobla la base de datos con productos por defecto:
```bash
npm run seed
```

6. Pobla la base de datos con datos de ventas de ejemplo:
```bash
npm run seed:ventas
```

7. Inicia el servidor:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

### Frontend

1. Abre el archivo `frontend/index.html` en tu navegador
2. O si tienes un servidor local, puedes servir el directorio frontend

## Uso

### Credenciales de Acceso

**Administrador:**
- Email: `admin@admin.com`
- Contraseña: `admin123`

**Cliente:**
- Email: `cliente@cliente.com`
- Contraseña: `cliente123`

### Funcionalidades

#### Para Clientes:
- Explorar productos
- Agregar productos al carrito
- Gestionar cantidades en el carrito
- Procesar pagos (simulado)

#### Para Administradores:
- Todas las funcionalidades de clientes
- Panel de administración de productos
- Crear, editar y eliminar productos
- Validación de nombres únicos para productos
- **Reportes y Análisis**:
  - Información de ventas (datos de ventas, ingresos, productos más vendidos)
  - Análisis general de la plataforma (gráficos y análisis del rendimiento de la tienda)

## API Endpoints

### Autenticación
- `POST /api/login` - Iniciar sesión

### Productos
- `GET /api/productos` - Obtener todos los productos
- `POST /api/productos` - Crear un nuevo producto
- `PUT /api/productos/:id` - Actualizar un producto
- `DELETE /api/productos/:id` - Eliminar un producto

### Reportes y Análisis
- `GET /api/reportes/ventas` - Obtener información de ventas
- `GET /api/reportes/analisis` - Obtener análisis general de la plataforma
- `GET /api/reportes/ventas/todas` - Obtener todas las ventas
- `POST /api/reportes/ventas` - Crear una nueva venta (simulación)

## Tecnologías Utilizadas

- **Frontend**: React, TailwindCSS, Babel
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Autenticación**: Sistema personalizado con roles
- **Base de Datos**: MongoDB
- **Reportes**: Agregaciones de MongoDB para análisis de datos

## Desarrollo

Para desarrollo, puedes usar:
```bash
# Backend en modo desarrollo
npm run dev

# Frontend - simplemente abre index.html en el navegador
```

## Notas

- La aplicación está configurada para funcionar con MongoDB local
- Los pagos son simulados para propósitos de demostración
- Las imágenes de productos están alojadas externamente
- El sistema de autenticación usa credenciales hardcodeadas para demostración
- Los reportes incluyen datos de ventas simulados para demostrar la funcionalidad # Hero-Threads-Sistema
