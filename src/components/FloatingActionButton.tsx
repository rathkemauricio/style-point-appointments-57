
import React from 'react';
import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick, icon = <Plus size={24} /> }) => {
  return (
    <button 
      className="floating-action-button"
      onClick={onClick}
      aria-label="Nova ação"
    >
      {icon}
    </button>
  );
};

export default FloatingActionButton;
