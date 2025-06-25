
import { BaseService } from './base.service';
import appConfig from '../config/appConfig';
import { LoginCredentials, LoginResponse, AuthUser } from '../models/auth.model';
import { mockProfessionals } from '../mocks/mockData';
import { API_ENDPOINTS } from '../config/api.config';

class AuthService extends BaseService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  
  constructor() {
    super();
  }
  
  /**
   * Login com email e senha
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse | null> {
    try {
      // Primeiro, tenta fazer login na API real
      const response = await this.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
        { requiresAuth: false } // Login não requer autenticação
      );

      if (response.data && response.data.user && response.data.token) {
        // Login bem-sucedido na API
        const loginResponse: LoginResponse = {
          user: response.data.user,
          token: response.data.token
        };
        
        // Salva na localStorage
        localStorage.setItem(this.TOKEN_KEY, loginResponse.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(loginResponse.user));

        return loginResponse;
      }

      // Se a API não respondeu corretamente, usa os usuários de teste
      return this.handleTestUsers(credentials);
    } catch (error) {
      console.log('API não disponível, usando usuários de teste:', error);
      // Se a API não estiver disponível, usa os usuários de teste
      return this.handleTestUsers(credentials);
    }
  }

  /**
   * Gerencia usuários de teste para desenvolvimento
   */
  private handleTestUsers(credentials: LoginCredentials): LoginResponse | null {
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
  }

  /**
   * Registra um novo usuário
   */
  async register(userData: {
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'professional' | 'customer';
    professionalId?: string;
  }): Promise<LoginResponse | null> {
    try {
      const response = await this.post<LoginResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData,
        { requiresAuth: false }
      );

      if (response.data && response.data.user && response.data.token) {
        // Registro bem-sucedido na API
        const loginResponse: LoginResponse = {
          user: response.data.user,
          token: response.data.token
        };

        // Salva na localStorage
        localStorage.setItem(this.TOKEN_KEY, loginResponse.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(loginResponse.user));

        return loginResponse;
      }

      return null;
    } catch (error) {
      console.error('Erro no registro:', error);
      return null;
    }
  }

  /**
   * Verifica o token atual e obtém dados do usuário
   */
  async verifyToken(): Promise<AuthUser | null> {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await this.get<{ user: AuthUser }>(
        API_ENDPOINTS.AUTH.ME,
        { requiresAuth: true }
      );

      if (response.data && response.data.user) {
        // Atualiza os dados do usuário no localStorage
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.user));
        return response.data.user;
      }

      return null;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      // Se a API não estiver disponível, retorna o usuário do localStorage
      return this.getCurrentUser();
    }
  }

  /**
   * Renova o token de autenticação
   */
  async refreshToken(): Promise<string | null> {
    try {
      const response = await this.post<{ token: string }>(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        {},
        { requiresAuth: false }
      );

      if (response.data && response.data.token) {
        localStorage.setItem(this.TOKEN_KEY, response.data.token);
        return response.data.token;
      }

      return null;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
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
