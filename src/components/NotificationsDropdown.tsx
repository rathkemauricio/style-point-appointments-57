
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Notification } from '../models/notification.model';
import notificationService from '../services/notification.service';
import { useToast } from '../hooks/use-toast';

const NotificationsDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Carregar notificações
  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Carregar notificações inicialmente e quando o dropdown for aberto
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);
  
  // Número de notificações não lidas
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Marcar como lida e navegar para o link
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await notificationService.markAsRead(notification.id);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
    }
    
    if (notification.link) {
      navigate(notification.link);
    }
    
    setIsOpen(false);
  };
  
  // Marcar todas como lidas
  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast({
        title: "Notificações",
        description: "Todas as notificações foram marcadas como lidas",
      });
    } catch (error) {
      console.error('Erro ao marcar notificações como lidas:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          Notificações
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isLoading}
              className="text-xs"
            >
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="py-2 px-4 text-center text-sm text-muted-foreground">
            Carregando...
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`cursor-pointer flex flex-col items-start px-4 py-3 ${
                !notification.isRead ? 'bg-muted' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex justify-between w-full mb-1">
                <span className="font-medium">{notification.title}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span className="text-sm">{notification.message}</span>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="py-2 px-4 text-center text-sm text-muted-foreground">
            Nenhuma notificação
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
