import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Scissors, DollarSign, Star, Users, Settings, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import AuthHeader from '../../components/AuthHeader';
import Footer from '../../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../hooks/use-auth';
import professionalService from '../../services/professional.service';
import appointmentService from '../../services/appointment.service';
import { formatCurrency } from '../../utils/formatUtils';

const PortalPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: professional } = useQuery({
    queryKey: ['professional', user?.professionalId],
    queryFn: () => professionalService.getProfessionalById(user?.professionalId || ''),
    enabled: !!user?.professionalId,
  });

  // Obter estatísticas
  const today = new Date().toISOString().split('T')[0];
  const { data: stats } = useQuery({
    queryKey: ['stats', today],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(1); // Primeiro dia do mês atual
      const endDate = new Date();

      const appointments = await appointmentService.getAppointmentsByProfessionalId(
        user?.professionalId || '',
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );

      return {
        total: appointments.length,
        revenue: appointments.reduce((sum, apt) => sum + (apt.totalPrice || 0), 0)
      };
    }
  });

  // Formatar data para exibição
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader title="Portal do Profissional" />

      <div className="flex-1 page-container py-6">
        {professional && (
          <div className="mb-8 flex items-center">
            <div className="mr-4">
              <div className="h-20 w-20 rounded-full overflow-hidden">
                <img
                  src={professional.avatarUrl || 'https://via.placeholder.com/100'}
                  alt={professional.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold">{professional.name}</h1>
              <p className="text-gray-600">{professional.title || "Barbeiro"}</p>
            </div>
          </div>
        )}
<<<<<<< HEAD

        {/* Cards estatísticos - only show if user has permissions */}
        <PermissionGuard permission="view_agenda">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Atendimentos do Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              </CardContent>
            </Card>

            <PermissionGuard permission="view_revenue">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">
                    Faturamento do Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {formatCurrency(stats?.revenue || 0)}
                  </p>
                </CardContent>
              </Card>
            </PermissionGuard>

            <PermissionGuard permission="view_reviews">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">
                    Média de Avaliação
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <p className="text-2xl font-bold mr-1">4.8</p>
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                </CardContent>
              </Card>
            </PermissionGuard>

            <PermissionGuard permission="view_customers">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">
                    Clientes Atendidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">128</p>
                </CardContent>
              </Card>
            </PermissionGuard>
          </div>
        </PermissionGuard>

        {/* Menu rápido - with permission guards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <PermissionGuard permission="view_agenda">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center"
              onClick={() => navigate('/portal/agenda')}
            >
              <Calendar className="h-8 w-8 mb-2" />
              <span>Agenda</span>
            </Button>
          </PermissionGuard>

          <PermissionGuard permission="view_services">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center"
              onClick={() => navigate('/portal/services')}
            >
              <Scissors className="h-8 w-8 mb-2" />
              <span>Meus Serviços</span>
            </Button>
          </PermissionGuard>

          <PermissionGuard permission="view_revenue">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center"
              onClick={() => navigate('/portal/revenue')}
            >
              <DollarSign className="h-8 w-8 mb-2" />
              <span>Faturamento</span>
            </Button>
          </PermissionGuard>

          <PermissionGuard permission="view_customers">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center"
              onClick={() => navigate('/portal/customers')}
            >
              <Users className="h-8 w-8 mb-2" />
              <span>Clientes</span>
            </Button>
          </PermissionGuard>
        </div>

        {/* Seção de Admin - apenas para administradores */}
        {user?.role === 'admin' && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Administração
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center border-2 border-blue-200 hover:border-blue-300"
                onClick={() => navigate('/admin/users')}
              >
                <Users className="h-8 w-8 mb-2 text-blue-600" />
                <span className="text-blue-600 font-medium">Gerenciar Usuários</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center border-2 border-purple-200 hover:border-purple-300"
                onClick={() => navigate('/admin/white-label')}
              >
                <Settings className="h-8 w-8 mb-2 text-purple-600" />
                <span className="text-purple-600 font-medium">Configurações</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center border-2 border-green-200 hover:border-green-300"
                onClick={() => navigate('/config')}
              >
                <Settings className="h-8 w-8 mb-2 text-green-600" />
                <span className="text-green-600 font-medium">Configurações Gerais</span>
              </Button>
            </div>
          </div>
        )}

        {/* Próximos agendamentos - only if user can view agenda */}
        <PermissionGuard permission="view_agenda">
          <div className="card-shadow rounded-lg p-4 mb-8">
            <h2 className="text-lg font-semibold mb-4">Próximos Agendamentos</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border-b">
                <div>
                  <p className="font-medium">Carlos Silva</p>
                  <p className="text-sm text-gray-600">Corte + Barba</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Hoje</p>
                  <p className="font-medium">15:00</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border-b">
                <div>
                  <p className="font-medium">André Oliveira</p>
                  <p className="text-sm text-gray-600">Corte Degradê</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Hoje</p>
                  <p className="font-medium">16:30</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3">
                <div>
                  <p className="font-medium">Marcelo Santos</p>
                  <p className="text-sm text-gray-600">Barba</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{formatDate(new Date().toISOString())}</p>
                  <p className="font-medium">10:00</p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => navigate('/portal/agenda')}
              >
                Ver todos os agendamentos
              </Button>
            </div>
          </div>
        </PermissionGuard>

        {/* Avaliações recentes - only if user can view reviews */}
        <PermissionGuard permission="view_reviews">
          <div className="card-shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Avaliações Recentes</h2>

            <div className="space-y-4">
              <div className="p-3 border-b">
                <div className="flex justify-between mb-2">
                  <p className="font-medium">Maria Oliveira</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Atendimento excelente! Adorei o resultado do corte.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(new Date(Date.now() - 86400000).toISOString())}
                </p>
              </div>

              <div className="p-3 border-b">
                <div className="flex justify-between mb-2">
                  <p className="font-medium">João Paulo</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Muito bom o serviço, recomendo.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(new Date(Date.now() - 172800000).toISOString())}
                </p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => navigate('/portal/reviews')}
              >
                Ver todas as avaliações
              </Button>
=======
        
        {/* Cards estatísticos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Atendimentos do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.total || 0}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Faturamento do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatCurrency(stats?.revenue || 0)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Média de Avaliação
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <p className="text-2xl font-bold mr-1">4.8</p>
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Clientes Atendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">128</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Menu rápido */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center justify-center"
            onClick={() => navigate('/portal/agenda')}
          >
            <Calendar className="h-8 w-8 mb-2" />
            <span>Agenda</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center justify-center"
            onClick={() => navigate('/portal/services')}
          >
            <Scissors className="h-8 w-8 mb-2" />
            <span>Meus Serviços</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center justify-center"
            onClick={() => navigate('/portal/revenue')}
          >
            <DollarSign className="h-8 w-8 mb-2" />
            <span>Faturamento</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center justify-center"
            onClick={() => navigate('/portal/customers')}
          >
            <Users className="h-8 w-8 mb-2" />
            <span>Clientes</span>
          </Button>
        </div>
        
        {/* Próximos agendamentos */}
        <div className="card-shadow rounded-lg p-4 mb-8">
          <h2 className="text-lg font-semibold mb-4">Próximos Agendamentos</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border-b">
              <div>
                <p className="font-medium">Carlos Silva</p>
                <p className="text-sm text-gray-600">Corte + Barba</p>
              </div>
              <div className="text-right">
                <p className="text-sm">Hoje</p>
                <p className="font-medium">15:00</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 border-b">
              <div>
                <p className="font-medium">André Oliveira</p>
                <p className="text-sm text-gray-600">Corte Degradê</p>
              </div>
              <div className="text-right">
                <p className="text-sm">Hoje</p>
                <p className="font-medium">16:30</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3">
              <div>
                <p className="font-medium">Marcelo Santos</p>
                <p className="text-sm text-gray-600">Barba</p>
              </div>
              <div className="text-right">
                <p className="text-sm">{formatDate(new Date().toISOString())}</p>
                <p className="font-medium">10:00</p>
              </div>
>>>>>>> 3e894965b0d555e42b6cce9114cc89725195ce25
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/portal/agenda')}
            >
              Ver todos os agendamentos
            </Button>
          </div>
        </div>
        
        {/* Avaliações recentes */}
        <div className="card-shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Avaliações Recentes</h2>
          
          <div className="space-y-4">
            <div className="p-3 border-b">
              <div className="flex justify-between mb-2">
                <p className="font-medium">Maria Oliveira</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Atendimento excelente! Adorei o resultado do corte.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(new Date(Date.now() - 86400000).toISOString())}
              </p>
            </div>
            
            <div className="p-3 border-b">
              <div className="flex justify-between mb-2">
                <p className="font-medium">João Paulo</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Muito bom o serviço, recomendo.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(new Date(Date.now() - 172800000).toISOString())}
              </p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/portal/reviews')}
            >
              Ver todas as avaliações
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PortalPage;
