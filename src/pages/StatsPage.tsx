
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import Header from '../components/Header';
import Footer from '../components/Footer';
import appointmentService from '../services/appointment.service';
import { getTimePeriod } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatUtils';

const StatsPage: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'year'>('month');
  
  const { startDate, endDate } = getTimePeriod(timePeriod);
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats', startDate, endDate],
    queryFn: () => appointmentService.getStats(startDate, endDate)
  });
  
  // Mock chart data until we have real data
  const chartData = [
    { name: 'Corte', value: 800 },
    { name: 'Barba', value: 500 },
    { name: 'Combo', value: 1200 },
    { name: 'Tingimento', value: 300 },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Estatísticas" showBackButton={true} />
      
      <div className="flex-1 page-container">
        {/* Period Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              timePeriod === 'week' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
            onClick={() => setTimePeriod('week')}
          >
            Semana
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              timePeriod === 'month' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
            onClick={() => setTimePeriod('month')}
          >
            Mês
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              timePeriod === 'year' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
            onClick={() => setTimePeriod('year')}
          >
            Ano
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card-shadow p-4">
            <span className="block text-sm text-gray-500">Total de atendimentos</span>
            <span className="block text-2xl font-bold text-barber-primary mt-1">
              {isLoading ? '-' : stats?.total || 0}
            </span>
          </div>
          
          <div className="card-shadow p-4">
            <span className="block text-sm text-gray-500">Faturamento</span>
            <span className="block text-2xl font-bold text-barber-primary mt-1">
              {isLoading ? '-' : formatCurrency(stats?.revenue || 0)}
            </span>
          </div>
        </div>
        
        {/* Chart */}
        <div className="card-shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Serviços mais populares</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              >
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => `R$${value}`}
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  formatter={(value) => [`R$ ${value}`, 'Valor']}
                />
                <Bar 
                  dataKey="value" 
                  fill="#8B5CF6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default StatsPage;
