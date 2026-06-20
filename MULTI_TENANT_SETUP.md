# 🚀 Guía Completa - Sistema Multi-Tenant con Autenticación por Invitación

## 📋 Descripción General

Sistema completo de gestión de clubes con:
- ✅ Login único para todos los usuarios
- ✅ Cada usuario pertenece a múltiples clubes
- ✅ Datos únicos por usuario/club
- ✅ Registro por invitación (30 días de validez)
- ✅ Roles y permisos granulares
- ✅ Dashboard responsivo
- ✅ Chatbot de asistencia técnica

## 🏗️ Arquitectura

### Frontend (React + TypeScript)
```
src/
├── types/
│   ├── auth.ts              # Tipos de autenticación
│   └── database.ts          # Tipos de BD
├── context/
│   └── AuthContext.tsx      # Context global de auth
├── hooks/
│   └── useAuth.ts           # Hook para usar auth
├── services/
│   ├── authService.ts       # Servicios de login/activación
│   └── invitacionService.ts # Servicios de invitaciones
├── components/
│   ├── ChatbotWidget.tsx    # Widget de chat
│   ├── InvitarMiembro.tsx   # Componente para invitar
│   └── ProtectedRoute.tsx   # Rutas protegidas
├── pages/
│   ├── Login.tsx            # Página de login
│   ├── AceptarInvitacion.tsx # Página de registro
│   └── Dashboard.tsx        # Dashboard principal
└── App.tsx                  # App con rutas
```

## 🔐 Flujos de Autenticación

### 1️⃣ Primer Admin (Activación)

```
┌─────────────────────────────────────┐
│ 1. Admin ingresa email              │
│ 2. Sistema envía código por email   │
│ 3. Admin ingresa código + datos     │
│ 4. Se crea cuenta y primer club     │
│ 5. Login automático                 │
└─────────────────────────────────────┘

Endpoint: POST /api/auth/solicitar-activacion
Endpoint: POST /api/auth/completar-activacion
```

### 2️⃣ Invitar Miembros

```
┌────────────────────────────────────────┐
│ 1. Admin selecciona invitar miembro   │
│ 2. Ingresa: email + rol + permisos    │
│ 3. Sistema genera token único         │
│ 4. Envía email con link               │
│ 5. Link válido 30 días                │
└────────────────────────────────────────┘

Endpoint: POST /api/invitaciones/crear
Endpoint: GET /api/invitaciones/validar/:token
```

### 3️⃣ Nuevo Usuario (Aceptar Invitación)

```
┌─────────────────────────────────────┐
│ 1. Usuario hace clic en link        │
│ 2. Sistema valida token             │
│ 3. Usuario completa registro        │
│ 4. Se crea cuenta                   │
│ 5. Se agrega al club con rol/perms  │
│ 6. Login automático                 │
└─────────────────────────────────────┘

Endpoint: POST /api/invitaciones/aceptar
```

### 4️⃣ Login Posterior

```
┌─────────────────────────────────────┐
│ 1. Email + contraseña               │
│ 2. Sistema valida credenciales      │
│ 3. Retorna token + usuario + clubes │
│ 4. Usuario puede seleccionar club   │
│ 5. Dashboard con datos del club     │
└─────────────────────────────────────┘

Endpoint: POST /api/auth/login
```

## 📱 Páginas Creadas

### **Login.tsx**
- Email + Contraseña
- Link para aceptar invitación
- Validaciones completas
- Responsive

### **AceptarInvitacion.tsx**
- Validación de token
- Registro con datos personales
- Creación de contraseña
- Confirmación de contraseña

### **Dashboard.tsx**
- Selector de clubes
- 5 pestañas principales:
  - 📊 Inicio (Stats)
  - 👥 Miembros (Tabla + Invitar)
  - 📅 Eventos
  - 📈 Reportes
  - ⚙️ Configuración
- Totalmente responsivo
- Integración con chatbot

## 🎮 Componentes Reutilizables

### **InvitarMiembro.tsx**
```typescript
<InvitarMiembro />
```
- Formulario inline
- Email + Rol + Permisos
- Validaciones
- Mensajes de éxito/error

### **ProtectedRoute.tsx**
```typescript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```
- Ruta protegida
- Valida autenticación
- Redirecciona a login si no está autenticado

## 🔗 Rutas de la Aplicación

```
/login                  → Página de login
/invitacion/:token      → Aceptar invitación
/dashboard              → Dashboard (protegido)
/                       → Redirige a dashboard
```

## 💾 Almacenamiento Local

El AuthContext almacena en `localStorage`:

```javascript
// Token JWT
localStorage.setItem('token', token);

// Usuario actual
localStorage.setItem('usuario', JSON.stringify(usuario));

// Clubes del usuario
localStorage.setItem('clubes', JSON.stringify(clubes));
```

## 🔑 Datos de Ejemplo

### User
```typescript
{
  id: "user-123",
  email: "juan@example.com",
  nombre: "Juan",
  apellido: "García",
  avatar?: "url",
  createdAt: Date,
  updatedAt: Date
}
```

### Club
```typescript
{
  id: "club-123",
  nombre: "Club Deportivo XYZ",
  descripcion: "...",
  ciudad: "Buenos Aires",
  logo?: "url",
  createdBy: "user-123",
  miembros: [
    {
      userId: "user-456",
      nombre: "Pedro",
      email: "pedro@example.com",
      rol: "admin",
      permisos: [{id: "crear_eventos", ...}],
      agreatedAt: Date
    }
  ]
}
```

### Invitación
```typescript
{
  id: "inv-123",
  clubId: "club-123",
  email: "nuevo@example.com",
  rol: "editor",
  permisos: [{id: "ver_reportes", ...}],
  token: "unique-token-xyz",
  invitadoPor: "user-123",
  estado: "pendiente",
  createdAt: Date,
  expiresAt: Date (30 días)
}
```

## 🛠️ Backend Necesario

### Endpoints Requeridos

#### **Autenticación**
- `POST /api/auth/solicitar-activacion`
- `POST /api/auth/completar-activacion`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/validar-token`
- `POST /api/auth/refrescar-token`

#### **Invitaciones**
- `POST /api/invitaciones/crear`
- `GET /api/invitaciones/validar/:token`
- `POST /api/invitaciones/aceptar`
- `POST /api/invitaciones/rechazar/:token`
- `GET /api/clubes/:clubId/invitaciones/pendientes`
- `POST /api/invitaciones/:invitacionId/cancelar`

## 📦 Dependencias

```json
{
  "react": "^18.0",
  "react-dom": "^18.0",
  "react-router-dom": "^6.0"
}
```

**No requiere:** Redux, Apollo, Axios (usamos fetch nativo)

## 🚀 Instalación y Setup

### 1. Clonar el repo
```bash
git clone <repo>
cd nexogestion
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# .env
VITE_API_URL=http://localhost:3000/api
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

### 5. Build para producción
```bash
npm run build
```

## 🧪 Testing

### Login
```
email: test@example.com
contraseña: Test123!@
```

### Flujo completo
1. Ir a `/invitacion/token-valido`
2. Completar registro
3. Automáticamente redirige a dashboard

## 🎨 Personalización

### Cambiar colores
Busca `#667eea` y `#764ba2` en archivos CSS

### Cambiar textos
Edita strings en componentes tsx

### Cambiar roles disponibles
Modifica `src/types/auth.ts` - ClubMember.rol

## 🔒 Seguridad

✅ Tokens JWT en localStorage
✅ Validación de token en cada request
✅ Permisos granulares por usuario/club
✅ Invitaciones con expiracion de 30 días
✅ Contraseñas mínimo 8 caracteres
✅ CORS configurado en backend
✅ Rutas protegidas en frontend

## 📞 Soporte

Para preguntas o problemas:
- 📧 Email: soporte@nexoargentina.app
- 💬 Chat: Disponible en app

---

**¡Sistema listo para usar! 🎉**
