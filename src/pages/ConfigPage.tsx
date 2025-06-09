import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Moon, Sun, PaintBucket, Clock, LogOut, Save } from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/use-toast';
import { useAuth } from '../hooks/use-auth';
import { useSettings } from '../hooks/use-settings';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Toggle } from '../components/ui/toggle';
import { UserSettings } from '../models/user-settings.model';

const colorOptions = [
  { name: 'Caramelo', primary: '#C4804E', secondary: '#FBE6D4', accent: '#8B4513' },
  { name: 'Azul Profissional', primary: '#3B82F6', secondary: '#1E293B', accent: '#06B6D4' },
  { name: 'Verde Esmeralda', primary: '#10B981', secondary: '#064E3B', accent: '#34D399' },
  { name: 'Roxo Elegante', primary: '#8B5CF6', secondary: '#4C1D95', accent: '#A78BFA' },
  { name: 'Azul Marinho', primary: '#1E40AF', secondary: '#1E3A8A', accent: '#3B82F6' },
];

const ConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout, isAuthenticated, user } = useAuth();
  const { settings, updateSettings } = useSettings();
  
  // Estados para as configurações
  const [darkMode, setDarkMode] = useState<boolean>(settings?.theme.isDarkMode ?? false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(settings?.notifications.enabled ?? true);
  const [appointmentReminders, setAppointmentReminders] = useState<boolean>(settings?.notifications.appointments ?? true);
  const [reviewNotifications, setReviewNotifications] = useState<boolean>(settings?.notifications.reviews ?? true);
  
  // Estados para horários de trabalho (apenas para profissionais)
  const [startTime, setStartTime] = useState(settings?.workHours?.startTime || '09:00');
  const [endTime, setEndTime] = useState(settings?.workHours?.endTime || '19:00');
  const [workDays, setWorkDays] = useState(settings?.workHours?.workDays || {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false,
  });
  
  // Estado para o tema de cores (apenas para profissionais e admins)
  const [selectedColorTheme, setSelectedColorTheme] = useState(settings?.theme.colorTheme || 0);

  // Verificar se é profissional ou admin
  const isProfessional = user?.role === 'professional';
  const isAdmin = user?.role === 'admin';
  const canCustomizeAppearance = isProfessional || isAdmin;

  // Atualizar estados quando as configurações mudarem
  useEffect(() => {
    if (settings) {
      setDarkMode(settings.theme.isDarkMode);
      if (canCustomizeAppearance) {
        setSelectedColorTheme(settings.theme.colorTheme);
      }
      setNotificationsEnabled(settings.notifications.enabled);
      setAppointmentReminders(settings.notifications.appointments);
      setReviewNotifications(settings.notifications.reviews);
      
      if (isProfessional && settings.workHours) {
        setStartTime(settings.workHours.startTime);
        setEndTime(settings.workHours.endTime);
        setWorkDays(settings.workHours.workDays);
      }
    }
  }, [settings, canCustomizeAppearance, isProfessional]);

  // Função auxiliar para salvar configurações
  const saveSettings = () => {
    if (!user?.id) return;

    const newSettings: UserSettings = {
      userId: user.id,
      theme: {
        colorTheme: canCustomizeAppearance ? selectedColorTheme : 0,
        isDarkMode: darkMode
      },
      notifications: {
        enabled: notificationsEnabled,
        appointments: appointmentReminders,
        reviews: reviewNotifications
      },
      workHours: isProfessional ? {
        startTime,
        endTime,
        workDays
      } : undefined
    };

    updateSettings(newSettings);
  };
  
  // Handle para trocar o modo escuro/claro
  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (user?.id) {
      const newSettings: UserSettings = {
        userId: user.id,
        theme: {
          colorTheme: selectedColorTheme,
          isDarkMode: newDarkMode
        },
        notifications: {
          enabled: notificationsEnabled,
          appointments: appointmentReminders,
          reviews: reviewNotifications
        },
        workHours: {
          startTime,
          endTime,
          workDays
        }
      };
      updateSettings(newSettings);
    }
    toast({
      title: "Tema alterado",
      description: `Modo ${newDarkMode ? "escuro" : "claro"} ativado`,
    });
  };
  
  // Handle para alternar dias de trabalho
  const handleToggleWorkDay = (day: keyof typeof workDays) => {
    const newWorkDays = {
      ...workDays,
      [day]: !workDays[day]
    };
    setWorkDays(newWorkDays);
    saveSettings();
  };
  
  // Handle para salvar horários de trabalho
  const handleSaveWorkHours = () => {
    saveSettings();
    toast({
      title: "Horários salvos",
      description: "Seus horários de trabalho foram atualizados",
    });
  };
  
  // Handle para aplicar tema de cores
  const handleApplyColorTheme = (index: number) => {
    setSelectedColorTheme(index);
    
    if (user?.id) {
      const newSettings: UserSettings = {
        userId: user.id,
        theme: {
          colorTheme: index,
          isDarkMode: darkMode
        },
        notifications: {
          enabled: notificationsEnabled,
          appointments: appointmentReminders,
          reviews: reviewNotifications
        },
        workHours: {
          startTime,
          endTime,
          workDays
        }
      };
      updateSettings(newSettings);
    }
    
    toast({
      title: "Tema de cores alterado",
      description: `Tema "${colorOptions[index].name}" aplicado com sucesso`,
    });
  };
  
  // Handle para logout
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
                
                {canCustomizeAppearance && (
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-muted p-2 rounded-full">
                        <PaintBucket size={18} />
                      </div>
                      <div>
                        <p className="font-medium">Cores do app</p>
                        <p className="text-sm text-muted-foreground">Personalizar as cores do app</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {colorOptions.map((color, index) => (
                        <button
                          key={index}
                          className={`w-full aspect-square rounded-full border-2 ${selectedColorTheme === index ? 'border-ring scale-110' : 'border-transparent'} transition-all`}
                          style={{ backgroundColor: color.primary }}
                          onClick={() => handleApplyColorTheme(index)}
                          aria-label={`Tema de cor ${color.name}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
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
                    onCheckedChange={(checked) => {
                      setNotificationsEnabled(checked);
                      saveSettings();
                    }}
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
                        onCheckedChange={(checked) => {
                          setAppointmentReminders(checked);
                          saveSettings();
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Novas avaliações</p>
                        <p className="text-sm text-muted-foreground">Receber notificações de novas avaliações</p>
                      </div>
                      <Switch 
                        checked={reviewNotifications}
                        onCheckedChange={(checked) => {
                          setReviewNotifications(checked);
                          saveSettings();
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Preferências de Agenda - Apenas para profissionais */}
          {isProfessional && (
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Horários de trabalho</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-muted p-2 rounded-full">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="font-medium">Definir horários</p>
                      <p className="text-sm text-muted-foreground">Configure seus dias e horários disponíveis</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Toggle 
                        pressed={workDays.monday}
                        onPressedChange={() => handleToggleWorkDay('monday')}
                        aria-label="Segunda-feira"
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                      >
                        Seg
                      </Toggle>
                      <Toggle 
                        pressed={workDays.tuesday}
                        onPressedChange={() => handleToggleWorkDay('tuesday')}
                        aria-label="Terça-feira"
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                      >
                        Ter
                      </Toggle>
                      <Toggle 
                        pressed={workDays.wednesday}
                        onPressedChange={() => handleToggleWorkDay('wednesday')}
                        aria-label="Quarta-feira"
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                      >
                        Qua
                      </Toggle>
                      <Toggle 
                        pressed={workDays.thursday}
                        onPressedChange={() => handleToggleWorkDay('thursday')}
                        aria-label="Quinta-feira"
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                      >
                        Qui
                      </Toggle>
                      <Toggle 
                        pressed={workDays.friday}
                        onPressedChange={() => handleToggleWorkDay('friday')}
                        aria-label="Sexta-feira"
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                      >
                        Sex
                      </Toggle>
                      <Toggle 
                        pressed={workDays.saturday}
                        onPressedChange={() => handleToggleWorkDay('saturday')}
                        aria-label="Sábado"
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                      >
                        Sáb
                      </Toggle>
                      <Toggle 
                        pressed={workDays.sunday}
                        onPressedChange={() => handleToggleWorkDay('sunday')}
                        aria-label="Domingo"
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                      >
                        Dom
                      </Toggle>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-time">Horário inicial</Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={startTime}
                          onChange={(e) => {
                            setStartTime(e.target.value);
                            saveSettings();
                          }}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="end-time">Horário final</Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={endTime}
                          onChange={(e) => {
                            setEndTime(e.target.value);
                            saveSettings();
                          }}
                        />
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveWorkHours} className="w-full">
                      <Save className="mr-2 h-4 w-4" /> Salvar horários
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Conta */}
          {isAuthenticated && (
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Conta</h2>
                
                {user && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Logado como:</p>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm">
                      {user.role === 'professional' ? 'Profissional' : 
                       user.role === 'admin' ? 'Administrador' : 'Cliente'}
                    </p>
                  </div>
                )}
                
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
