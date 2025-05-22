
import { Appointment, AppointmentStatus } from '../models/appointment.model';
import { mockAppointments } from '../mocks/mockData';
import { format, addDays, isBefore, startOfDay, endOfDay } from 'date-fns';

class AppointmentService {
  private appointments: Appointment[] = [...mockAppointments];
  
  async getAppointments(): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.appointments);
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
}

export default new AppointmentService();
