import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSimpleCustomers } from '@/hooks/use-simple-api';
import { Loader2, Plus, Trash2, Edit } from 'lucide-react';

/**
 * Exemplo usando hooks simples da API
 */
const SimpleApiExample: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    // Hooks simples da API
    const { useCustomersList, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } = useSimpleCustomers();

    // Buscar dados
    const { data: customers, loading: customersLoading, error, refetch } = useCustomersList();

    // Mutations
    const { create: createCustomer, loading: createLoading } = useCreateCustomer();
    const { update: updateCustomer, loading: updateLoading } = useUpdateCustomer();
    const { remove: deleteCustomer, loading: deleteLoading } = useDeleteCustomer();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateCustomer = async () => {
        const result = await createCustomer(formData);
        if (result) {
            setFormData({ name: '', email: '', phone: '' });
            refetch(); // Recarregar lista
        }
    };

    const handleUpdateCustomer = async (id: string) => {
        const result = await updateCustomer({ id, ...formData });
        if (result) {
            setFormData({ name: '', email: '', phone: '' });
            refetch(); // Recarregar lista
        }
    };

    const handleDeleteCustomer = async (id: string) => {
        const success = await deleteCustomer();
        if (success) {
            refetch(); // Recarregar lista
        }
    };

    if (customersLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Carregando clientes...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-500">Erro: {error}</p>
                    <Button onClick={refetch} className="mt-2">Tentar novamente</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Hooks Simples da API</h1>

            {/* Formulário */}
            <Card>
                <CardHeader>
                    <CardTitle>Gerenciar Clientes</CardTitle>
                    <CardDescription>
                        Exemplo usando hooks simples sem React Query
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleCreateCustomer}
                            disabled={createLoading}
                        >
                            {createLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Plus className="h-4 w-4 mr-2" />
                            )}
                            Criar Cliente
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => handleUpdateCustomer('1')}
                            disabled={updateLoading}
                        >
                            {updateLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Edit className="h-4 w-4 mr-2" />
                            )}
                            Atualizar
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={() => handleDeleteCustomer('1')}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
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
                    <CardTitle>
                        Clientes ({(customers as any[])?.length || 0})
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refetch}
                            className="ml-2"
                        >
                            Atualizar
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {customers && (customers as any[]).length > 0 ? (
                        <div className="space-y-2">
                            {(customers as any[]).map((customer: any) => (
                                <div key={customer.id} className="flex justify-between items-center p-3 border rounded">
                                    <div>
                                        <h3 className="font-medium">{customer.name}</h3>
                                        <p className="text-sm text-gray-600">{customer.email}</p>
                                        <p className="text-sm text-gray-500">{customer.phone}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setFormData({
                                                    name: customer.name,
                                                    email: customer.email,
                                                    phone: customer.phone
                                                });
                                            }}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDeleteCustomer(customer.id)}
                                        >
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

            {/* Vantagens */}
            <Card>
                <CardHeader>
                    <CardTitle>Vantagens dos Hooks Simples</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 border rounded">
                            <h4 className="font-medium">✅ Simples</h4>
                            <p className="text-sm text-gray-600">
                                Sem React Query, apenas useState e useEffect
                            </p>
                        </div>
                        <div className="p-3 border rounded">
                            <h4 className="font-medium">✅ Direto</h4>
                            <p className="text-sm text-gray-600">
                                Chama diretamente o BaseService
                            </p>
                        </div>
                        <div className="p-3 border rounded">
                            <h4 className="font-medium">✅ Controle Total</h4>
                            <p className="text-sm text-gray-600">
                                Você controla quando recarregar dados
                            </p>
                        </div>
                        <div className="p-3 border rounded">
                            <h4 className="font-medium">✅ Menos Dependências</h4>
                            <p className="text-sm text-gray-600">
                                Não precisa do React Query
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SimpleApiExample; 