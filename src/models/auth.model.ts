
export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'professional' | 'customer';
  professionalId?: string; // Se for um profissional, terá o ID do seu perfil profissional
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}
