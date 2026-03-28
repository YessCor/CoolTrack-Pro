# CoolTrack Pro - Sistema de Gestión de Servicios HVAC

Plataforma profesional web para gestión integral de órdenes de servicio, cotizaciones y seguimiento en tiempo real de técnicos de aire acondicionado.

## 🎯 Características

### Cliente Portal
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
- Administración de técnicos y clientes
- Catálogo de servicios
- Generación de reportes

## 🛠 Stack Tecnológico

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Base de Datos**: Neon PostgreSQL
- **Autenticación**: NextAuth v5
- **API**: Neon SQL con serverless queries

## 📋 Requisitos Previos

1. **Neon PostgreSQL** - Base de datos configurada (ya existe en el proyecto)
2. **Google Maps API Key** - Para mapas en tiempo real
3. **NEXTAUTH_SECRET** - Variable de entorno para NextAuth

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias
```bash
npm install
# o
pnpm install
```

### 2. Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# Base de Datos (ya configurada)
DATABASE_URL=postgresql://user:password@neon.postgres.vercel-storage.com/dbname

# NextAuth
NEXTAUTH_SECRET=tu-secreto-aleatorio-aqui
NEXTAUTH_URL=http://localhost:3000

# Google Maps (opcional para desarrollo)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu-api-key-aqui
```

### 3. Ejecutar Desarrollo

```bash
npm run dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 👤 Cuentas de Demostración

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

## 📁 Estructura del Proyecto

```
├── app/
│   ├── api/                  # Rutas API (NextAuth, órdenes, ubicación, etc)
│   ├── auth/                 # Páginas de autenticación
│   ├── admin/                # Panel administrativo
│   ├── technician/           # Aplicación técnico
│   ├── client/               # Portal cliente
│   ├── layout.tsx            # Layout raíz
│   ├── page.tsx              # Página raíz (redirect)
│   └── globals.css           # Estilos globales
├── components/
│   ├── header.tsx            # Header con navegación
│   ├── status-badge.tsx      # Badge de estado
│   ├── priority-badge.tsx    # Badge de prioridad
│   ├── timeline.tsx          # Línea de tiempo
│   ├── photo-gallery.tsx     # Galería de fotos
│   ├── notification-badge.tsx # Notificaciones
│   ├── map-view.tsx          # Vista de mapa
│   └── ui/                   # Componentes shadcn/ui
├── lib/
│   ├── db.ts                 # Cliente Neon
│   ├── types.ts              # Tipos TypeScript
│   ├── auth-config.ts        # Configuración NextAuth
│   └── auth.ts               # Exporta NextAuth
├── middleware.ts             # Middleware de autenticación
└── tailwind.config.ts        # Configuración Tailwind
```

## 🔐 Seguridad

- Autenticación con NextAuth + Credentials Provider
- Middleware de protección de rutas basado en roles
- Contraseñas hasheadas con bcryptjs
- Session management seguro
- CSRF protection incluido

## 📱 Responsive Design

La aplicación está optimizada para:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 480px) - Especialmente para técnicos en campo

## 🗺️ Mapas y GPS

### Google Maps
Implementado para:
- Mapa de ubicación de técnicos en tiempo real (Admin)
- Mapa de dirección de orden
- Visualización de zona de cobertura

### Geolocalización
- Tracking automático de ubicación del técnico
- Precisión hasta ±10m
- Actualizaciones cada 10 segundos

## 📊 Base de Datos

### Tablas Principales
- **users** - Clientes, técnicos, administradores
- **service_orders** - Órdenes de servicio
- **equipment** - Equipos registrados de clientes
- **quotes** - Cotizaciones
- **service_catalog** - Catálogo de servicios
- **technician_locations** - Ubicación en tiempo real
- **order_photos** - Fotos de órdenes
- **notifications** - Sistema de notificaciones

## 🚀 Roadmap - React Native

Este proyecto está diseñado para ser fácilmente migrable a React Native:

### Arquitectura Preparada
- ✅ Hooks separados para lógica de negocio
- ✅ Componentes atómicos y reutilizables
- ✅ Design tokens centralizados
- ✅ APIs desacopladas de UI

### Próximos Pasos para React Native
1. Crear versión React Native con `expo`
2. Compartir `lib/` (types, db, auth)
3. Reemplazar componentes UI con React Native equivalentes
4. Usar `react-native-maps` en lugar de Google Maps Web
5. Usar `expo-location` para GPS

## 📝 Ejemplo de Extensión

### Agregar Nueva Funcionalidad

**1. Crear tabla en base de datos** (si es necesario)
```sql
CREATE TABLE nueva_tabla (
  id UUID PRIMARY KEY,
  -- campos...
);
```

**2. Crear tipo TypeScript**
```typescript
// lib/types.ts
export interface NuevoTipo {
  id: string;
  // propiedades...
}
```

**3. Crear API route**
```typescript
// app/api/nueva-endpoint/route.ts
export async function GET(request: NextRequest) {
  // Lógica...
}
```

**4. Crear componente UI**
```typescript
// components/nuevo-componente.tsx
export function NuevoComponente() {
  // JSX...
}
```

## 🛠️ Troubleshooting

### Base de datos no conecta
```bash
# Verifica DATABASE_URL en .env.local
echo $DATABASE_URL
```

### NextAuth error
```bash
# Genera nuevo NEXTAUTH_SECRET
openssl rand -base64 32
```

### Problemas de sesión
- Limpia cookies del navegador
- Verifica NEXTAUTH_URL
- Comprueba que session callbacks estén correctos

## 📞 Soporte

Para reportar problemas o sugerir mejoras, usa los canales habituales de soporte.

## 📄 Licencia

Proyecto CoolTrack Pro - Todos los derechos reservados.

---

**Versión**: 1.0.0  
**Última actualización**: Marzo 2026  
**Estado**: En desarrollo - Preparado para React Native
