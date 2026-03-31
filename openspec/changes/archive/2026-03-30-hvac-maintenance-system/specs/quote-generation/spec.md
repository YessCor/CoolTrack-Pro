## ADDED Requirements

### Requirement: Automatic quote generation

The system SHALL automatically generate quotes based on work order details, equipment type, labor hours, and parts.

#### Scenario: Generate quote from work order
- **WHEN** admin or technician requests quote for completed work
- **THEN** system calculates: BaseRateByType * CapacityMultiplier + (LaborHours * HourlyRate) + PartsTotal

#### Scenario: Quote calculation by equipment type
- **WHEN** calculating base rate
- **THEN** system uses tariff table:
  - Split: $50 base
  - Window: $40 base
  - Central: $80 base
  - Chiller: $150 base
  - Package: $100 base

#### Scenario: Capacity multiplier
- **WHEN** calculating rate
- **THEN** system applies multiplier:
  - Small (<12000 BTU): 1.0
  - Medium (12000-24000 BTU): 1.5
  - Large (>24000 BTU): 2.0

### Requirement: Quote line items

The system SHALL display quote with itemized line items.

#### Scenario: Display line items
- **WHEN** generating quote
- **THEN** system shows: labor (hours x rate), each part (name x qty x price), subtotals, and grand total

#### Scenario: Edit quote manually
- **WHEN** admin reviews generated quote
- **THEN** admin can adjust quantities, prices, or add discounts

### Requirement: Quote status

The system SHALL track quote status through lifecycle: draft → sent → approved → rejected.

#### Scenario: Save as draft
- **WHEN** generating quote without sending
- **THEN** system saves quote as draft status

#### Scenario: Update status on response
- **WHEN** customer approves or rejects quote
- **THEN** system updates status accordingly
