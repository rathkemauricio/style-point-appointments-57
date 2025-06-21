
import React from 'react';
import { User, Settings, LogOut, Scissors, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '../hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Professional } from '../models/professional.model';
import { useQuery } from '@tanstack/react-query';
import professionalService from '../services/professional.service';

const UserProfileMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Obter detalhes do profissional
  const { data: professional } = useQuery({
    queryKey: ['professional', user?.professionalId],
    queryFn: () => professionalService.getProfessionalById(user?.professionalId || ''),
    enabled: !!user?.professionalId,
  });
  
  if (!user) {
    return (
      <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
        Login
      </Button>
    );
  }
  
  // Obter as iniciais do nome do profissional para o fallback do avatar
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={professional?.avatarUrl} 
              alt={professional?.name || "Usuário"} 
            />
            <AvatarFallback>
              {professional ? getInitials(professional.name) : "??"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{professional?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {professional?.title || "Profissional"}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => navigate('/portal')}>
          <User className="mr-2 h-4 w-4" />
          <span>Portal</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/portal/services')}>
          <Scissors className="mr-2 h-4 w-4" />
          <span>Meus Serviços</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/portal/agenda')}>
          <Calendar className="mr-2 h-4 w-4" />
          <span>Agenda</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/portal/revenue')}>
          <DollarSign className="mr-2 h-4 w-4" />
          <span>Faturamento</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/portal/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;
