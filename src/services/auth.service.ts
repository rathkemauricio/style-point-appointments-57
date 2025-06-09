
import ApiService from './api.service';
import appConfig from '../config/appConfig';
import { LoginCredentials, LoginResponse, AuthUser } from '../models/auth.model';
import { mockProfessionals } from '../mocks/mockData';

class AuthService {
  private api: ApiService;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  
  constructor() {
    this.api = new ApiService(appConfig.api.baseUrl, appConfig.api.timeout);
  }
  
  /**
   * Login com email e senha
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse | null> {
    try {
      // Usuários de teste para controle de acesso
      const testUsers = [
        {
          email: 'admin@barbearia.com',
          password: '123456',
          user: {
            id: 'admin-1',
            email: 'admin@barbearia.com',
            role: 'admin' as const,
          }
        },
        {
          email: 'barbeiro@barbearia.com',
          password: '123456',
          user: {
            id: 'professional-1',
            email: 'barbeiro@barbearia.com',
            role: 'professional' as const,
            professionalId: 'prof-1',
          }
        },
        {
          email: 'cliente@email.com',
          password: '123456',
          user: {
            id: 'customer-1',
            email: 'cliente@email.com',
            role: 'customer' as const,
          }
        },
        {
          // Manter o usuário original para compatibilidade
          email: 'joao@barbearia.com',
          password: '123456',
          user: {
            id: 'user-prof-1',
            email: 'joao@barbearia.com',
            role: 'professional' as const,
            professionalId: mockProfessionals[0].id,
          }
        }
      ];
      
      // Verificar se as credenciais correspondem a algum usuário de teste
      const testUser = testUsers.find(user => 
        user.email === credentials.email && user.password === credentials.password
      );
      
      if (testUser) {
        const response: LoginResponse = {
          user: testUser.user,
          token: `mock-token-${Date.now()}`
        };
        
        // Salva na localStorage
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        
        return response;
      }
      
      // Fallback para lógica anterior (busca por profissional)
      const professional = mockProfessionals.find(p => 
        `${p.name.toLowerCase().replace(/\s/g, '')}@barbearia.com` === credentials.email);
      
      if (!professional) {
        throw new Error('Credenciais inválidas');
      }
      
      const authUser: AuthUser = {
        id: `user-${professional.id}`,
        email: credentials.email,
        role: 'professional',
        professionalId: professional.id,
      };
      
      const response: LoginResponse = {
        user: authUser,
        token: `mock-token-${Date.now()}`
      };
      
      // Salva na localStorage
      localStorage.setItem(this.TOKEN_KEY, response.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      console.error('Falha no login:', error);
      return null;
    }
  }
  
  /**
   * Logout do usuário atual
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
  
  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
  /**
   * Obtém o token de autenticação
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  /**
   * Obtém os dados do usuário logado
   */
  getCurrentUser(): AuthUser | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson) as AuthUser;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }
  
  /**
   * Verifica se o usuário tem um papel específico
   */
  hasRole(role: 'admin' | 'professional' | 'customer'): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
  
  /**
   * Verifica se o usuário é um profissional
   */
  isProfessional(): boolean {
    return this.hasRole('professional');
  }
}

export default new AuthService();
