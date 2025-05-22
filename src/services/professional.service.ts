
import ApiService from './api.service';
import appConfig from '../config/appConfig';
import { Professional } from '../models/professional.model';

// Import mock data for development
import { mockProfessionals } from '../mocks/mockData';

class ProfessionalService {
  private api: ApiService;
  
  constructor() {
    this.api = new ApiService(appConfig.api.baseUrl, appConfig.api.timeout);
  }
  
  /**
   * Get all professionals
   */
  async getProfessionals(): Promise<Professional[]> {
    try {
      // In a real app, we'd call the API
      // const response = await this.api.get('/professionals');
      
      // For development, we're using mock data
      return mockProfessionals.filter(p => p.isActive);
    } catch (error) {
      console.error('Failed to fetch professionals:', error);
      return [];
    }
  }
  
  /**
   * Get professional by ID
   */
  async getProfessionalById(id: string): Promise<Professional | null> {
    try {
      // In a real app, we'd call the API
      // const response = await this.api.get(`/professionals/${id}`);
      
      // For development, we're using mock data
      const professional = mockProfessionals.find(p => p.id === id);
      return professional || null;
    } catch (error) {
      console.error(`Failed to fetch professional ${id}:`, error);
      return null;
    }
  }
}

export default new ProfessionalService();
