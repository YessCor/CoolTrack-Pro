// User types
export type UserRole = 'admin' | 'technician' | 'client';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  is_active: boolean;
  address?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

// Equipment types
export type EquipmentType = 'split' | 'central' | 'mini_split' | 'chiller' | 'fan_coil' | 'other';

export interface Equipment {
  id: string;
  client_id: string;
  name: string;
  type: EquipmentType;
  brand?: string;
  model?: string;
  serial_number?: string;
  capacity_tons?: number;
  installation_date?: string;
  last_service_date?: string;
  location_description?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Service Order types
export type OrderStatus = 'pending' | 'assigned' | 'in_transit' | 'in_progress' | 'completed' | 'cancelled';

export interface ServiceOrder {
  id: string;
  order_number: string;
  client_id: string;
  technician_id?: string;
  equipment_id?: string;
  status: OrderStatus;
  priority: string;
  service_type: string;
  description: string;
  scheduled_date?: string;
  started_at?: string;
  completed_at?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  client_signature_url?: string;
  technician_notes?: string;
  client_rating?: number;
  client_feedback?: string;
  total_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  changed_by?: string;
  notes?: string;
  created_at: string;
}

// Quote types
export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

export interface QuoteItem {
  id: string;
  quote_id: string;
  catalog_item_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
}

export interface Quote {
  id: string;
  quote_number: string;
  order_id?: string;
  client_id: string;
  technician_id?: string;
  status: QuoteStatus;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  valid_until?: string;
  notes?: string;
  terms?: string;
  items?: QuoteItem[];
  created_at: string;
  updated_at: string;
}

// Service Catalog
export interface ServiceCatalog {
  id: string;
  name: string;
  description?: string;
  category: string;
  base_price: number;
  unit: string;
  is_active: boolean;
  created_at: string;
}

// Technician Location
export interface TechnicianLocation {
  id: string;
  technician_id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  recorded_at: string;
}

// Notification
export type NotificationType = 'order' | 'quote' | 'info' | 'alert';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  order_id?: string;
  is_read: boolean;
  created_at: string;
}

// Order Photos
export interface OrderPhoto {
  id: string;
  order_id: string;
  uploaded_by?: string;
  url: string;
  caption?: string;
  phase: 'before' | 'during' | 'after';
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard stats
export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  pendingQuotes: number;
  totalRevenue: number;
  averageRating: number;
}
