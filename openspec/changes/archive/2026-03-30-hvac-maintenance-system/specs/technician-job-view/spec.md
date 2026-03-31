## ADDED Requirements

### Requirement: View assigned work orders

The system SHALL display a list of work orders assigned to the logged-in technician.

#### Scenario: View job list
- **WHEN** technician opens app
- **THEN** system displays list of assigned work orders sorted by date with status badges

#### Scenario: Filter assigned jobs
- **WHEN** technician applies filter (today, this week, all)
- **THEN** system shows filtered list of assigned work orders

#### Scenario: View job details
- **WHEN** technician selects a work order
- **THEN** system displays full job details including client info, equipment, location, and description

### Requirement: Report preventive maintenance

The system SHALL allow technician to report preventive maintenance activities.

#### Scenario: Report preventive maintenance
- **WHEN** technician completes preventive work order
- **THEN** system records maintenance type, description, photos, parts used, and signature

#### Scenario: Checklist completion
- **WHEN** reporting preventive maintenance
- **THEN** technician SHALL complete checklist items (filter check, refrigerant check, electrical check, etc.)

### Requirement: Report corrective maintenance

The system SHALL allow technician to report corrective maintenance with problem description.

#### Scenario: Report corrective maintenance
- **WHEN** technician completes corrective work order
- **THEN** system records problem diagnosed, solution applied, photos, parts used, and signature

#### Scenario: Problem description required
- **WHEN** submitting corrective maintenance report
- **THEN** system requires technician to enter problem description and solution applied

### Requirement: Start and complete job with location

The system SHALL capture GPS location when technician starts and completes a job.

#### Scenario: Capture start location
- **WHEN** technician starts work order
- **THEN** system records current GPS coordinates with timestamp

#### Scenario: Capture end location
- **WHEN** technician completes work order
- **THEN** system records GPS coordinates at completion time
