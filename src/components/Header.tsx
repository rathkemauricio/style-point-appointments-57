import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBackButton = false, 
  rightAction
}) => {
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-100 px-4 py-3 flex items-center">
      <div className="flex-1 flex items-center">
        {showBackButton && (
          <button 
            onClick={handleGoBack}
            className="p-1 mr-2 rounded-full hover:bg-gray-100"
            aria-label="Voltar"
          >
            <ArrowLeft size={22} style={{ color: 'var(--primary-color)' }} />
          </button>
        )}
        <h1 
          className="text-lg font-semibold cursor-pointer" 
          onClick={() => navigate('/')}
          style={{ color: 'var(--primary-color)' }}
        >
          {title}
        </h1>
      </div>
      
      {rightAction && (
        <div>
          {rightAction}
        </div>
      )}
    </div>
  );
};

export default Header;
