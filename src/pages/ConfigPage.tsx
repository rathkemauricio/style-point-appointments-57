
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Moon, Sun, PaintBucket, GanttChart, LogOut } from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../hooks/use-auth';

const ConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout, isAuthenticated } = useAuth();
  
  // Estados para as configurações
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [reviewNotifications, setReviewNotifications] = useState(true);
  
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast({
      title: "Tema alterado",
      description: `Modo ${!darkMode ? "escuro" : "claro"} ativado`,
    });
    // Aqui implementaríamos a lógica real de mudar o tema
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Configurações" showBackButton={true} />
      
      <div className="flex-1 page-container py-6">
        <div className="space-y-6">
          {/* Aparência */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Aparência</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-muted p-2 rounded-full">
                      {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                    </div>
                    <div>
                      <p className="font-medium">Modo escuro</p>
                      <p className="text-sm text-muted-foreground">Alterar o tema da aplicação</p>
                    </div>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={handleToggleDarkMode} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-muted p-2 rounded-full">
                      <PaintBucket size={18} />
                    </div>
                    <div>
                      <p className="font-medium">Cores do app</p>
                      <p className="text-sm text-muted-foreground">Personalizar as cores do app</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/config/cores')}>
                    Personalizar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Notificações */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Notificações</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-muted p-2 rounded-full">
                      <Bell size={18} />
                    </div>
                    <div>
                      <p className="font-medium">Notificações</p>
                      <p className="text-sm text-muted-foreground">Ativar ou desativar notificações</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                
                {notificationsEnabled && (
                  <div className="pl-10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Lembretes de agendamentos</p>
                        <p className="text-sm text-muted-foreground">Receber lembretes de agendamentos</p>
                      </div>
                      <Switch 
                        checked={appointmentReminders} 
                        onCheckedChange={setAppointmentReminders}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Novas avaliações</p>
                        <p className="text-sm text-muted-foreground">Receber notificações de novas avaliações</p>
                      </div>
                      <Switch 
                        checked={reviewNotifications}
                        onCheckedChange={setReviewNotifications}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Preferências de Agenda */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Preferências da Agenda</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-muted p-2 rounded-full">
                      <GanttChart size={18} />
                    </div>
                    <div>
                      <p className="font-medium">Horários de trabalho</p>
                      <p className="text-sm text-muted-foreground">Configurar horários disponíveis</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/config/horarios')}>
                    Configurar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Conta */}
          {isAuthenticated && (
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Conta</h2>
                
                <div className="space-y-4">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sair da conta
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="text-center text-xs text-muted-foreground">
            <p>Versão 1.0.0</p>
            <p>© 2025 Barbearia App</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ConfigPage;
