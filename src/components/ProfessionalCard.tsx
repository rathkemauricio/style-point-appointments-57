
import React from 'react';
import { Professional } from '../models/professional.model';

interface ProfessionalCardProps {
  professional: Professional;
  selected?: boolean;
  onSelect?: () => void;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ 
  professional, 
  selected = false,
  onSelect
}) => {
  const defaultAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80';
  
  return (
    <div 
      className={`
        card-shadow flex items-center p-3 mb-3 cursor-pointer hover:shadow-lg transition-all
        ${selected ? 'border-2 border-barber-accent' : ''}
      `}
      onClick={onSelect}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <img 
          src={professional.avatarUrl || defaultAvatar}
          alt={professional.name}
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="ml-3">
        <h3 className="font-medium text-barber-dark">{professional.name}</h3>
        <p className="text-xs text-barber-dark/70">{professional.title}</p>
      </div>
    </div>
  );
};

export default ProfessionalCard;
