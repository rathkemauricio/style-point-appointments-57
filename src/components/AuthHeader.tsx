
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import UserProfileMenu from './UserProfileMenu';
import NotificationsDropdown from './NotificationsDropdown';
import appConfig from '../config/appConfig';

interface AuthHeaderProps {
  title: string;
  showBackButton?: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ 
  title, 
  showBackButton = false 
}) => {
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b p-4 shadow-sm">
      <div className="container mx-auto max-w-7xl flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex items-center">
            <img 
              src={appConfig.business.logoUrl} 
              alt="Logo" 
              className="h-8 w-8 rounded-full object-cover mr-3" 
            />
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <NotificationsDropdown />
          <UserProfileMenu />
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
