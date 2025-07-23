import { BaseService } from './base.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Professional } from '../models/professional.model';

class ProfessionalService extends BaseService {
  async getProfessionals(): Promise<Professional[]> {
    return this.get<Professional[]>(API_ENDPOINTS.PROFESSIONALS);
  }

  async getAllProfessionals(): Promise<Professional[]> {
    return this.getProfessionals();
  }

  async getProfessionalById(id: string): Promise<Professional> {
    return this.get<Professional>(`${API_ENDPOINTS.PROFESSIONALS}/${id}`);
  }

  async getActiveProfessionals(): Promise<Professional[]> {
    return this.get<Professional[]>(`${API_ENDPOINTS.PROFESSIONALS}?active=true`);
  }

  async createProfessional(professionalData: Omit<Professional, 'id'>): Promise<Professional> {
    return this.post<Professional>(API_ENDPOINTS.PROFESSIONALS, professionalData);
  }

  async updateProfessional(id: string, professionalData: Partial<Professional>): Promise<Professional> {
    return this.put<Professional>(`${API_ENDPOINTS.PROFESSIONALS}/${id}`, professionalData);
  }

  async deleteProfessional(id: string): Promise<void> {
    return this.delete<void>(`${API_ENDPOINTS.PROFESSIONALS}/${id}`);
  }

  async getProfessionalServices(professionalId: string): Promise<any[]> {
    return this.get<any[]>(`${API_ENDPOINTS.PROFESSIONALS}/${professionalId}/services`);
  }

  async getProfessionalStats(professionalId: string): Promise<any> {
    return this.get<any>(`${API_ENDPOINTS.PROFESSIONALS}/${professionalId}/stats`);
  }
}

export default new ProfessionalService();
