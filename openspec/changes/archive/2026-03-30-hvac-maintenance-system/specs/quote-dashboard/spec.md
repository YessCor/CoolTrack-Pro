## ADDED Requirements

### Requirement: Admin dashboard KPIs

The system SHALL display dashboard with key performance indicators for administrator.

#### Scenario: View main KPIs
- **WHEN** admin opens dashboard
- **THEN** system displays:
  - Servicios realizados (este mes)
  - Técnicos activos (con trabajo en curso)
  - Ingresos (cotizaciones aprobadas este mes)
  - Órdenes pendientes
  - Órdenes en progreso

#### Scenario: KPI time range
- **WHEN** viewing dashboard
- **THEN** admin can toggle between: hoy, esta semana, este mes, este año

### Requirement: Services completed metric

The system SHALL count and display total completed work orders in selected period.

#### Scenario: Count completed services
- **WHEN** calculating services metric
- **THEN** system counts work orders with status "completed" in selected date range

#### Scenario: Breakdown by type
- **WHEN** viewing services detail
- **THEN** system shows breakdown: preventive count vs corrective count

### Requirement: Active technicians metric

The system SHALL display count and list of technicians with active work orders.

#### Scenario: Count active technicians
- **WHEN** calculating active technicians
- **THEN** system counts technicians with at least one work order in "in_progress" status

#### Scenario: List active technicians
- **WHEN** viewing technicians detail
- **THEN** system shows each active technician with current job location and start time

### Requirement: Revenue metric

The system SHALL display total revenue from approved quotes in selected period.

#### Scenario: Sum approved quotes
- **WHEN** calculating revenue
- **THEN** system sums grand total from quotes with status "approved" in date range

#### Scenario: Revenue breakdown
- **WHEN** viewing revenue detail
- **THEN** system shows breakdown by client and by service type
