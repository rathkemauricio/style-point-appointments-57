
import React from 'react';
import { Appointment } from '../models/appointment.model';
import { formatDate, formatTime } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatUtils';

interface AppointmentCardProps {
  appointment: Appointment;
  onClick?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onClick }) => {
  const statusClasses = {
    pending: 'appointment-card pending',
    confirmed: 'appointment-card confirmed',
    cancelled: 'appointment-card cancelled',
    completed: 'appointment-card'
  };
  
  const statusLabels = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    cancelled: 'Cancelado',
    completed: 'Finalizado'
  };
  
  const serviceNames = appointment.services 
    ? appointment.services.map(s => s.name).join(', ') 
    : '';
  
  return (
    <div className={statusClasses[appointment.status]} onClick={onClick}>
      <div className="flex justify-between">
        <div>
          <span className="block text-sm font-semibold">
            {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
          </span>
          <span className="block text-barber-dark font-medium mt-1">
            {appointment.customer?.name || 'Cliente'}
          </span>
        </div>
        
        <div className="text-right">
          <span className="text-sm font-medium text-barber-dark">
            {formatDate(appointment.date)}
          </span>
          <span className="block text-sm mt-1 font-semibold text-barber-primary">
            {formatCurrency(appointment.totalPrice)}
          </span>
        </div>
      </div>
      
      <div className="mt-2 text-sm text-gray-600">{serviceNames}</div>
      
      <div className="mt-2 flex justify-between items-center">
        <span className="text-xs">
          {appointment.professional ? appointment.professional.name : 'Profissional não definido'}
        </span>
        
        <span className={`text-xs px-2 py-1 rounded-full ${
          appointment.status === 'confirmed' ? 'bg-barber-success/20 text-barber-success' : 
          appointment.status === 'cancelled' ? 'bg-barber-error/20 text-barber-error' : 
          appointment.status === 'completed' ? 'bg-gray-200 text-gray-700' :
          'bg-barber-warning/20 text-barber-warning'
        }`}>
          {statusLabels[appointment.status]}
        </span>
      </div>
    </div>
  );
};

export default AppointmentCard;
