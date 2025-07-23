
import { BaseService } from './base.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Service } from '../models/service.model';

class ServiceService extends BaseService {
  async getServices(): Promise<Service[]> {
    return this.get<Service[]>(API_ENDPOINTS.SERVICES);
  }

  async getAllServices(): Promise<Service[]> {
    return this.getServices();
  }

  async getServiceById(id: string): Promise<Service> {
    return this.get<Service>(`${API_ENDPOINTS.SERVICES}/${id}`);
  }

  async createService(serviceData: Omit<Service, 'id'>): Promise<Service> {
    return this.post<Service>(API_ENDPOINTS.SERVICES, serviceData);
  }

  async updateService(id: string, serviceData: Partial<Service>): Promise<Service> {
    return this.put<Service>(`${API_ENDPOINTS.SERVICES}/${id}`, serviceData);
  }

  async deleteService(id: string): Promise<void> {
    return this.delete<void>(`${API_ENDPOINTS.SERVICES}/${id}`);
  }

  async getActiveServices(): Promise<Service[]> {
    return this.get<Service[]>(`${API_ENDPOINTS.SERVICES}?active=true`);
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return this.get<Service[]>(`${API_ENDPOINTS.SERVICES}?category=${category}`);
  }
}

export default new ServiceService();
