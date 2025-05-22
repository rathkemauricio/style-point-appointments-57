
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Settings, User } from "lucide-react";

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="app-footer">
      <div className="footer-nav">
        <div 
          className={`nav-item ${isActive('/') ? 'active' : ''}`} 
          onClick={() => navigate('/')}
        >
          <Home className="nav-item-icon" size={22} />
          <span className="nav-item-text">Home</span>
        </div>
        
        <div 
          className={`nav-item ${isActive('/agenda') ? 'active' : ''}`}
          onClick={() => navigate('/agenda')}
        >
          <Calendar className="nav-item-icon" size={22} />
          <span className="nav-item-text">Agenda</span>
        </div>
        
        <div 
          className={`nav-item ${isActive('/perfil') ? 'active' : ''}`}
          onClick={() => navigate('/perfil')}
        >
          <User className="nav-item-icon" size={22} />
          <span className="nav-item-text">Perfil</span>
        </div>
        
        <div 
          className={`nav-item ${isActive('/config') ? 'active' : ''}`}
          onClick={() => navigate('/config')}
        >
          <Settings className="nav-item-icon" size={22} />
          <span className="nav-item-text">Config</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
