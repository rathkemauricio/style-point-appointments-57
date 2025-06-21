import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Shield, ArrowLeft } from 'lucide-react';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CreateBarberForm from '../../components/CreateBarberForm';
import { useAuth } from '../../hooks/use-auth';
import { usePermissions } from '../../hooks/use-permissions';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const UserManagementPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isAdmin } = usePermissions();

    // Se não for admin, redireciona
    if (!isAdmin()) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header title="Gerenciamento de Usuários" showBackButton={true} />
                <div className="flex-1 page-container flex items-center justify-center">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-red-600 flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Acesso Negado
                            </CardTitle>
                            <CardDescription>
                                Apenas administradores podem acessar esta página.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={() => navigate('/portal')}
                                className="w-full"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar ao Portal
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Gerenciamento de Usuários" showBackButton={true} />

            <div className="flex-1 page-container">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-primary mb-2">
                        Gerenciamento de Usuários
                    </h1>
                    <p className="text-gray-600">
                        Gerencie contas de usuários e permissões do sistema.
                    </p>
                </div>

                <Tabs defaultValue="create" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="create" className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Criar Usuário
                        </TabsTrigger>
                        <TabsTrigger value="list" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Listar Usuários
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="create" className="mt-6">
                        <div className="flex justify-center">
                            <CreateBarberForm />
                        </div>
                    </TabsContent>

                    <TabsContent value="list" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Lista de Usuários
                                </CardTitle>
                                <CardDescription>
                                    Visualize e gerencie todos os usuários do sistema.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">
                                        Funcionalidade de listagem de usuários será implementada em breve.
                                    </p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        Aqui você poderá ver, editar e excluir usuários.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Informações do Admin */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Informações do Administrador
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Nome</p>
                                <p className="text-primary">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Função</p>
                                <p className="text-primary capitalize">{user?.role}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Footer />
        </div>
    );
};

export default UserManagementPage; 