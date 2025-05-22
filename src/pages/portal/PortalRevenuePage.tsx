
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subMonths, addMonths, startOfYear, endOfYear, getMonth, getYear, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import AuthHeader from '../../components/AuthHeader';
import Footer from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import appointmentService from '../../services/appointment.service';
import serviceService from '../../services/service.service';
import { formatCurrency } from '../../utils/formatUtils';

// Cores para o gráfico
const CHART_COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];

const PortalRevenuePage: React.FC = () => {
  // Estado para controle de período
  const [currentDate, setCurrentDate] = useState(new Date());
  const [periodView, setPeriodView] = useState<'month' | 'year'>('month');
  
  // Determinar o período atual
  const getPeriod = () => {
    if (periodView === 'month') {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        label: format(currentDate, 'MMMM yyyy', { locale: ptBR })
      };
    } else {
      const year = getYear(currentDate);
      const start = startOfYear(currentDate);
      const end = endOfYear(currentDate);
      return {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        label: `${year}`
      };
    }
  };
  
  const period = getPeriod();
  
  // Navegação entre períodos
  const goToPreviousPeriod = () => {
    if (periodView === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setFullYear(newDate.getFullYear() - 1);
      setCurrentDate(newDate);
    }
  };
  
  const goToNextPeriod = () => {
    if (periodView === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setFullYear(newDate.getFullYear() + 1);
      setCurrentDate(newDate);
    }
  };
  
  // Buscar dados de faturamento
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['revenue-stats', period.startDate, period.endDate],
    queryFn: () => appointmentService.getStats(period.startDate, period.endDate)
  });
  
  // Buscar serviços para mostrar distribuição
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceService.getServices()
  });
  
  // Mock de dados para os gráficos quando não temos dados reais
  const generateMockMonthlyData = () => {
    const currentMonth = getMonth(currentDate);
    const daysInMonth = new Date(getYear(currentDate), currentMonth + 1, 0).getDate();
    
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return {
        day: day,
        value: Math.floor(Math.random() * 300) + 50
      };
    });
  };
  
  const generateMockYearlyData = () => {
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    
    return months.map(month => ({
      month,
      value: Math.floor(Math.random() * 5000) + 1000
    }));
  };
  
  const generateServiceDistributionData = () => {
    if (!services) return [];
    
    return services.map(service => ({
      name: service.name,
      value: Math.floor(Math.random() * 50) + 10 // Quantidade de serviços prestados
    }));
  };
  
  // Dados para gráficos
  const monthlyData = generateMockMonthlyData();
  const yearlyData = generateMockYearlyData();
  const serviceDistribution = generateServiceDistributionData();
  
  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader title="Faturamento" />
      
      <div className="flex-1 page-container py-6">
        {/* Controles de período */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={goToPreviousPeriod}
            >
              <ChevronLeft size={18} />
            </Button>
            
            <div className="text-lg font-semibold">{period.label}</div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={goToNextPeriod}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
          
          <Tabs value={periodView} onValueChange={(v: 'month' | 'year') => setPeriodView(v)}>
            <TabsList>
              <TabsTrigger value="month">Mês</TabsTrigger>
              <TabsTrigger value="year">Ano</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Faturamento Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {isLoadingStats ? 'Calculando...' : formatCurrency(stats?.revenue || 0)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Quantidade de Serviços
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {isLoadingStats ? 'Calculando...' : stats?.total || 0}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Ticket Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {isLoadingStats ? 'Calculando...' : (
                  stats && stats.total > 0 
                    ? formatCurrency(stats.revenue / stats.total) 
                    : formatCurrency(0)
                )}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Gráfico de faturamento */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Evolução do Faturamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={periodView === 'month' ? monthlyData : yearlyData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey={periodView === 'month' ? 'day' : 'month'} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tickFormatter={(value) => `R$ ${value}`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value) => [`R$ ${value}`, 'Faturamento']}
                    labelFormatter={(label) => periodView === 'month' ? `Dia ${label}` : label}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#8B5CF6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Distribuição de serviços */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Serviços</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center justify-center">
            <div className="h-64 w-full max-w-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {serviceDistribution.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CHART_COLORS[index % CHART_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [value, 'Quantidade']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 sm:mt-0 sm:ml-4 w-full">
              <div className="space-y-2">
                {serviceDistribution.map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                      />
                      <span className="text-sm">{service.name}</span>
                    </div>
                    <span className="text-sm font-medium">{service.value} serviços</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default PortalRevenuePage;
