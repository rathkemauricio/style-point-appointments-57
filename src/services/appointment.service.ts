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
    return this.get<Appointment[]>(`${API_ENDPOINTS.APPOINTMENTS}${query}`);
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return this.getAppointments();
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    return this.get<Appointment>(`${API_ENDPOINTS.APPOINTMENTS}/${id}`);
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return this.get<Appointment[]>(`${API_ENDPOINTS.APPOINTMENTS_BY_DATE}?date=${date}`);
  }

  async getAppointmentsByProfessional(professionalId: string): Promise<Appointment[]> {
    return this.get<Appointment[]>(`${API_ENDPOINTS.APPOINTMENTS_BY_PROFESSIONAL}/${professionalId}`);
  }

  async getAppointmentsByProfessionalId(professionalId: string, startDate: string, endDate: string): Promise<Appointment[]> {
    return this.get<Appointment[]>(`${API_ENDPOINTS.APPOINTMENTS_BY_PROFESSIONAL}/${professionalId}?startDate=${startDate}&endDate=${endDate}`);
  }

  async getAppointmentsByCustomer(customerId: string): Promise<Appointment[]> {
    return this.get<Appointment[]>(`${API_ENDPOINTS.APPOINTMENTS}?customerId=${customerId}`);
  }

  async createAppointment(appointmentData: CreateAppointmentDTO): Promise<Appointment> {
    return this.post<Appointment>(API_ENDPOINTS.APPOINTMENTS, appointmentData);
  }

  async updateAppointment(id: string, appointmentData: UpdateAppointmentDTO): Promise<Appointment> {
    return this.put<Appointment>(`${API_ENDPOINTS.APPOINTMENTS}/${id}`, appointmentData);
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    return this.put<Appointment>(`${API_ENDPOINTS.APPOINTMENTS}/${id}/status`, { status });
  }

  async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    return this.put<Appointment>(`${API_ENDPOINTS.APPOINTMENTS}/${id}/cancel`, { reason });
  }

  async confirmAppointment(id: string): Promise<Appointment> {
    return this.put<Appointment>(`${API_ENDPOINTS.APPOINTMENTS}/${id}/confirm`, {});
  }

  async completeAppointment(id: string, notes?: string): Promise<Appointment> {
    return this.put<Appointment>(`${API_ENDPOINTS.APPOINTMENTS}/${id}/complete`, { notes });
  }

  async deleteAppointment(id: string): Promise<void> {
    return this.delete<void>(`${API_ENDPOINTS.APPOINTMENTS}/${id}`);
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
