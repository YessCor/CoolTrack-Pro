## Why

CoolTrack necesita digitalizar la gestión de servicios de climatización para eliminar el uso de hojas de cálculo y papel. El objetivo es dar a los técnicos una herramienta móvil que funcione offline para reportar mantenimientos, y proporcionar al administrador un dashboard con KPIs, gestión de clientes, cotizaciones automáticas y geolocalización.

## What Changes

- **Tecnicos**: Ver órdenes asignadas, reportar preventivo/correctivo, subir fotos evidencia, registrar repuestos, trabajar offline, capturar firma digital del cliente
- **Administrador**: CRUD clientes, CRUD equipos, hoja de vida equipo, asignar técnicos, generar cotizaciones automáticas, dashboard KPIs
- **Cotizaciones**: Cálculo por tipo equipo + mano obra + repuestos, envío por correo automático
- **Geolocalización**: Tracking en tiempo real del técnico, registro ubicación inicio/fin servicio

## Capabilities

### New Capabilities

- `client-management`: CRUD de clientes con contacto, dirección y equipos asociados
- `equipment-registry`: Registro y gestión de equipos de climatización por cliente
- `work-order-management`: Crear, asignar y trackear órdenes de trabajo con ciclo de vida completo
- `technician-job-view`: Vista del técnico con órdenes asignadas y capacidad de reportar mantenimiento
- `photo-evidence`: Captura y almacenamiento de fotos como evidencia de trabajo
- `parts-registration`: Registro de repuestos utilizados por trabajo
- `digital-signature`: Captura de firma digital del cliente para aprobación
- `quote-generation`: Generación automática de cotizaciones basadas en tipo equipo, mano de obra y repuestos
- `quote-email`: Envío automático de cotizaciones por correo electrónico
- `maintenance-history`: Hoja de vida del equipo con historial completo de mantenimientos
- `quote-dashboard`: Dashboard KPIs para administrador (servicios, técnicos activos, ingresos)
- `geolocation-tracking`: Registro de ubicación GPS al iniciar y finalizar servicio
- `real-time-tracking`: Seguimiento en tiempo real de la ubicación del técnico
- `offline-mode`: Funcionamiento completo sin conexión a internet

### Modified Capabilities

- Ninguno por ahora

## Impact

- Nuevas pantallas en `app/(admin)`: clients, equipment (por cliente), quote-calculator
- Nuevas pantallas en `app/(technician)`: job/[id] actualizado con foto, firma, repuestos
- Nuevos componentes: SignatureCanvas, PhotoCapture, GeolocationTracker
- Servicios: OfflineSync, QuoteCalculator, EmailService
- Modelos: Client, PhotoEvidence, DigitalSignature, Quote
