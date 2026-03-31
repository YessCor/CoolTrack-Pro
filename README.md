# CoolTrack Pro - Sistema de Gestión de Servicios HVAC

Aplicación móvil profesional para gestión integral de órdenes de servicio, cotizaciones y seguimiento en tiempo real de técnicos de aire acondicionado.

## Características

### Portal Cliente
- Dashboard con historial de órdenes
- Crear nuevas solicitudes de servicio
- Ver detalles de órdenes y cotizaciones
- Seguimiento en tiempo real del técnico
- Calificar servicios completados

### Aplicación Técnico
- Dashboard diario con órdenes asignadas
- Compartir ubicación GPS en tiempo real
- Crear cotizaciones en campo
- Subir fotos antes/durante/después
- Firmar digitalmente servicios completados
- Reportes de trabajo

### Panel Administrativo
- Dashboard KPIs con métricas clave
- Mapa en tiempo real de técnicos
- Gestión completa de órdenes
- Administración de equipos por cliente
- Administración de técnicos y clientes
- Catálogo de servicios
- Gestión de cotizaciones
- Reportes detallados

## Stack Tecnológico

- **Framework**: Expo Router (React Native)
- **UI**: React Native + NativeWind (Tailwind)
- **Base de Datos**: Neon PostgreSQL
- **Autenticación**: NextAuth v5
- **API**: Neon SQL con serverless queries
- **Navegación**: Expo Router (file-based routing)

## Estructura del Proyecto

```
├── app/                      # Expo Router (file-based routing)
│   ├── (admin)/              # Grupo de rutas admin
│   │   ├── client/           # Gestión de clientes
│   │   └── equipment/        # Gestión de equipos
│   ├── (auth)/              # Grupo de rutas auth
│   ├── (client)/            # Grupo de rutas cliente
│   │   ├── quote/            # Cotizaciones
│   │   └── service/          # Órdenes de servicio
│   ├── (technician)/         # Grupo de rutas técnico
│   │   └── job/              # Trabajos asignados
│   └── api/                  # Rutas API
├── components/               # Componentes reutilizables
│   └── ui/                   # Componentes UI base
├── context/                  # React Context (Auth, etc.)
├── lib/                      # Utilidades y configuración
│   ├── db.ts                 # Cliente Neon
│   ├── models/               # Modelos de datos
│   ├── repositories/         # Repositorios de datos
│   └── services/             # Servicios de negocio
├── constants/                # Constantes de la app
└── assets/                   # Recursos estáticos
```

## Requisitos Previos

1. **Node.js** 18+ 
2. **Neon PostgreSQL** - Base de datos configurada
3. **NEXTAUTH_SECRET** - Variable de entorno para NextAuth

## Instalación y Configuración

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Variables de Entorno

Crea un archivo `.env` con las siguientes variables:

```env
# Base de Datos
DATABASE_URL=postgresql://user:password@neon.postgres.verket-storage.com/dbname

# NextAuth
NEXTAUTH_SECRET=tu-secreto-aleatorio-aqui
NEXTAUTH_URL=http://localhost:3000

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu-api-key-aqui
```

### 3. Ejecutar Desarrollo

```bash
npx expo start
```

Usa `npx expo start --web` para desarrollo web, o un emulador para desarrollo móvil.

## Cuentas de Demostración

La base de datos incluye tres cuentas de prueba:

### Admin
- **Email**: `admin@cooltrack.com`
- **Contraseña**: `password`
- **Acceso**: Panel administrativo completo

### Técnico
- **Email**: `tecnico1@cooltrack.com` (o `tecnico2@cooltrack.com`)
- **Contraseña**: `password`
- **Acceso**: Dashboard técnico con órdenes del día

### Cliente
- **Email**: `cliente1@example.com` (o `cliente2@example.com`)
- **Contraseña**: `password`
- **Acceso**: Portal de cliente para crear órdenes

## API Endpoints

### Admin
- `GET /api/admin/clients` - Listar clientes
- `GET/POST/PUT/DELETE /api/admin/equipment` - CRUD equipos
- `GET /api/admin/dashboard` - Métricas del dashboard
- `GET /api/admin/stats` - Estadísticas

### Órdenes
- `GET /api/orders` - Listar órdenes
- `POST /api/orders` - Crear orden
- `GET/PUT /api/orders/[id]` - Ver/Actualizar orden

### Equipos
- `GET /api/equipment` - Listar equipos
- `POST /api/equipment` - Crear equipo

### Técnicos
- `POST /api/technicians/locations` - Actualizar ubicación
- `GET /api/technicians/locations` - Ver ubicaciones

## Seguridad

- Autenticación con NextAuth + Credentials Provider
- Middleware de protección de rutas basado en roles
- Contraseñas hasheadas con bcryptjs
- CSRF protection incluido

## Base de Datos

### Tablas Principales
- **users** - Clientes, técnicos, administradores
- **service_orders** - Órdenes de servicio
- **equipment** - Equipos registrados de clientes
- **quotes** - Cotizaciones
- **service_catalog** - Catálogo de servicios
- **technician_locations** - Ubicación en tiempo real
- **order_photos** - Fotos de órdenes
- **notifications** - Sistema de notificaciones
- **maintenance_logs** - Historial de mantenimiento

## Troubleshooting

### Base de datos no conecta
Verifica DATABASE_URL en .env

### NextAuth error
```bash
# Genera nuevo NEXTAUTH_SECRET
openssl rand -base64 32
```

### Problemas de sesión
- Limpia cookies del navegador
- Verifica NEXTAUTH_URL
- Comprueba que session callbacks estén correctos

## Licencia

Proyecto CoolTrack Pro - Todos los derechos reservados.

---

**Versión**: 2.0.0
**Última actualización**: Marzo 2026
**Framework**: Expo Router + React Native
