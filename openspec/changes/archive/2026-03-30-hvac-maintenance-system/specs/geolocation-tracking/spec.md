## ADDED Requirements

### Requirement: Capture start location

The system SHALL record GPS coordinates when technician starts a work order.

#### Scenario: Record start coordinates
- **WHEN** technician starts work order
- **THEN** system captures current GPS latitude, longitude, accuracy, and timestamp

#### Scenario: Location permission denied
- **WHEN** location permission is denied
- **THEN** system allows work order to proceed but logs "location unavailable"

### Requirement: Capture end location

The system SHALL record GPS coordinates when technician completes a work order.

#### Scenario: Record end coordinates
- **WHEN** technician completes work order
- **THEN** system captures GPS latitude, longitude, accuracy, and timestamp

#### Scenario: Distance calculation
- **WHEN** work order is completed
- **THEN** system calculates distance between start and end location for validation

### Requirement: Location history

The system SHALL store location records as part of work order for dispatch records.

#### Scenario: Store location data
- **WHEN** capturing start or end location
- **THEN** system stores location data linked to work order with timestamp

#### Scenario: View location in work order detail
- **WHEN** viewing completed work order
- **THEN** system displays start/end location on map if available
