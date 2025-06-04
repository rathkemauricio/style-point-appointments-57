import { Appointment, AppointmentStatus, AppointmentStats, TimeSlot } from '../models/appointment.model';
import { mockAppointments } from '../mocks/mockData';
import { format, addDays, isBefore, startOfDay, endOfDay } from 'date-fns';

class AppointmentService {
  private appointments: Appointment[] = [...mockAppointments];
  
  async getAppointments(startDate?: string, endDate?: string): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredAppointments = this.appointments;
        
        if (startDate && endDate) {
          filteredAppointments = this.appointments.filter(
            appointment => appointment.date >= startDate && appointment.date <= endDate
          );
        }
        
        resolve(filteredAppointments);
      }, 500);
    });
  }
  
  async getAppointmentsByCustomer(customerId: string): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customerAppointments = this.appointments.filter(
          (appointment) => appointment.customerId === customerId
        );
        resolve(customerAppointments);
      }, 300);
    });
  }

  async getAppointmentsByProfessionalId(professionalId: string, startDate: string, endDate: string): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const professionalAppointments = this.appointments.filter(
          (appointment) => 
            appointment.professionalId === professionalId &&
            appointment.date >= startDate &&
            appointment.date <= endDate
        );
        resolve(professionalAppointments);
      }, 300);
    });
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);
        
        const dayAppointments = this.appointments.filter((appointment) => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate >= dayStart && appointmentDate <= dayEnd;
        });
        
        resolve(dayAppointments);
      }, 300);
    });
  }
  
  async getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rangeAppointments = this.appointments.filter((appointment) => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate >= startDate && appointmentDate <= endDate;
        });
        
        resolve(rangeAppointments);
      }, 300);
    });
  }
  
  async getAppointmentById(id: string): Promise<Appointment | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const appointment = this.appointments.find((a) => a.id === id);
        resolve(appointment);
      }, 300);
    });
  }
  
  async updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.appointments.findIndex((a) => a.id === id);
        if (index === -1) {
          reject(new Error('Appointment not found'));
          return;
        }
        
        this.appointments[index] = {
          ...this.appointments[index],
          status
        };
        
        resolve(this.appointments[index]);
      }, 300);
    });
  }
  
  async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAppointment: Appointment = {
          id: `appointment-${Date.now()}`,
          ...appointment
        };
        
        this.appointments.push(newAppointment);
        resolve(newAppointment);
      }, 300);
    });
  }

  async getStats(startDate: string, endDate: string): Promise<AppointmentStats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const periodAppointments = this.appointments.filter(
          appointment => appointment.date >= startDate && appointment.date <= endDate
        );

        const stats: AppointmentStats = {
          total: periodAppointments.length,
          revenue: periodAppointments.reduce((sum, apt) => sum + (apt.totalPrice || 0), 0),
          completed: periodAppointments.filter(apt => apt.status === 'completed').length
        };

        resolve(stats);
      }, 300);
    });
  }

  async getAvailability(date: string, professionalId: string): Promise<TimeSlot[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock de horários disponíveis
        const slots: TimeSlot[] = [];
        const startHour = 8;
        const endHour = 18;
        
        for (let hour = startHour; hour < endHour; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const isAvailable = Math.random() > 0.3; // 70% de chance de estar disponível
            
            slots.push({
              startTime,
              endTime: `${hour.toString().padStart(2, '0')}:${(minute + 30).toString().padStart(2, '0')}`,
              isAvailable
            });
          }
        }
        
        resolve(slots);
      }, 300);
    });
  }
}

export default new AppointmentService();
