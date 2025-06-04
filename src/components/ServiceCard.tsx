import React from 'react';
import { Service } from '../models/service.model';
import { formatCurrency } from '../utils/formatUtils';
import { formatDuration } from '../utils/formatUtils';

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  onSelect?: () => void;
  selectable?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  selected = false,
  onSelect,
  selectable = false
}) => {
  const handleClick = () => {
    if (selectable && onSelect) {
      onSelect();
    }
  };
  
  return (
    <div 
      className={`
        card-shadow mb-4 transition-all
        ${selectable ? 'cursor-pointer hover:shadow-lg transform hover:-translate-y-1' : ''}
        ${selected ? 'border-2 border-accent' : ''}
      `}
      onClick={handleClick}
    >
      <div className="flex">
        {service.imageUrl && (
          <div className="w-24 h-24 overflow-hidden">
            <img 
              src={service.imageUrl} 
              alt={service.name}
              className="w-full h-full object-cover" 
            />
          </div>
        )}
        <div className="flex-1 p-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold text-primary">{service.name}</h3>
            <span className="font-bold text-primary">{formatCurrency(service.price)}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              Duração: {formatDuration(service.durationMinutes)}
            </span>
            {service.category && (
              <span className="bg-secondary text-xs px-2 py-1 rounded-full text-primary">
                {service.category}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
