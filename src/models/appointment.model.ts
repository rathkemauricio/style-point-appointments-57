
import { Professional } from './professional.model';
import { Service } from './service.model';
import { Customer } from './customer.model';

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  customerId: string;
  professionalId: string;
  serviceIds: string[];
  totalPrice: number;
  notes?: string;
  createdAt: string;
  
  // Populated relations
  customer?: Customer;
  professional?: Professional;
  services?: Service[];
}

export interface AppointmentFormData {
  date: string;
  startTime: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  professionalId: string;
  serviceIds: string[];
  notes?: string;
}

export interface AppointmentFilters {
  startDate?: string;
  endDate?: string;
  status?: AppointmentStatus;
  professionalId?: string;
}

export interface AppointmentStats {
  total: number;
  completed: number;
  revenue: number;
}

export interface DailyAvailability {
  date: string;
  slots: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}
