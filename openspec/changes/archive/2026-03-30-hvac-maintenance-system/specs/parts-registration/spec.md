## ADDED Requirements

### Requirement: Register parts used

The system SHALL allow technicians to register parts consumed during maintenance.

#### Scenario: Add part to work order
- **WHEN** technician searches and selects part from catalog
- **THEN** system adds part with name, part number, quantity, and unit price to work order

#### Scenario: Enter custom part
- **WHEN** part is not in catalog
- **THEN** technician can enter custom part with name, quantity, and price

#### Scenario: Remove part
- **WHEN** technician removes a part from work order
- **THEN** system updates parts list and recalculates total

### Requirement: Parts catalog

The system SHALL provide a searchable catalog of common HVAC parts.

#### Scenario: Search parts catalog
- **WHEN** technician enters search term
- **THEN** system returns matching parts with names, numbers, and prices

#### Scenario: Parts by category
- **WHEN** browsing parts catalog
- **THEN** system groups parts by category (filters, coils, compressors, refrigerants, electrical, other)

### Requirement: Parts total calculation

The system SHALL calculate total parts cost for work order.

#### Scenario: Calculate parts subtotal
- **WHEN** parts list changes
- **THEN** system updates parts subtotal as Sum(quantity * unit_price)

#### Scenario: Include parts in quote
- **WHEN** generating quote from work order
- **THEN** system includes parts total in final quote calculation
