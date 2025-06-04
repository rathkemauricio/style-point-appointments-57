import React from 'react';
import { Appointment } from '../models/appointment.model';
import { formatDate, formatTime } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatUtils';

interface AppointmentCardProps {
  appointment: Appointment;
  onClick?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onClick }) => {
  const getStatusClasses = (status: string) => {
    const baseClasses = 'card-shadow p-4 mb-4 cursor-pointer transition-all';
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-warning/10`;
      case 'confirmed':
        return `${baseClasses} bg-success/10`;
      case 'cancelled':
        return `${baseClasses} bg-error/10`;
      default:
        return baseClasses;
    }
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
    <div className={getStatusClasses(appointment.status)} onClick={onClick}>
      <div className="flex justify-between">
        <div>
          <span className="block text-sm font-semibold text-primary">
            {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
          </span>
          <span className="block font-medium mt-1">
            {appointment.customer?.name || 'Cliente'}
          </span>
        </div>
        
        <div className="text-right">
          <span className="text-sm font-medium">
            {formatDate(appointment.date)}
          </span>
          <span className="block text-sm mt-1 font-semibold text-primary">
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
          appointment.status === 'confirmed' ? 'bg-success/20 text-success' : 
          appointment.status === 'cancelled' ? 'bg-error/20 text-error' : 
          appointment.status === 'completed' ? 'bg-gray-200 text-gray-700' :
          'bg-warning/20 text-warning'
        }`}>
          {statusLabels[appointment.status]}
        </span>
      </div>
    </div>
  );
};

export default AppointmentCard;
