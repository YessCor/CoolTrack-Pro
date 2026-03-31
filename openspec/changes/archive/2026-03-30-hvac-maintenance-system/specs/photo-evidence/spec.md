## ADDED Requirements

### Requirement: Photo capture

The system SHALL allow technicians to capture photos as evidence of work performed.

#### Scenario: Capture photo
- **WHEN** technician taps "Agregar Foto" button
- **THEN** system opens camera, and after capture saves photo to local storage as base64

#### Scenario: View captured photos
- **WHEN** viewing work order during or after completion
- **THEN** system displays thumbnail gallery of captured photos

#### Scenario: Delete photo
- **WHEN** technician taps delete on a photo
- **THEN** system removes photo from work order with confirmation

### Requirement: Photo storage and sync

The system SHALL store photos locally and sync to cloud storage when online.

#### Scenario: Store locally immediately
- **WHEN** photo is captured
- **THEN** system immediately saves photo as base64 in AsyncStorage linked to work order

#### Scenario: Sync when online
- **WHEN** device is online and has pending photos
- **THEN** system uploads photos to cloud storage and replaces base64 with URL

#### Scenario: Photo compression
- **WHEN** saving photo
- **THEN** system compresses to JPEG at 80% quality with max dimension 1920px

### Requirement: Photo requirements

The system SHALL require minimum photos per work order type.

#### Scenario: Enforce minimum photos for preventive
- **WHEN** technician tries to complete preventive work order
- **THEN** system requires at least 2 photos as evidence

#### Scenario: Enforce minimum photos for corrective
- **WHEN** technician tries to complete corrective work order
- **THEN** system requires at least 3 photos including problem and solution
