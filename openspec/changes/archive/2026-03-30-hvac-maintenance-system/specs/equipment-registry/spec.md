## ADDED Requirements

### Requirement: Equipment registration per client

The system SHALL allow registration of climatization equipment linked to a specific client.

#### Scenario: Register equipment for client
- **WHEN** admin selects client and adds equipment (brand, model, serial, type, capacity BTU, location description, install date)
- **THEN** system creates equipment with unique ID linked to client and returns confirmation

#### Scenario: View equipment by client
- **WHEN** admin views client details
- **THEN** system displays all equipment associated with that client

#### Scenario: Equipment types supported
- **WHEN** registering equipment
- **THEN** system supports types: Split, Window, Central, Chiller, Package, Other

### Requirement: Equipment specifications

The system SHALL store equipment specifications including brand, model, serial number, type, capacity (BTU), refrigerant type, power requirements, and installation location.

#### Scenario: Store capacity
- **WHEN** registering equipment with capacity rating
- **THEN** system stores capacity in BTU and calculates kW for display

#### Scenario: Capacity categorization
- **WHEN** saving equipment capacity
- **THEN** system categorizes as: small (<12000 BTU), medium (12000-24000 BTU), large (>24000 BTU)

### Requirement: Equipment maintenance history access

The system SHALL provide quick access to equipment maintenance history from the equipment detail screen.

#### Scenario: View maintenance history from equipment
- **WHEN** viewing equipment details
- **THEN** system shows summary of last 5 maintenance records with dates and work order references

#### Scenario: Access full history
- **WHEN** user taps "Ver historial completo"
- **THEN** system navigates to maintenance history screen filtered by this equipment
