
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Moon, Sun, PaintBucket, Clock, LogOut, Save } from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { useToast } from '../components/ui/use-toast';
import { useAuth } from '../hooks/use-auth';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { TimePickerInput } from '../components/TimePickerInput';
import { Toggle } from '../components/ui/toggle';

const colorOptions = [
  { name: 'Roxo', primary: '#8B5CF6', secondary: '#E5DEFF', accent: '#7E69AB' },
  { name: 'Azul', primary: '#0EA5E9', secondary: '#D3E4FD', accent: '#3B82F6' },
  { name: 'Verde', primary: '#10B981', secondary: '#F2FCE2', accent: '#059669' },
  { name: 'Laranja', primary: '#F97316', secondary: '#FDE1D3', accent: '#EA580C' },
  { name: 'Rosa', primary: '#D946EF', secondary: '#FFDEE2', accent: '#EC4899' },
];

const ConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout, isAuthenticated, user } = useAuth();
  
  // Estados para as configurações
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [reviewNotifications, setReviewNotifications] = useState(true);
  
  // Estados para horários de trabalho
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('19:00');
  const [workDays, setWorkDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false,
  });
  
  // Estado para o tema de cores
  const [selectedColorTheme, setSelectedColorTheme] = useState(0);
  
  // Efeito para aplicar o modo escuro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Handle para trocar o modo escuro/claro
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast({
      title: "Tema alterado",
      description: `Modo ${!darkMode ? "escuro" : "claro"} ativado`,
    });
  };
  
  // Handle para alternar dias de trabalho
  const handleToggleWorkDay = (day: keyof typeof workDays) => {
    setWorkDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };
  
  // Handle para salvar horários de trabalho
  const handleSaveWorkHours = () => {
    toast({
      title: "Horários salvos",
      description: `Seus horários de trabalho foram atualizados`,
    });
    
    // Aqui seria o lugar para salvar no backend
    console.log({
      workDays,
      startTime,
      endTime
    });
  };
  
  // Handle para aplicar tema de cores
  const handleApplyColorTheme = (index: number) => {
    setSelectedColorTheme(index);
    
    // Aqui poderíamos alterar as variáveis CSS
    const theme = colorOptions[index];
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    document.documentElement.style.setProperty('--accent-color', theme.accent);
    
    toast({
      title: "Tema de cores alterado",
      description: `Tema "${theme.name}" aplicado com sucesso`,
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
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="end-time">Horário final</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
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
          
          {/* Conta */}
          {isAuthenticated && (
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Conta</h2>
                
                {user && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Logado como:</p>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm">{user.email}</p>
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
