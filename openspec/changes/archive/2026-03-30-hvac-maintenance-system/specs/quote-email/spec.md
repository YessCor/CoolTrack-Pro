## ADDED Requirements

### Requirement: Send quote by email

The system SHALL send quote to customer email automatically or manually.

#### Scenario: Auto-send on approval request
- **WHEN** admin marks quote as ready to send
- **THEN** system sends email to customer with quote details and PDF attachment

#### Scenario: Manual resend
- **WHEN** admin taps "Reenviar Cotización"
- **THEN** system resends email to customer email address

#### Scenario: Email delivery confirmation
- **WHEN** email is sent
- **THEN** system records sent timestamp and delivery status

### Requirement: Quote email content

The system SHALL include in email: client name, equipment details, work performed, line items, totals, validity period, and payment terms.

#### Scenario: Email template
- **WHEN** sending quote
- **THEN** email includes formatted table with all line items, subtotals, and grand total

#### Scenario: Attach PDF
- **WHEN** sending quote
- **THEN** system generates and attaches PDF with quote details

### Requirement: Email queue for offline

The system SHALL queue emails when offline and send when connection is restored.

#### Scenario: Queue email offline
- **WHEN** technician requests quote email while offline
- **THEN** system queues email in local storage with pending status

#### Scenario: Send queued emails on reconnect
- **WHEN** device comes online
- **THEN** system processes email queue and sends all pending emails
