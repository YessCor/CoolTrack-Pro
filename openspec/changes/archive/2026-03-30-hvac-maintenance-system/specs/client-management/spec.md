## ADDED Requirements

### Requirement: Client CRUD operations

The system SHALL allow administrators to create, read, update, and delete client records.

#### Scenario: Create new client
- **WHEN** admin fills client form (name, contact name, email, phone, address, notes) and saves
- **THEN** system creates client with unique ID and returns confirmation

#### Scenario: View client list
- **WHEN** admin opens clients tab
- **THEN** system displays paginated list of clients sorted by name with search functionality

#### Scenario: View client details
- **WHEN** admin selects a client
- **THEN** system displays client info with list of associated equipment and recent work orders

#### Scenario: Update client
- **WHEN** admin modifies client fields and saves
- **THEN** system updates record with timestamp and syncs to cloud

#### Scenario: Delete client
- **WHEN** admin deletes a client
- **THEN** system soft-deletes client (sets inactive flag) but retains all associated equipment and history

### Requirement: Client contact management

The system SHALL store primary contact information for each client including name, email, phone, and alternate phone.

#### Scenario: Store multiple contacts
- **WHEN** client has multiple contacts
- **THEN** system stores primary contact and allows adding secondary contacts

### Requirement: Client address tracking

The system SHALL store client service address with geocoordinates for dispatch.

#### Scenario: Store address with coordinates
- **WHEN** admin saves client address
- **THEN** system geocodes address and stores latitude/longitude for map display
