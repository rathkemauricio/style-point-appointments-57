import { BaseService } from './base.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Appointment } from '../models/appointment.model';
import { CreateAppointmentDTO, UpdateAppointmentDTO } from '../models/dto/appointment.dto';

class AppointmentService extends BaseService {
  async getAppointments(startDate?: string, endDate?: string): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.get<Appointment[]>(`${API_ENDPOINTS.APPOINTMENTS.LIST}${query}`);
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return this.getAppointments();
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    return this.get<Appointment>(API_ENDPOINTS.APPOINTMENTS.DETAILS(id));
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return this.get<Appointment[]>(API_ENDPOINTS.APPOINTMENTS.BY_DATE(date));
  }

  async getAppointmentsByProfessional(professionalId: string): Promise<Appointment[]> {
    return this.get<Appointment[]>(API_ENDPOINTS.APPOINTMENTS.BY_PROFESSIONAL(professionalId));
  }

  async getAppointmentsByProfessionalId(professionalId: string, startDate: string, endDate: string): Promise<Appointment[]> {
    try {
      return await this.get<Appointment[]>(`${API_ENDPOINTS.APPOINTMENTS.BY_PROFESSIONAL(professionalId)}?startDate=${startDate}&endDate=${endDate}`);
    } catch (error) {
      console.log('API não disponível, usando dados mock para appointments');
      // Retorna alguns appointments mock para demonstração
      return [
        {
          id: 'apt-1',
          customerId: 'customer-1',
          professionalId: professionalId,
          date: new Date().toISOString().split('T')[0],
          startTime: '10:00',
          endTime: '11:00',
          serviceIds: ['service-1'],
          status: 'confirmed',
          notes: 'Corte regular',
          totalPrice: 50,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Appointment,
        {
          id: 'apt-2', 
          customerId: 'customer-2',
          professionalId: professionalId,
          date: new Date().toISOString().split('T')[0],
          startTime: '14:00',
          endTime: '15:00', 
          serviceIds: ['service-2'],
          status: 'completed',
          notes: 'Corte + barba',
          totalPrice: 80,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Appointment
      ];
    }
  }

  async getAppointmentsByCustomer(customerId: string): Promise<Appointment[]> {
    return this.get<Appointment[]>(API_ENDPOINTS.APPOINTMENTS.BY_CUSTOMER(customerId));
  }

  async createAppointment(appointmentData: CreateAppointmentDTO): Promise<Appointment> {
    return this.post<Appointment>(API_ENDPOINTS.APPOINTMENTS.CREATE, appointmentData);
  }

  async updateAppointment(id: string, appointmentData: UpdateAppointmentDTO): Promise<Appointment> {
    return this.put<Appointment>(API_ENDPOINTS.APPOINTMENTS.UPDATE(id), appointmentData);
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    return this.put<Appointment>(`${API_ENDPOINTS.APPOINTMENTS.BASE}/${id}/status`, { status });
  }

  async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    return this.put<Appointment>(`${API_ENDPOINTS.APPOINTMENTS.BASE}/${id}/cancel`, { reason });
  }

  async confirmAppointment(id: string): Promise<Appointment> {
    return this.put<Appointment>(`${API_ENDPOINTS.APPOINTMENTS.BASE}/${id}/confirm`, {});
  }

  async completeAppointment(id: string, notes?: string): Promise<Appointment> {
    return this.put<Appointment>(`${API_ENDPOINTS.APPOINTMENTS.BASE}/${id}/complete`, { notes });
  }

  async deleteAppointment(id: string): Promise<void> {
    return this.delete<void>(API_ENDPOINTS.APPOINTMENTS.DELETE(id));
  }

  async getAvailableSlots(
    professionalId: string,
    date: string,
    serviceId: string
  ): Promise<string[]> {
    return this.get<string[]>(
      `${API_ENDPOINTS.APPOINTMENTS}/available-slots?professionalId=${professionalId}&date=${date}&serviceId=${serviceId}`
    );
  }

  async getAvailability(date: string, professionalId: string): Promise<any[]> {
    return this.getAvailableSlots(professionalId, date, '');
  }

  async getAppointmentsByDateRange(startDate: string, endDate: string, professionalId?: string): Promise<Appointment[]> {
    const params = new URLSearchParams({
      startDate,
      endDate,
      ...(professionalId && { professionalId }),
    });
    
    return this.get<Appointment[]>(`${API_ENDPOINTS.APPOINTMENTS}?${params.toString()}`);
  }

  async getStats(startDate: string, endDate: string): Promise<any> {
    return this.get<any>(`${API_ENDPOINTS.STATS}?startDate=${startDate}&endDate=${endDate}`);
  }
}

export default new AppointmentService();
