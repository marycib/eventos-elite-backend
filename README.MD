# 🎯 Eventos Elite — Backend API

Sistema de gestión de eventos académicos y conferencias.  
Desarrollado con **Node.js + Express + MongoDB (Mongoose)**.

---

## 🚀 Instalación y configuración

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd eventos-elite-backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:
```env
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@cluster.mongodb.net/eventos-elite
JWT_SECRET=tu_clave_secreta
```

### 4. Iniciar el servidor
```bash
# Desarrollo
npx nodemon server.js

# Producción
node server.js
```

El servidor corre en `http://localhost:5000`

---

## 📁 Estructura del proyecto

```
eventos-elite-backend/
├── src/
│   ├── auth/
│   │   └── authController.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── asistentesController.js
│   │   ├── eventosController.js
│   │   ├── ponentesController.js
│   │   ├── sesionesController.js
│   │   └── usuariosController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── rolMiddleware.js
│   ├── models/
│   │   ├── Asistente.js
│   │   ├── Evento.js
│   │   ├── Ponente.js
│   │   ├── Sesion.js
│   │   └── Usuario.js
│   └── routes/
│       ├── asistentesRoutes.js
│       ├── authRoutes.js
│       ├── eventosRoutes.js
│       ├── ponentesRoutes.js
│       ├── sesionesRoutes.js
│       └── usuariosRoutes.js
└── server.js
```

---

## 🔐 Autenticación

El sistema usa **JWT (JSON Web Token)**. Para acceder a rutas protegidas:

1. Obtén el token haciendo login en `POST /api/auth/login`
2. En Postman: pestaña **Authorization → Bearer Token** → pega el token
3. El token expira en **8 horas**

### Roles disponibles
| Rol | Descripción |
|-----|-------------|
| `administrador` | Acceso total al sistema |
| `organizador` | Gestiona eventos, sesiones y ponentes |
| `ponente` | Rol para conferencistas |
| `asistente` | Rol por defecto al registrarse |

---

## 📌 Endpoints de la API

### 🔑 Autenticación — `/api/auth`

| Método | Ruta | Descripción | Protegido |
|--------|------|-------------|-----------|
| POST | `/api/auth/register` | Registro de nuevo usuario | No |
| POST | `/api/auth/login` | Login — devuelve token JWT | No |
| GET | `/api/auth/me` | Devuelve el usuario logueado | Sí |

---

### 👤 Usuarios — `/api/usuarios`

| Método | Ruta | Descripción | Protegido |
|--------|------|-------------|-----------|
| POST | `/api/usuarios/crear` | Crear usuario | No |
| GET | `/api/usuarios/listar` | Listar todos los usuarios | Sí — admin |
| GET | `/api/usuarios/:id` | Obtener usuario por ID | Sí |
| PUT | `/api/usuarios/:id` | Actualizar usuario | Sí — admin |
| DELETE | `/api/usuarios/:id` | Eliminar usuario | Sí — admin |

---

### 📅 Eventos — `/api/eventos`

| Método | Ruta | Descripción | Protegido |
|--------|------|-------------|-----------|
| POST | `/api/eventos/crear` | Crear evento | Sí — admin |
| GET | `/api/eventos/listar` | Listar todos los eventos | No |
| GET | `/api/eventos/disponibles` | Eventos activos con cupo ⭐ | No |
| GET | `/api/eventos/:id` | Obtener evento por ID | No |
| PUT | `/api/eventos/:id` | Actualizar evento | Sí — admin |
| DELETE | `/api/eventos/:id` | Eliminar evento | Sí — admin |
| PATCH | `/api/eventos/:id/cancelar` | Cancelar evento ⭐ | Sí — admin/organizador |
| PATCH | `/api/eventos/:id/finalizar` | Finalizar evento ⭐ | Sí — admin/organizador |
| GET | `/api/eventos/:id/asistentes` | Asistentes de un evento ⭐ | Sí — admin/organizador |

---

### 🎤 Ponentes — `/api/ponentes`

| Método | Ruta | Descripción | Protegido |
|--------|------|-------------|-----------|
| POST | `/api/ponentes/crear` | Crear ponente | Sí — admin/organizador |
| GET | `/api/ponentes` | Listar todos los ponentes | No |
| GET | `/api/ponentes/:id` | Obtener ponente por ID | No |
| PUT | `/api/ponentes/:id` | Actualizar ponente | Sí — admin/organizador |
| DELETE | `/api/ponentes/:id` | Eliminar ponente | Sí — admin |

---

### 🗓️ Sesiones — `/api/sesiones`

| Método | Ruta | Descripción | Protegido |
|--------|------|-------------|-----------|
| POST | `/api/sesiones/crear` | Crear sesión | Sí — admin/organizador |
| GET | `/api/sesiones/listar` | Listar todas las sesiones | No |
| GET | `/api/sesiones/:id` | Obtener sesión por ID | No |
| PUT | `/api/sesiones/:id` | Actualizar sesión | Sí — admin/organizador |
| DELETE | `/api/sesiones/:id` | Eliminar sesión | Sí — admin |

---

### 👥 Asistentes — `/api/asistentes`

| Método | Ruta | Descripción | Protegido |
|--------|------|-------------|-----------|
| POST | `/api/asistentes/registrar` | Registrar asistente a evento ⭐ | Sí |
| GET | `/api/asistentes` | Listar todos los asistentes | Sí — admin/organizador |
| GET | `/api/asistentes/:id` | Obtener asistente por ID | Sí |
| PUT | `/api/asistentes/:id` | Actualizar asistente | Sí — admin/organizador |
| DELETE | `/api/asistentes/:id` | Eliminar asistencia | Sí — admin |

> ⭐ Endpoints de acción del negocio

---

## 🧠 Lógica de negocio

### Registrar asistente
- Verifica que el evento **exista**
- Verifica que el evento esté en estado **activo**
- Verifica que haya **cupo disponible** (totalInscritos < capacidadMaxima)
- Si alguna validación falla, responde con error **400**

### Cancelar / Finalizar evento
- No se puede cancelar un evento ya **finalizado**
- No se puede finalizar un evento ya **cancelado**
- Cambios de estado son irreversibles

### Eventos disponibles
- Solo devuelve eventos con `estadoEvento: "activo"`
- Solo devuelve eventos con `cupoDisponible > 0`

---

## 🛠️ Tecnologías usadas

| Tecnología | Uso |
|-----------|-----|
| Node.js | Entorno de ejecución |
| Express | Framework web |
| MongoDB | Base de datos |
| Mongoose | ODM para MongoDB |
| JWT | Autenticación por tokens |
| bcryptjs | Encriptación de contraseñas |
| dotenv | Variables de entorno |
| cors | Manejo de CORS |

---

## 📋 Evidencia

**GA7-220501096-AA5-EV03** — Identificación de APIs CRUD y acciones del negocio.