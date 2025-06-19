import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppointments, useCustomers, useServices } from '@/hooks/use-api';
import { Loader2, Plus, Trash2, Edit } from 'lucide-react';

/**
 * Componente de exemplo mostrando como usar a API integrada
 */
const ApiExample: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        description: ''
    });

    // Hooks da API
    const {
        useAppointmentsList,
        useCreateAppointment,
        useUpdateAppointment,
        useDeleteAppointment
    } = useAppointments();

    const {
        useCustomersList,
        useCreateCustomer,
        useUpdateCustomer,
        useDeleteCustomer
    } = useCustomers();

    const {
        useServicesList,
        useCreateService,
        useUpdateService,
        useDeleteService
    } = useServices();

    // Queries
    const { data: appointments, isLoading: appointmentsLoading } = useAppointmentsList(1, 10);
    const { data: customers, isLoading: customersLoading } = useCustomersList(1, 10);
    const { data: services, isLoading: servicesLoading } = useServicesList();

    // Mutations
    const createCustomerMutation = useCreateCustomer();
    const updateCustomerMutation = useUpdateCustomer();
    const deleteCustomerMutation = useDeleteCustomer();

    const createServiceMutation = useCreateService();
    const updateServiceMutation = useUpdateService();
    const deleteServiceMutation = useDeleteService();

    const createAppointmentMutation = useCreateAppointment();
    const updateAppointmentMutation = useUpdateAppointment();
    const deleteAppointmentMutation = useDeleteAppointment();

    // Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateCustomer = async () => {
        try {
            await createCustomerMutation.mutateAsync({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                description: formData.description
            });

            // Limpar formulário
            setFormData({
                name: '',
                email: '',
                phone: '',
                description: ''
            });
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
        }
    };

    const handleUpdateCustomer = async (id: string) => {
        try {
            await updateCustomerMutation.mutateAsync({
                id,
                ...formData
            });
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
        }
    };

    const handleDeleteCustomer = async (id: string) => {
        try {
            await deleteCustomerMutation.mutateAsync();
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
        }
    };

    const handleCreateService = async () => {
        try {
            await createServiceMutation.mutateAsync({
                name: formData.name,
                description: formData.description,
                price: 50.00,
                duration: 60
            });
        } catch (error) {
            console.error('Erro ao criar serviço:', error);
        }
    };

    const handleCreateAppointment = async () => {
        try {
            await createAppointmentMutation.mutateAsync({
                customerId: '1',
                serviceId: '1',
                professionalId: '1',
                date: new Date().toISOString(),
                time: '14:00',
                status: 'pending'
            });
        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
        }
    };

    if (appointmentsLoading || customersLoading || servicesLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Carregando dados...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Exemplo de Integração com API</h1>

            {/* Formulário de Cliente */}
            <Card>
                <CardHeader>
                    <CardTitle>Gerenciar Clientes</CardTitle>
                    <CardDescription>
                        Exemplo de como criar, atualizar e excluir clientes usando a API
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Nome do cliente"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="email@exemplo.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="(11) 99999-9999"
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Observações sobre o cliente"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleCreateCustomer}
                            disabled={createCustomerMutation.isPending}
                        >
                            {createCustomerMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Plus className="h-4 w-4 mr-2" />
                            )}
                            Criar Cliente
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => handleUpdateCustomer('1')}
                            disabled={updateCustomerMutation.isPending}
                        >
                            {updateCustomerMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Edit className="h-4 w-4 mr-2" />
                            )}
                            Atualizar
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={() => handleDeleteCustomer('1')}
                            disabled={deleteCustomerMutation.isPending}
                        >
                            {deleteCustomerMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Excluir
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de Clientes */}
            <Card>
                <CardHeader>
                    <CardTitle>Clientes ({customers?.data?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {customers?.data && customers.data.length > 0 ? (
                        <div className="space-y-2">
                            {customers.data.map((customer: any) => (
                                <div key={customer.id} className="flex justify-between items-center p-3 border rounded">
                                    <div>
                                        <h3 className="font-medium">{customer.name}</h3>
                                        <p className="text-sm text-gray-600">{customer.email}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Nenhum cliente encontrado</p>
                    )}
                </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card>
                <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                    <CardDescription>
                        Exemplos de outras operações da API
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                    <Button
                        onClick={handleCreateService}
                        disabled={createServiceMutation.isPending}
                    >
                        {createServiceMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Plus className="h-4 w-4 mr-2" />
                        )}
                        Criar Serviço
                    </Button>

                    <Button
                        onClick={handleCreateAppointment}
                        disabled={createAppointmentMutation.isPending}
                    >
                        {createAppointmentMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Plus className="h-4 w-4 mr-2" />
                        )}
                        Criar Agendamento
                    </Button>
                </CardContent>
            </Card>

            {/* Status das Queries */}
            <Card>
                <CardHeader>
                    <CardTitle>Status das Queries</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 border rounded">
                            <h4 className="font-medium">Clientes</h4>
                            <p className="text-sm text-gray-600">
                                {customersLoading ? 'Carregando...' : `${(customers?.data as any[])?.length || 0} registros`}
                            </p>
                        </div>
                        <div className="p-3 border rounded">
                            <h4 className="font-medium">Serviços</h4>
                            <p className="text-sm text-gray-600">
                                {servicesLoading ? 'Carregando...' : `${(services?.data as any[])?.length || 0} registros`}
                            </p>
                        </div>
                        <div className="p-3 border rounded">
                            <h4 className="font-medium">Agendamentos</h4>
                            <p className="text-sm text-gray-600">
                                {appointmentsLoading ? 'Carregando...' : `${(appointments?.data as any[])?.length || 0} registros`}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ApiExample; 