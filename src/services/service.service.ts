
import ApiService from './api.service';
import appConfig from '../config/appConfig';
import { Service } from '../models/service.model';

// Import mock data for development
import { mockServices } from '../mocks/mockData';

class ServiceService {
  private api: ApiService;
  
  constructor() {
    this.api = new ApiService(appConfig.api.baseUrl, appConfig.api.timeout);
  }
  
  /**
   * Get all services
   */
  async getServices(): Promise<Service[]> {
    try {
      // In a real app, we'd call the API
      // const response = await this.api.get('/services');
      
      // For development, we're using mock data
      return mockServices;
    } catch (error) {
      console.error('Failed to fetch services:', error);
      return [];
    }
  }
  
  /**
   * Get service by ID
   */
  async getServiceById(id: string): Promise<Service | null> {
    try {
      // In a real app, we'd call the API
      // const response = await this.api.get(`/services/${id}`);
      
      // For development, we're using mock data
      const service = mockServices.find(s => s.id === id);
      return service || null;
    } catch (error) {
      console.error(`Failed to fetch service ${id}:`, error);
      return null;
    }
  }
  
  /**
   * Create a new service
   */
  async createService(data: Omit<Service, 'id'>): Promise<Service | null> {
    try {
      // In a real app, we'd call the API
      // const response = await this.api.post('/services', data);
      
      // For development, we simulate a successful creation
      const newService: Service = {
        ...data,
        id: `new-${Date.now()}`
      };
      
      return newService;
    } catch (error) {
      console.error('Failed to create service:', error);
      return null;
    }
  }
  
  /**
   * Update an existing service
   */
  async updateService(id: string, data: Partial<Service>): Promise<boolean> {
    try {
      // In a real app, we'd call the API
      // await this.api.put(`/services/${id}`, data);
      
      // For development, we simulate a successful update
      return true;
    } catch (error) {
      console.error(`Failed to update service ${id}:`, error);
      return false;
    }
  }
  
  /**
   * Delete a service
   */
  async deleteService(id: string): Promise<boolean> {
    try {
      // In a real app, we'd call the API
      // await this.api.delete(`/services/${id}`);
      
      // For development, we simulate a successful deletion
      return true;
    } catch (error) {
      console.error(`Failed to delete service ${id}:`, error);
      return false;
    }
  }
}

export default new ServiceService();
