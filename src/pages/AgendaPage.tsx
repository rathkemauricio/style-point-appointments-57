
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Plus } from "lucide-react";

import Header from '../components/Header';
import Footer from '../components/Footer';
import AppointmentCard from '../components/AppointmentCard';
import FloatingActionButton from '../components/FloatingActionButton';
import appointmentService from '../services/appointment.service';
import { formatDate, getTimePeriod } from '../utils/dateUtils';
import { Appointment } from '../models/appointment.model';

const AgendaPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month'>('day');
  
  // Get date ranges based on selected period
  const { startDate, endDate } = getTimePeriod(activeTab);
  
  // Fetch appointments for the selected period
  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments', startDate, endDate],
    queryFn: async () => {
      return await appointmentService.getAppointments(startDate, endDate);
    }
  });
  
  // Group appointments by date
  const appointmentsByDate: Record<string, Appointment[]> = {};
  appointments.forEach(appointment => {
    if (!appointmentsByDate[appointment.date]) {
      appointmentsByDate[appointment.date] = [];
    }
    appointmentsByDate[appointment.date].push(appointment);
  });
  
  // Sort dates for rendering
  const sortedDates = Object.keys(appointmentsByDate).sort();
  
  const handleNewAppointment = () => {
    navigate('/agendar');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Agenda" />
      
      <div className="flex-1 page-container">
        {/* Period Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'day' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('day')}
          >
            Hoje
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'week' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('week')}
          >
            Semana
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'month' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('month')}
          >
            Mês
          </button>
        </div>
        
        {/* Appointments List */}
        {sortedDates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Calendar size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500">Nenhum agendamento encontrado</p>
            <button
              className="mt-4 text-barber-accent"
              onClick={handleNewAppointment}
            >
              Criar novo agendamento
            </button>
          </div>
        ) : (
          sortedDates.map(date => (
            <div key={date} className="mb-6">
              <h3 className="text-md font-semibold mb-3 text-barber-dark">
                {formatDate(date)}
              </h3>
              
              <div>
                {appointmentsByDate[date]
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map(appointment => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onClick={() => navigate(`/agenda/${appointment.id}`)}
                    />
                  ))
                }
              </div>
            </div>
          ))
        )}
      </div>
      
      <FloatingActionButton
        onClick={handleNewAppointment}
        icon={<Plus size={24} />}
      />
      
      <Footer />
    </div>
  );
};

export default AgendaPage;
