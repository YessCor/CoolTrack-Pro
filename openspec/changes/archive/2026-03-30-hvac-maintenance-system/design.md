## Context

CoolTrack es una app Expo/React Native existente con tabs para admin (Dashboard, Órdenes, Cotizaciones, Staff, Clientes) y tabs para técnico. La app usa expo-router, AsyncStorage para persistencia local, y Zod para validación.

## Goals / Non-Goals

**Goals:**
- Permitir a técnicos reportar mantenimiento preventivo y correctivo desde el móvil
- Subir fotos como evidencia de trabajo realizado
- Registrar repuestos utilizados en cada trabajo
- Capturar firma digital del cliente como aprobación
- Trabajar 100% offline y sincronizar cuando hay conexión
- CRUD completo de clientes para administrador
- CRUD de equipos de climatización por cliente
- Ver hoja de vida (historial) de cada equipo
- Generar cotizaciones automáticas basadas en tipo equipo + mano obra + repuestos
- Enviar cotizaciones por correo electrónico automáticamente
- Dashboard con KPIs: servicios realizados, técnicos activos, ingresos
- Registrar ubicación GPS al iniciar y finalizar servicio
- Tracking en tiempo real de ubicación del técnico

**Non-Goals:**
- Integración con sistemas de billing/facturación (fase futura)
- Notificaciones push (fase futura)
- Chat entre técnico y cliente
- Inventario de repuestos

## Decisions

### 1. Arquitectura Offline-First

**Decision**: Persistencia local con AsyncStorage, sync bidireccional con Neon cuando hay conexión.

**Rationale**: Técnicos trabajan en zonas sin cobertura. La app debe funcionar completamente offline y sincronizar automáticamente cuando detecte conexión.

**Sync Strategy**:
- SyncOnMount: al abrir app
- SyncOnConnect: cuando detecta red disponible
- SyncOnDemand: botón manual de sincronizar
- Conflict resolution: last-write-wins con logging

### 2. Almacenamiento de fotos

**Decision**: Fotos se almacenan como base64 en AsyncStorage localmente, se suben a cloud storage (URL pública) al sincronizar.

**Rationale**: Evita pérdida de datos si técnico cierra app antes de sincronizar. Base64 permite persistir inmediatamente.

**Alternatives**:
- Solo URL remota: Riesgo de pérdida si no hay sync
- FileSystem expo: Más complejo, requiere limpieza manual

### 3. Firma digital

**Decision**: Canvas táctil usando react-native-skia o expo-signature-canvas, se guarda como PNG base64.

**Rationale**: Permite captura directa en pantalla táctil. Se almacena localmente igual que fotos.

### 4. Cálculo de cotizaciones

**Decision**: Fórmula: `Total = (TarifaBasePorTipoEquipo * MultiplicadorCapacidad) + (HorasTrabajo * TarifaHora) + Sum(Repuestos)`

**Tablas de tarifas**:
- Tarifa base por tipo (split, ventana, central, chillers)
- Multiplicador por BTU (pequeño <12000, mediano 12000-24000, grande >24000)
- Tarifa hora labor

### 5. Geolocalización

**Decision**: Usar expo-location con foreground location permission. Captura ubicación al iniciar trabajo y al completar. Background tracking solo con consentimiento explícito.

**Storage**: Coordinates + timestamp en registro de trabajo.

### 6. Tracking en tiempo real

**Decision**: WebSocket connection cuando admin está viendo mapa. Técnico envía ubicación cada 30 segundos cuando está en servicio.

**Fallback**: Si no hay WebSocket, guardar ubicación cada 30 seg en cola local para sync posterior.

## Risks / Trade-offs

- **Fotos grandes** → Mitigation: Comprimir a 80% JPEG antes de guardar, limitar a 5MB por foto
- **Base64 inflate AsyncStorage** → Mitigation: Limpiar fotos ya sincronizadas del storage local
- **GPS battery drain** → Mitigation: Solo tracking activo cuando trabajo está "in_progress"
- **Email delivery failures** → Mitigation: Cola de emails con reintento automático

## Open Questions

1. ¿Cuál es el límite de fotos por trabajo? (Propuesta: 10)
2. ¿Se requiere factura PDF o solo email con detalles?
3. ¿Los KPIs son en tiempo real o refresh manual?
