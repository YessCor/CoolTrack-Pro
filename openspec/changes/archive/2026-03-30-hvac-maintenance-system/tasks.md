## 1. Client Management

- [x] 1.1 Create client model with Zod schema (name, contact, email, phone, address, geocoordinates)
- [x] 1.2 Add client repository with CRUD operations for AsyncStorage
- [x] 1.3 Create client list screen in app/(admin)/clients.tsx
- [x] 1.4 Create client form screen for new/edit client
- [ ] 1.5 Add client search and filter functionality

## 2. Equipment Registry

- [x] 2.1 Create equipment model linked to client (brand, model, serial, type, capacity BTU, location, install date)
- [x] 2.2 Add equipment repository with CRUD operations
- [ ] 2.3 Create equipment list screen per client in app/(admin)
- [ ] 2.4 Create equipment form screen for new/edit equipment
- [x] 2.5 Implement capacity categorization (small/medium/large)
- [ ] 2.6 Add equipment detail screen with maintenance history summary

## 3. Work Order Management

- [x] 3.1 Create work order model with state machine (pending, in_progress, completed, cancelled)
- [x] 3.2 Add work order repository with state validation
- [ ] 3.3 Update app/(admin)/orders.tsx with filtering by status, priority, type, date range
- [ ] 3.4 Add work order form for creating new orders with client/equipment selection
- [ ] 3.5 Implement technician assignment from admin
- [x] 3.6 Add state transition guards with GPS capture on start
- [ ] 3.7 Add work order detail screen with full history

## 4. Technician Job View (Mobile)

- [ ] 4.1 Update app/(technician)/index.tsx to show assigned jobs list
- [ ] 4.2 Update app/(technician)/job/[id].tsx with complete job details
- [ ] 4.3 Add preventive maintenance report form with checklist
- [ ] 4.4 Add corrective maintenance report form with problem/solution fields
- [ ] 4.5 Integrate photo capture, parts registration, and signature components
- [ ] 4.6 Add start/complete job buttons with location capture

## 5. Photo Evidence

- [x] 5.1 Create PhotoCapture component using expo-image-picker
- [x] 5.2 Implement photo compression to 80% JPEG, max 1920px
- [x] 5.3 Store photos as base64 in AsyncStorage linked to work order
- [x] 5.4 Create photo gallery component for viewing captured photos
- [ ] 5.5 Implement photo sync to cloud storage when online
- [x] 5.6 Add minimum photo validation per work order type

## 6. Parts Registration

- [x] 6.1 Create parts catalog data model (name, partNumber, category, price)
- [x] 6.2 Add parts catalog with categories (filters, coils, compressors, refrigerants, electrical, other)
- [x] 6.3 Create AddPart component with search functionality
- [x] 6.4 Add custom part entry option
- [x] 6.5 Calculate parts subtotal per work order
- [x] 6.6 Persist parts list in work order

## 7. Digital Signature

- [x] 7.1 Create SignatureCapture component for signature with name entry
- [x] 7.2 Save signature in AsyncStorage linked to work order
- [x] 7.3 Require signature before work order completion
- [x] 7.4 Display signature on work order completion
- [x] 7.5 Add signature timestamp and optional signer name

## 8. Quote Generation

- [x] 8.1 Create quote model with line items (labor, parts) and totals
- [x] 8.2 Implement quote calculator: BaseRateByType * CapacityMultiplier + (LaborHours * HourlyRate) + PartsTotal
- [x] 8.3 Define tariff table (Split $50, Window $40, Central $80, Chiller $150, Package $100)
- [x] 8.4 Implement capacity multiplier (small 1.0, medium 1.5, large 2.0)
- [ ] 8.5 Add quote line items display with edit capability
- [x] 8.6 Implement quote status lifecycle (draft, sent, approved, rejected)

## 9. Quote Email

- [ ] 9.1 Create email template with quote details table
- [ ] 9.2 Implement PDF generation for quote attachment
- [ ] 9.3 Add email sending via backend API
- [ ] 9.4 Implement email queue for offline
- [ ] 9.5 Add auto-retry for failed email delivery
- [ ] 9.6 Track email sent timestamp and delivery status

## 10. Maintenance History

- [x] 10.1 Create maintenance log model linked to equipment and work order
- [x] 10.2 Implement history retrieval by equipment with chronological sorting
- [ ] 10.3 Add filters by maintenance type and date range
- [ ] 10.4 Create maintenance detail view with photos gallery and signature
- [ ] 10.5 Implement history export to PDF

## 11. Dashboard KPIs

- [x] 11.1 Implement KPI calculation services (services count, active technicians, revenue)
- [x] 11.2 Update app/(admin)/index.tsx with KPI cards
- [x] 11.3 Add time range selector (today, week, month, year)
- [ ] 11.4 Implement breakdown views (by type, by client)
- [x] 11.5 Add pending/in-progress orders count

## 12. Geolocation Tracking

- [x] 12.1 Integrate expo-location for GPS capture
- [ ] 12.2 Capture start location on work order start
- [ ] 12.3 Capture end location on work order complete
- [ ] 12.4 Store location with timestamp in work order
- [ ] 12.5 Display start/end location on map in work order detail
- [x] 12.6 Calculate distance between start and end

## 13. Offline Mode

- [x] 13.1 Implement offline detection (NetInfo)
- [x] 13.2 Create sync service with queue for pending changes
- [ ] 13.3 Implement auto-sync on reconnect
- [ ] 13.4 Add manual sync trigger button
- [x] 13.5 Implement last-write-wins conflict resolution
- [x] 13.6 Add sync status indicator (Synced, Pending, Syncing)
- [ ] 13.7 Clean up local photos after successful cloud upload
