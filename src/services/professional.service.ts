import { BaseService } from './base.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Professional } from '../models/professional.model';

class ProfessionalService extends BaseService {
  // Mock data para testes quando API não estiver disponível
  private getMockProfessional(id: string): Professional {
    return {
      id: id,
      name: 'João Silva',
      title: 'Barbeiro Profissional',
      email: 'barbeiro@barbearia.com',
      phone: '(11) 99999-9999',
      bio: 'Barbeiro profissional com mais de 10 anos de experiência',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      serviceIds: ['service-1', 'service-2'],
      isActive: true
    };
  }

  async getProfessionals(): Promise<Professional[]> {
    try {
      return await this.get<Professional[]>(API_ENDPOINTS.PROFESSIONALS);
    } catch (error) {
      console.log('API não disponível, usando dados mock para professionals');
      return [this.getMockProfessional('prof-1'), this.getMockProfessional('prof-2')];
    }
  }

  async getAllProfessionals(): Promise<Professional[]> {
    return this.getProfessionals();
  }

  async getProfessionalById(id: string): Promise<Professional> {
    try {
      return await this.get<Professional>(`${API_ENDPOINTS.PROFESSIONALS}/${id}`);
    } catch (error) {
      console.log('API não disponível, usando dados mock para professional');
      return this.getMockProfessional(id);
    }
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
