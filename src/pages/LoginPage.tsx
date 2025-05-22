
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
          
          <div className="mt-4 text-sm text-center text-muted-foreground">
            <p>Use as seguintes credenciais para teste:</p>
            <p className="font-mono text-xs mt-1 font-bold">joao@barbearia.com / 123456</p>
            <p className="text-xs mt-2">Esta é uma versão de demonstração para profissionais acessarem seu portal.</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LoginPage;
