
import ApiService from './api.service';
import appConfig from '../config/appConfig';
import { Notification } from '../models/notification.model';
import authService from './auth.service';

// Mock de notificações para desenvolvimento
const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    professionalId: "prof-1",
    title: "Novo agendamento",
    message: "Carlos Silva agendou um corte para hoje às 15:00",
    type: "appointment",
    isRead: false,
    createdAt: new Date().toISOString(),
    link: "/agenda"
  },
  {
    id: "notif-2",
    professionalId: "prof-1",
    title: "Nova avaliação",
    message: "Maria Oliveira avaliou seu serviço com 5 estrelas",
    type: "review",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    link: "/reviews"
  },
  {
    id: "notif-3",
    professionalId: "prof-2",
    title: "Novo agendamento",
    message: "Pedro Santos agendou um corte para amanhã às 10:00",
    type: "appointment",
    isRead: false,
    createdAt: new Date().toISOString(),
    link: "/agenda"
  }
];

class NotificationService {
  private api: ApiService;
  
  constructor() {
    this.api = new ApiService(appConfig.api.baseUrl, appConfig.api.timeout);
  }
  
  /**
   * Obter notificações do profissional atual
   */
  async getNotifications(): Promise<Notification[]> {
    try {
      // Em um app real, chamaríamos a API
      // const response = await this.api.get('/notifications');
      
      // Para desenvolvimento, usamos mock data
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.professionalId) return [];
      
      return mockNotifications.filter(n => n.professionalId === currentUser.professionalId);
    } catch (error) {
      console.error('Falha ao obter notificações:', error);
      return [];
    }
  }
  
  /**
   * Marcar notificação como lida
   */
  async markAsRead(id: string): Promise<boolean> {
    try {
      // Em um app real, chamaríamos a API
      // await this.api.put(`/notifications/${id}/read`);
      
      // Para desenvolvimento, simulamos sucesso
      return true;
    } catch (error) {
      console.error('Falha ao marcar notificação como lida:', error);
      return false;
    }
  }
  
  /**
   * Marcar todas as notificações como lidas
   */
  async markAllAsRead(): Promise<boolean> {
    try {
      // Em um app real, chamaríamos a API
      // await this.api.put('/notifications/read-all');
      
      // Para desenvolvimento, simulamos sucesso
      return true;
    } catch (error) {
      console.error('Falha ao marcar todas notificações como lidas:', error);
      return false;
    }
  }
  
  /**
   * Excluir uma notificação
   */
  async deleteNotification(id: string): Promise<boolean> {
    try {
      // Em um app real, chamaríamos a API
      // await this.api.delete(`/notifications/${id}`);
      
      // Para desenvolvimento, simulamos sucesso
      return true;
    } catch (error) {
      console.error('Falha ao excluir notificação:', error);
      return false;
    }
  }
}

export default new NotificationService();
