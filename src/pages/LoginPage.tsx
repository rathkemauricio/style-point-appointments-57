
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '../hooks/use-auth';
import appConfig from '../config/appConfig';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

// Validação com Zod
const formSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type FormValues = z.infer<typeof formSchema>;

const LoginPage: React.FC = () => {
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Se já estiver autenticado, redireciona para o portal
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/portal');
    }
  }, [isAuthenticated, navigate]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    const success = await login({
      email: data.email,
      password: data.password,
    });
    
    if (!success) {
      form.setError('email', { 
        type: 'manual', 
        message: 'Verifique seu email e senha' 
      });
    }
  };

  const fillCredentials = (email: string, password: string) => {
    form.setValue('email', email);
    form.setValue('password', password);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Login" showBackButton={true} />
      
      <div className="flex-1 page-container flex flex-col items-center justify-center">
        <div className="card-shadow w-full max-w-md p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Portal do Profissional</h1>
          
          <div className="mb-6">
            <img 
              src={appConfig.business.logoUrl} 
              alt={`${appConfig.business.name} Logo`} 
              className="w-24 h-24 mx-auto rounded-full object-cover" 
            />
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu.email@barbearia.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              <p className="font-semibold mb-3">Usuários de teste para controle de acesso:</p>
            </div>
            
            {/* Admin */}
            <div className="border rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">👑 Administrador</p>
                  <p className="text-xs text-gray-600">Acesso total ao sistema</p>
                  <p className="font-mono text-xs text-blue-600">admin@barbearia.com</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fillCredentials('admin@barbearia.com', '123456')}
                >
                  Usar
                </Button>
              </div>
            </div>
            
            {/* Barbeiro */}
            <div className="border rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">✂️ Barbeiro</p>
                  <p className="text-xs text-gray-600">Agenda, clientes e serviços</p>
                  <p className="font-mono text-xs text-green-600">barbeiro@barbearia.com</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fillCredentials('barbeiro@barbearia.com', '123456')}
                >
                  Usar
                </Button>
              </div>
            </div>
            
            {/* Cliente */}
            <div className="border rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">👤 Cliente</p>
                  <p className="text-xs text-gray-600">Serviços e disponibilidade</p>
                  <p className="font-mono text-xs text-purple-600">cliente@email.com</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fillCredentials('cliente@email.com', '123456')}
                >
                  Usar
                </Button>
              </div>
            </div>
            
            <div className="text-xs text-center text-muted-foreground mt-4">
              <p>Senha para todos: <span className="font-mono font-bold">123456</span></p>
              <p className="mt-1">Esta é uma versão de demonstração do controle de acesso.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LoginPage;
