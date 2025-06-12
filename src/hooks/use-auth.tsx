
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import authService from '../services/auth.service';
import { LoginCredentials, AuthUser } from '../models/auth.model';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isProfessional: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const loadUser = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };

    loadUser();
  }, []);

  // Login
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response) {
        setUser(response.user);
        toast.success('Login realizado com sucesso!');
        navigate('/portal');
        return true;
      } else {
        toast.error('Credenciais inválidas');
        return false;
      }
    } catch (error) {
      toast.error('Erro ao fazer login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
    toast.info('Sessão encerrada');
    navigate('/login');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isProfessional: user?.role === 'professional',
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
