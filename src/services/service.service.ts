
import { Service } from '../models/service.model';
import { mockServices } from '../mocks/mockData';

class ServiceService {
  private services: Service[] = [...mockServices];

  async getServices(): Promise<Service[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.services);
      }, 500);
    });
  }

  async getServiceById(id: string): Promise<Service | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const service = this.services.find((s) => s.id === id);
        resolve(service);
      }, 300);
    });
  }

  async createService(service: Omit<Service, 'id'>): Promise<Service> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newService: Service = {
          id: `service-${Date.now()}`,
          ...service
        };

        this.services.push(newService);
        resolve(newService);
      }, 300);
    });
  }

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.services.findIndex((s) => s.id === id);
        if (index === -1) {
          reject(new Error('Service not found'));
          return;
        }

        this.services[index] = {
          ...this.services[index],
          ...data
        };

        resolve(this.services[index]);
      }, 300);
    });
  }

  async deleteService(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.services.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.services.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }
}

export default new ServiceService();
