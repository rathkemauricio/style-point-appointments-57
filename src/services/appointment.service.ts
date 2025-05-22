
import ApiService from './api.service';
import appConfig from '../config/appConfig';
import { 
  Appointment, 
  AppointmentFormData, 
  AppointmentFilters, 
  AppointmentStats,
  DailyAvailability
} from '../models/appointment.model';

// Import mock data for development
import { mockAppointments } from '../mocks/mockData';

class AppointmentService {
  private api: ApiService;
  
  constructor() {
    this.api = new ApiService(appConfig.api.baseUrl, appConfig.api.timeout);
  }
  
  /**
   * Get all appointments based on filters
   */
  async getAppointments(filters?: AppointmentFilters): Promise<Appointment[]> {
    try {
      // In a real app, we'd call the API with the filters
      // const response = await this.api.get('/appointments', { params: filters });
      
      // For development, we're using mock data
      let filteredAppointments = [...mockAppointments];
      
      if (filters) {
        if (filters.startDate) {
          filteredAppointments = filteredAppointments.filter(
            app => app.date >= filters.startDate!
          );
        }
        
        if (filters.endDate) {
          filteredAppointments = filteredAppointments.filter(
            app => app.date <= filters.endDate!
          );
        }
        
        if (filters.status) {
          filteredAppointments = filteredAppointments.filter(
            app => app.status === filters.status
          );
        }
        
        if (filters.professionalId) {
          filteredAppointments = filteredAppointments.filter(
            app => app.professionalId === filters.professionalId
          );
        }
      }
      
      return filteredAppointments;
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      return [];
    }
  }
  
  /**
   * Get appointment details by ID
   */
  async getAppointmentById(id: string): Promise<Appointment | null> {
    try {
      // In a real app, we'd call the API
      // const response = await this.api.get(`/appointments/${id}`);
      
      // For development, we're using mock data
      const appointment = mockAppointments.find(app => app.id === id);
      return appointment || null;
    } catch (error) {
      console.error(`Failed to fetch appointment ${id}:`, error);
      return null;
    }
  }
  
  /**
   * Create a new appointment
   */
  async createAppointment(data: AppointmentFormData): Promise<Appointment | null> {
    try {
      // In a real app, we'd call the API
      // const response = await this.api.post('/appointments', data);
      
      // For development, we simulate a successful creation
      const newAppointment: Appointment = {
        id: `new-${Date.now()}`,
        date: data.date,
        startTime: data.startTime,
        endTime: '', // Would be calculated based on service duration
        status: 'pending',
        customerId: data.customerId || `new-customer-${Date.now()}`,
        professionalId: data.professionalId,
        serviceIds: data.serviceIds,
        totalPrice: 0, // Would be calculated based on selected services
        notes: data.notes,
        createdAt: new Date().toISOString()
      };
      
      return newAppointment;
    } catch (error) {
      console.error('Failed to create appointment:', error);
      return null;
    }
  }
  
  /**
   * Update an existing appointment
   */
  async updateAppointment(id: string, data: Partial<Appointment>): Promise<boolean> {
    try {
      // In a real app, we'd call the API
      // await this.api.put(`/appointments/${id}`, data);
      
      // For development, we simulate a successful update
      return true;
    } catch (error) {
      console.error(`Failed to update appointment ${id}:`, error);
      return false;
    }
  }
  
  /**
   * Cancel an appointment
   */
  async cancelAppointment(id: string): Promise<boolean> {
    try {
      // In a real app, we'd call the API
      // await this.api.put(`/appointments/${id}/cancel`);
      
      // For development, we simulate a successful cancellation
      return true;
    } catch (error) {
      console.error(`Failed to cancel appointment ${id}:`, error);
      return false;
    }
  }
  
  /**
   * Get appointment statistics within a date range
   */
  async getStats(startDate: string, endDate: string): Promise<AppointmentStats> {
    try {
      // In a real app, we'd call the API
      // const response = await this.api.get('/appointments/stats', {
      //   params: { startDate, endDate }
      // });
      
      // For development, we calculate stats from mock data
      const appointments = mockAppointments.filter(
        app => app.date >= startDate && app.date <= endDate
      );
      
      const stats: AppointmentStats = {
        total: appointments.length,
        completed: appointments.filter(app => app.status === 'completed').length,
        revenue: appointments
          .filter(app => app.status === 'completed')
          .reduce((sum, app) => sum + app.totalPrice, 0)
      };
      
      return stats;
    } catch (error) {
      console.error('Failed to fetch appointment stats:', error);
      return { total: 0, completed: 0, revenue: 0 };
    }
  }

  /**
   * Check availability for a specific date
   */
  async getAvailability(date: string, professionalId: string): Promise<DailyAvailability> {
    try {
      // In a real app, we'd call the API
      // const response = await this.api.get('/appointments/availability', {
      //   params: { date, professionalId }
      // });
      
      // For development, we generate mock availability
      const busySlots = mockAppointments
        .filter(app => app.date === date && app.professionalId === professionalId)
        .map(app => ({ startTime: app.startTime, endTime: app.endTime }));
      
      // Generate all slots for the business day (9am to 7pm)
      const allSlots = [];
      for (let hour = 9; hour < 19; hour++) {
        const startHour = hour.toString().padStart(2, '0');
        const startTime = `${startHour}:00`;
        const endTime = `${startHour}:30`;
        
        const isAvailable = !busySlots.some(
          slot => slot.startTime === startTime || (
            slot.startTime < startTime && slot.endTime > startTime
          )
        );
        
        allSlots.push({ startTime, endTime, isAvailable });
        
        // Add the half-hour slot
        const halfStartTime = `${startHour}:30`;
        const nextHour = (hour + 1).toString().padStart(2, '0');
        const halfEndTime = hour === 18 ? "19:00" : `${nextHour}:00`;
        
        const isHalfAvailable = !busySlots.some(
          slot => slot.startTime === halfStartTime || (
            slot.startTime < halfStartTime && slot.endTime > halfStartTime
          )
        );
        
        allSlots.push({ startTime: halfStartTime, endTime: halfEndTime, isAvailable: isHalfAvailable });
      }
      
      return {
        date,
        slots: allSlots
      };
    } catch (error) {
      console.error('Failed to fetch availability:', error);
      return { date, slots: [] };
    }
  }
}

export default new AppointmentService();
