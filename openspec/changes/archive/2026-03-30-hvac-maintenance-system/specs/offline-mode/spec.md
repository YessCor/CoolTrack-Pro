## ADDED Requirements

### Requirement: Full offline functionality

The system SHALL allow technicians to perform all job functions without internet connection.

#### Scenario: View assigned jobs offline
- **WHEN** technician opens app offline
- **THEN** system displays all assigned work orders from local cache

#### Scenario: Complete work order offline
- **WHEN** technician completes work order offline
- **THEN** system saves all data locally and marks for sync

#### Scenario: Capture photos offline
- **WHEN** technician captures photo offline
- **THEN** system stores photo locally in AsyncStorage

### Requirement: Offline data persistence

The system SHALL persist all work order data locally using AsyncStorage.

#### Scenario: Persist work orders
- **WHEN** work order data is loaded or created
- **THEN** system saves complete work order data to AsyncStorage

#### Scenario: Persist photos
- **WHEN** photo is captured
- **THEN** system saves as base64 to AsyncStorage linked to work order

#### Scenario: Persist signature
- **WHEN** signature is captured
- **THEN** system saves PNG base64 to AsyncStorage linked to work order

### Requirement: Sync when online

The system SHALL automatically sync local changes to cloud when connection is restored.

#### Scenario: Auto-sync on reconnect
- **WHEN** device comes online
- **THEN** system detects connection and initiates sync of pending changes

#### Scenario: Sync status indicator
- **WHEN** viewing app online status
- **THEN** system shows sync status: "Sincronizado", "Pendiente", "Sincronizando..."

#### Scenario: Manual sync trigger
- **WHEN** technician taps "Sincronizar"
- **THEN** system immediately attempts to sync all pending data

### Requirement: Conflict resolution

The system SHALL resolve sync conflicts using last-write-wins strategy.

#### Scenario: Detect conflict
- **WHEN** syncing data modified both locally and remotely
- **THEN** system compares timestamps and keeps most recent version

#### Scenario: Log conflicts
- **WHEN** conflict is resolved
- **THEN** system logs conflict details for admin review if needed
