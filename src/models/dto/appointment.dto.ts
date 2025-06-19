import { Customer } from '../customer.model';
import { Service } from '../service.model';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface AppointmentDTO {
    id: string;
    customerId: string;
    serviceId: string;
    date: string;
    time: string;
    status: AppointmentStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;

    // Populated relations
    customer?: Customer;
    service?: Service;
}

export interface CreateAppointmentDTO {
    customerId: string;
    serviceId: string;
    date: string;
    time: string;
    notes?: string;
}

export interface UpdateAppointmentDTO {
    customerId?: string;
    serviceId?: string;
    date?: string;
    time?: string;
    status?: AppointmentStatus;
    notes?: string;
}

export interface AppointmentFilters {
    startDate?: string;
    endDate?: string;
    status?: AppointmentStatus;
    customerId?: string;
    serviceId?: string;
}

export interface AppointmentStats {
    total: number;
    confirmed: number;
    cancelled: number;
    pending: number;
    revenue: number;
} 