## ADDED Requirements

### Requirement: Work order creation

The system SHALL allow creation of work orders with type (preventivo, correctivo), priority, equipment link, description, and assigned technician.

#### Scenario: Create preventive work order
- **WHEN** admin creates work order with preventive type
- **THEN** system sets status to pending, records creation timestamp, and assigns to selected technician

#### Scenario: Create corrective work order
- **WHEN** admin creates work order with corrective type
- **THEN** system sets priority to high and notifies assigned technician

#### Scenario: Link to equipment
- **WHEN** creating work order
- **THEN** system requires equipment selection and validates equipment exists

### Requirement: Work order state machine

The system SHALL enforce work order state transitions: pending → in_progress → completed, with cancelled as terminal state.

#### Scenario: Technician accepts work order
- **WHEN** technician taps "Iniciar Trabajo" on assigned work order
- **THEN** system transitions state to in_progress, records start timestamp, and captures GPS location

#### Scenario: Complete work order
- **WHEN** technician taps "Completar Trabajo" with required fields (photos, signature, parts)
- **THEN** system transitions to completed, records end timestamp, and creates maintenance log

#### Scenario: Cancel work order
- **WHEN** admin cancels work order with reason
- **THEN** system transitions to cancelled and records cancellation reason and timestamp

### Requirement: Work order assignment

The system SHALL allow administrators to assign work orders to technicians.

#### Scenario: Assign work order
- **WHEN** admin assigns work order to technician
- **THEN** system validates technician is active and updates assignment

#### Scenario: Reassign work order
- **WHEN** admin reassigns in-progress work order
- **THEN** system records reassignment with reason and notifies new technician

### Requirement: Work order filtering and search

The system SHALL allow filtering work orders by status, priority, type, date range, and technician.

#### Scenario: Filter by status
- **WHEN** admin selects status filter
- **THEN** system displays only work orders with selected status

#### Scenario: Search by equipment or client
- **WHEN** admin enters search term
- **THEN** system returns work orders matching equipment name or client name
