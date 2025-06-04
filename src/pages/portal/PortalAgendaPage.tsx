import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, Filter } from 'lucide-react';
import { format, addDays, isToday, startOfWeek, endOfWeek, addWeeks, subWeeks, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../../hooks/use-auth';

import AuthHeader from '../../components/AuthHeader';
import Footer from '../../components/Footer';
import AppointmentCard from '../../components/AppointmentCard';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover';
import appointmentService from '../../services/appointment.service';
import { formatDate } from '../../utils/dateUtils';
import { Appointment } from '../../models/appointment.model';

type DateRange = {
  startDate: string;
  endDate: string;
  label: string;
};

const PortalAgendaPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [periodFilter, setPeriodFilter] = useState<'dia' | 'semana' | 'mes'>('semana');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Função para gerar o range de datas baseado no filtro
  const getDateRange = (): DateRange => {
    let startDate: Date;
    let endDate: Date;
    let label: string;
    
    if (periodFilter === 'dia') {
      startDate = currentDate;
      endDate = currentDate;
      label = isToday(currentDate) ? 'Hoje' : format(currentDate, 'dd/MM/yyyy');
    } 
    else if (periodFilter === 'semana') {
      startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
      endDate = endOfWeek(currentDate, { weekStartsOn: 0 });
      label = `${format(startDate, 'dd/MM')} - ${format(endDate, 'dd/MM/yyyy')}`;
    } 
    else {
      startDate = startOfMonth(currentDate);
      endDate = endOfMonth(currentDate);
      label = format(currentDate, 'MMMM yyyy', { locale: ptBR });
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      label
    };
  };
  
  const dateRange = getDateRange();
  
  // Navegação entre períodos
  const goToPreviousPeriod = () => {
    if (periodFilter === 'dia') {
      setCurrentDate(prev => addDays(prev, -1));
    } else if (periodFilter === 'semana') {
      setCurrentDate(prev => subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => subMonths(prev, 1));
    }
  };
  
  const goToNextPeriod = () => {
    if (periodFilter === 'dia') {
      setCurrentDate(prev => addDays(prev, 1));
    } else if (periodFilter === 'semana') {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => addMonths(prev, 1));
    }
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Buscar agendamentos para o período selecionado
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['professional-appointments', dateRange.startDate, dateRange.endDate],
    queryFn: () => appointmentService.getAppointmentsByProfessionalId(
      user?.professionalId || '',
      dateRange.startDate,
      dateRange.endDate
    )
  });
  
  // Agrupar agendamentos por data
  const appointmentsByDate: Record<string, Appointment[]> = {};
  appointments.forEach(appointment => {
    if (!appointmentsByDate[appointment.date]) {
      appointmentsByDate[appointment.date] = [];
    }
    appointmentsByDate[appointment.date].push(appointment);
  });
  
  // Ordenar datas
  const sortedDates = Object.keys(appointmentsByDate).sort();
  
  // Lista de filtros predefinidos
  const predefinedFilters = [
    { label: 'Hoje', value: 'today' },
    { label: 'Esta semana', value: 'this-week' },
    { label: 'Este mês', value: 'this-month' },
    { label: 'Semana passada', value: 'last-week' },
    { label: 'Mês passado', value: 'last-month' },
  ];
  
  // Aplicar filtro predefinido
  const applyPredefinedFilter = (filter: string) => {
    const today = new Date();
    
    switch (filter) {
      case 'today':
        setPeriodFilter('dia');
        setCurrentDate(today);
        break;
      case 'this-week':
        setPeriodFilter('semana');
        setCurrentDate(today);
        break;
      case 'this-month':
        setPeriodFilter('mes');
        setCurrentDate(today);
        break;
      case 'last-week':
        setPeriodFilter('semana');
        setCurrentDate(subWeeks(today, 1));
        break;
      case 'last-month':
        setPeriodFilter('mes');
        setCurrentDate(subMonths(today, 1));
        break;
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <AuthHeader title="Agenda" />
      
      <div className="flex-1 page-container py-6">
        {/* Controles de navegação e filtros */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={goToPreviousPeriod}
              >
                <ChevronLeft size={18} />
              </Button>
              
              <div className="text-lg font-semibold">{dateRange.label}</div>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={goToNextPeriod}
              >
                <ChevronRight size={18} />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={goToToday}
              >
                Hoje
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Select
                value={periodFilter}
                onValueChange={(value: 'dia' | 'semana' | 'mes') => setPeriodFilter(value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Visualização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dia">Dia</SelectItem>
                  <SelectItem value="semana">Semana</SelectItem>
                  <SelectItem value="mes">Mês</SelectItem>
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter size={18} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <div className="p-2 space-y-1">
                    {predefinedFilters.map(filter => (
                      <Button
                        key={filter.value}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => applyPredefinedFilter(filter.value)}
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        {/* Lista de agendamentos */}
        {isLoading ? (
          <div className="flex justify-center p-8">
            <p>Carregando agendamentos...</p>
          </div>
        ) : sortedDates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Calendar size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500">Nenhum agendamento encontrado</p>
          </div>
        ) : (
          sortedDates.map(date => (
            <div key={date} className="mb-6">
              <h3 className="text-md font-semibold mb-3 text-barber-dark">
                {formatDate(date)}
              </h3>
              
              <div className="space-y-3">
                {appointmentsByDate[date]
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map(appointment => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onClick={() => navigate(`/portal/agenda/${appointment.id}`)}
                    />
                  ))
                }
              </div>
            </div>
          ))
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default PortalAgendaPage;
