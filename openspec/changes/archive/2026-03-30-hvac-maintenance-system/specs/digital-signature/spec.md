## ADDED Requirements

### Requirement: Capture digital signature

The system SHALL capture customer signature as approval of completed work.

#### Scenario: Open signature pad
- **WHEN** technician taps "Firma del Cliente" button
- **THEN** system displays full-screen signature canvas

#### Scenario: Save signature
- **WHEN** customer signs and technician confirms
- **THEN** system saves signature as PNG base64 linked to work order

#### Scenario: Clear and re-sign
- **WHEN** technician or customer requests new signature
- **THEN** system clears canvas and allows re-signing

### Requirement: Signature required for completion

The system SHALL require valid signature before allowing work order completion.

#### Scenario: Block completion without signature
- **WHEN** technician tries to complete work order without signature
- **THEN** system displays error requiring customer signature

#### Scenario: Store signature timestamp
- **WHEN** signature is captured
- **THEN** system records signature timestamp and signer name (if entered)

### Requirement: Signature display

The system SHALL display captured signature on work order completion screen and in reports.

#### Scenario: Display on completion
- **WHEN** technician views completed work order
- **THEN** system shows signature image with timestamp

#### Scenario: Include in history
- **WHEN** viewing maintenance history
- **THEN** system displays signature thumbnail that can be enlarged
