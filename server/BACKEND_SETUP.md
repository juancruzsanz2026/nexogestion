# 🚀 Backend - Nexo Gestión

## 📋 Descripción

Backend completo en **Node.js + Express** con:
- ✅ Autenticación JWT
- ✅ Multi-tenant (múltiples clubes por usuario)
- ✅ Sistema de invitaciones
- ✅ CRUD de clubes
- ✅ Gestión de miembros
- ✅ MongoDB como base de datos
- ✅ Envío de emails
- ✅ Validaciones completas

## 🛠️ Requisitos

- Node.js 16+
- MongoDB 4.4+
- npm o yarn

## ⚡ Instalación

### 1. Clonar y navegar
```bash
cd server
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
```

Editar `.env`:
```env
NODE_ENV=development
PORT=3000

MONGODB_URI=mongodb://localhost:27017/nexogestion

JWT_SECRET=tu-clave-secreta-muy-segura
JWT_EXPIRES_IN=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contrasena
SMTP_FROM=noreply@nexoargentina.app

FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

### 3. MongoDB

**Opción A: Local**
```bash
# MacOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Opción B: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

✅ Servidor corriendo en `http://localhost:3000`

## 📡 Endpoints

### 🔐 Autenticación

#### 1. Solicitar Activación (Primer Admin)
```
POST /api/auth/solicitar-activacion
Body: { "email": "admin@example.com" }
```

**Response:**
```json
{
  "message": "Código enviado a tu email",
  "expiresIn": "10 minutos"
}
```

#### 2. Completar Activación
```
POST /api/auth/completar-activacion
Body: {
  "email": "admin@example.com",
  "codigo": "123456",
  "nombre": "Juan",
  "apellido": "García",
  "contraseña": "SecurePass123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "usuario": {
    "id": "user-123",
    "email": "admin@example.com",
    "nombre": "Juan",
    "apellido": "García"
  },
  "clubes": [{
    "id": "club-123",
    "nombre": "Club de Juan",
    "ciudad": "Buenos Aires",
    "miembros": [...]
  }]
}
```

#### 3. Login
```
POST /api/auth/login
Body: {
  "email": "usuario@example.com",
  "contraseña": "password"
}
```

**Response:** (mismo que completar-activación)

#### 4. Validar Token
```
GET /api/auth/validar-token
Headers: { "Authorization": "Bearer <token>" }
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "user-123",
    "email": "usuario@example.com"
  }
}
```

#### 5. Logout
```
POST /api/auth/logout
Headers: { "Authorization": "Bearer <token>" }
```

---

### 📮 Invitaciones

#### 1. Crear Invitación
```
POST /api/invitaciones/crear
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "clubId": "club-123",
  "email": "nuevo@example.com",
  "rol": "editor",
  "permisos": [
    { "id": "ver_reportes", "nombre": "Ver Reportes", "descripcion": "..." }
  ]
}
```

**Response:**
```json
{
  "message": "Invitación enviada",
  "invitacion": {
    "id": "inv-123",
    "email": "nuevo@example.com",
    "rol": "editor",
    "expiresAt": "2026-07-20"
  }
}
```

#### 2. Validar Invitación
```
GET /api/invitaciones/validar/:token
```

**Response:**
```json
{
  "id": "inv-123",
  "email": "nuevo@example.com",
  "rol": "editor",
  "permisos": [...],
  "clubId": "club-123",
  "clubNombre": "Mi Club",
  "estado": "pendiente",
  "expiresAt": "2026-07-20"
}
```

#### 3. Aceptar Invitación
```
POST /api/invitaciones/aceptar
Body: {
  "token": "token-unico",
  "nombre": "Pedro",
  "apellido": "López",
  "contraseña": "SecurePass123!"
}
```

**Response:** (mismo que login)

#### 4. Rechazar Invitación
```
POST /api/invitaciones/rechazar/:token
```

**Response:**
```json
{ "message": "Invitación rechazada" }
```

#### 5. Listar Invitaciones Pendientes
```
GET /api/invitaciones/clubes/:clubId/pendientes
Headers: { "Authorization": "Bearer <token>" }
```

**Response:**
```json
[
  {
    "id": "inv-123",
    "email": "nuevo@example.com",
    "rol": "editor",
    "estado": "pendiente",
    "createdAt": "2026-06-20",
    "expiresAt": "2026-07-20"
  }
]
```

---

### 🏛️ Clubes

#### 1. Obtener Club
```
GET /api/clubes/:id
Headers: { "Authorization": "Bearer <token>" }
```

**Response:**
```json
{
  "_id": "club-123",
  "nombre": "Mi Club",
  "descripcion": "Descripción",
  "ciudad": "Buenos Aires",
  "logo": "url",
  "createdBy": {...},
  "miembros": [
    {
      "userId": {...},
      "rol": "admin",
      "permisos": [],
      "agreatedAt": "2026-06-20"
    }
  ]
}
```

#### 2. Crear Club
```
POST /api/clubes
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "nombre": "Nuevo Club",
  "descripcion": "Mi nuevo club",
  "ciudad": "Buenos Aires"
}
```

**Response:**
```json
{
  "id": "club-456",
  "nombre": "Nuevo Club",
  "ciudad": "Buenos Aires",
  "miembros": [...]
}
```

#### 3. Actualizar Club
```
PUT /api/clubes/:id
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "nombre": "Club Actualizado",
  "ciudad": "Córdoba"
}
```

#### 4. Eliminar Club
```
DELETE /api/clubes/:id
Headers: { "Authorization": "Bearer <token>" }
```

---

## 🗄️ Modelos MongoDB

### User
```typescript
{
  _id: ObjectId,
  email: String (unique),
  nombre: String,
  apellido: String,
  password: String (hashed),
  avatar: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Club
```typescript
{
  _id: ObjectId,
  nombre: String,
  descripcion: String,
  ciudad: String,
  logo: String (optional),
  createdBy: ObjectId (ref: User),
  miembros: [
    {
      userId: ObjectId (ref: User),
      rol: String (admin|editor|visor),
      permisos: String[],
      agreatedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Invitacion
```typescript
{
  _id: ObjectId,
  clubId: ObjectId (ref: Club),
  email: String,
  rol: String,
  permisos: Object[],
  token: String (unique),
  invitadoPor: ObjectId (ref: User),
  estado: String (pendiente|aceptada|rechazada|expirada),
  createdAt: Date,
  expiresAt: Date (30 días)
}
```

### ActivacionAdmin
```typescript
{
  _id: ObjectId,
  email: String,
  codigo: String,
  estado: String (pendiente|completada),
  createdAt: Date,
  expiresAt: Date (10 minutos)
}
```

## 🔐 Seguridad

✅ Contraseñas hasheadas con bcrypt (10 rounds)
✅ JWT con expiración (7 días)
✅ CORS configurado
✅ Sanitización de inputs
✅ Helmet para headers de seguridad
✅ Validación de permisos en cada endpoint
✅ Invitaciones con tokens únicos
✅ Expiración automática de registros

## 🐳 Docker (Opcional)

```bash
# Build
docker build -t nexogestion-server .

# Run
docker run -p 3000:3000 --env-file .env nexogestion-server
```

## 📊 Testing con Postman

1. **Crear colección**: Postman > File > New > Collection
2. **Agregar variables**: PORT=3000, API_URL=http://localhost:3000/api
3. **Importar endpoints** desde `docs/postman.json` (si existe)
4. **Ejecutar requests** en orden

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Verificar que MongoDB está corriendo
mongo --version
mongo
```

### "Email not sent"
```bash
# Usar contraseña de aplicación (no la principal)
# En Gmail: Settings > Security > App passwords
```

### "CORS error"
```bash
# Verificar CORS_ORIGIN en .env
# Debe ser URL del frontend (ej: http://localhost:5173)
```

## 📚 Documentación Adicional

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express Documentation](https://expressjs.com/)
- [JWT](https://jwt.io/)
- [Nodemailer](https://nodemailer.com/)

## 🚀 Deployment

### Heroku
```bash
heroku create nexogestion-api
git push heroku main
heroku config:set JWT_SECRET="..."
```

### Railway.app
```bash
railway init
railway up
```

---

**¿Necesitas ayuda? Contacta a soporte@nexoargentina.app** 📧
