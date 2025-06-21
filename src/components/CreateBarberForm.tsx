import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { UserPlus, Loader2 } from 'lucide-react';

import { useAuth } from '../hooks/use-auth';
import { usePermissions } from '../hooks/use-permissions';
import authService from '../services/auth.service';
import { Button } from './ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Schema de validação
const formSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
    professionalId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const CreateBarberForm: React.FC = () => {
    const { user } = useAuth();
    const { isAdmin } = usePermissions();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            professionalId: '',
        },
    });

    // Se não for admin, não renderiza o componente
    if (!isAdmin()) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-red-600">Acesso Negado</CardTitle>
                    <CardDescription>
                        Apenas administradores podem criar contas de barbeiros.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);
        try {
            const result = await authService.register({
                email: data.email,
                password: data.password,
                name: data.name,
                role: 'professional',
                professionalId: data.professionalId || undefined,
            });

            if (result) {
                toast.success('Barbeiro criado com sucesso!');
                form.reset();
            } else {
                toast.error('Erro ao criar barbeiro. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao criar barbeiro:', error);
            toast.error('Erro ao criar barbeiro. Verifique os dados e tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Criar Conta de Barbeiro
                </CardTitle>
                <CardDescription>
                    Crie uma nova conta de barbeiro para acessar o sistema.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome Completo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome do barbeiro" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="barbeiro@barbearia.com"
                                            {...field}
                                        />
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
                                        <Input
                                            type="password"
                                            placeholder="******"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirmar Senha</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="******"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="professionalId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ID do Profissional (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="prof-001"
                                            {...field}
                                        />
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
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Criar Barbeiro
                                </>
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                        <strong>Dica:</strong> O barbeiro receberá um email com as credenciais de acesso.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default CreateBarberForm; 