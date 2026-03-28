import { OrderStatus } from '../components/ui/StatusBadge';

export const mockOrders = [
  { id: '101', title: 'Mantenimiento Preventivo Mini Split', status: 'PENDING' as OrderStatus, date: '28 Oct 2026', technician: null, address: 'Av. Las Palmas 543' },
  { id: '102', title: 'Reparación de Compresor', status: 'IN_PROGRESS' as OrderStatus, date: '28 Oct 2026', technician: 'Juan Pérez', address: 'Calle 10 #45 Sur' },
  { id: '103', title: 'Instalación AC Central', status: 'COMPLETED' as OrderStatus, date: '25 Oct 2026', technician: 'Carlos Torres', address: 'Edificio Omega 12A' },
];

export const mockEquipments = [
  { id: 'E1', name: 'Mini Split Inverter 12000 BTU', location: 'Sala Principal', lastService: '10 Ene 2026' },
  { id: 'E2', name: 'Aire Central 3 Toneladas', location: 'Planta Alta', lastService: '15 Dic 2025' },
];

export const mockTechnicians = [
  { id: 'T1', name: 'Juan Pérez', activeJobs: 2, status: 'Online' },
  { id: 'T2', name: 'Carlos Torres', activeJobs: 0, status: 'Offline' },
];

export const mockClients = [
  { id: 'C1', name: 'Empresa Alpha S.A.', pendingOrders: 1 },
  { id: 'C2', name: 'Familia González', pendingOrders: 0 },
];
