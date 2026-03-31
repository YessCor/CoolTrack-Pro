## ADDED Requirements

### Requirement: Equipment maintenance history

The system SHALL maintain complete maintenance history for each equipment.

#### Scenario: View equipment history
- **WHEN** viewing equipment details
- **THEN** system displays chronological list of all maintenance records with dates, types, technician names, and summaries

#### Scenario: Filter history by type
- **WHEN** filtering equipment history
- **THEN** system allows filtering by maintenance type (preventive, corrective)

#### Scenario: Filter history by date range
- **WHEN** filtering equipment history
- **THEN** system allows selecting custom date range

### Requirement: Maintenance record details

The system SHALL store detailed maintenance record including work performed, parts used, labor hours, photos, and signature.

#### Scenario: View maintenance detail
- **WHEN** selecting maintenance record from history
- **THEN** system displays full details: date, technician, type, description, parts list, labor hours, photos gallery, and signature

#### Scenario: Photos in history
- **WHEN** viewing maintenance history
- **THEN** system shows photo thumbnails that can be tapped to enlarge

### Requirement: Service history export

The system SHALL allow exporting equipment service history.

#### Scenario: Export history
- **WHEN** admin requests history export for equipment
- **THEN** system generates PDF with complete maintenance history for compliance
