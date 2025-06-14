
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppearanceSettings from '../components/config/AppearanceSettings';
import NotificationSettings from '../components/config/NotificationSettings';
import WorkHoursSettings from '../components/config/WorkHoursSettings';
import AccountSettings from '../components/config/AccountSettings';
import { useToast } from '../components/ui/use-toast';
import { useAuth } from '../hooks/use-auth';
import { useSettings } from '../hooks/use-settings';
import { UserSettings } from '../models/user-settings.model';

const ConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout, isAuthenticated, user } = useAuth();
  const { settings, updateSettings, setDarkMode } = useSettings();

  const [darkMode, setDarkModeLocal] = useState<boolean>(settings?.theme.isDarkMode ?? false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(settings?.notifications.enabled ?? true);
  const [appointmentReminders, setAppointmentReminders] = useState<boolean>(settings?.notifications.appointments ?? true);
  const [reviewNotifications, setReviewNotifications] = useState<boolean>(settings?.notifications.reviews ?? true);
  const [startTime, setStartTime] = useState(settings?.workHours?.startTime || '09:00');
  const [endTime, setEndTime] = useState(settings?.workHours?.endTime || '19:00');
  const [workDays, setWorkDays] = useState(settings?.workHours?.workDays || {
    monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false,
  });
  const [selectedColorTheme, setSelectedColorTheme] = useState(settings?.theme.colorTheme || 0);

  const isProfessional = user?.role === 'professional';
  const isAdmin = user?.role === 'admin';
  const canCustomizeAppearance = isProfessional || isAdmin;

  useEffect(() => {
    if (settings) {
      setDarkModeLocal(settings.theme.isDarkMode);
      if (canCustomizeAppearance) setSelectedColorTheme(settings.theme.colorTheme);
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

  // Funções handlers para cada grupo de configurações
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
      workHours: isProfessional ? { startTime, endTime, workDays } : undefined
    };
    updateSettings(newSettings);
  };

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkModeLocal(newDarkMode);
    setDarkMode(newDarkMode);
    toast({
      title: "Tema alterado",
      description: `Modo ${newDarkMode ? "escuro" : "claro"} ativado`,
    });
  };
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
          startTime, endTime, workDays
        }
      };
      updateSettings(newSettings);
    }
    toast({
      title: "Tema de cores alterado",
      description: `Tema aplicado com sucesso`,
    });
  };
  const handleToggleNotifications = (checked: boolean) => {
    setNotificationsEnabled(checked);
    saveSettings();
  };
  const handleToggleAppointments = (checked: boolean) => {
    setAppointmentReminders(checked);
    saveSettings();
  };
  const handleToggleReviews = (checked: boolean) => {
    setReviewNotifications(checked);
    saveSettings();
  };
  const handleToggleWorkDay = (day: keyof typeof workDays) => {
    const newWorkDays = { ...workDays, [day]: !workDays[day] };
    setWorkDays(newWorkDays);
    saveSettings();
  };
  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    saveSettings();
  };
  const handleEndTimeChange = (value: string) => {
    setEndTime(value);
    saveSettings();
  };
  const handleSaveWorkHours = () => {
    saveSettings();
    toast({
      title: "Horários salvos",
      description: "Seus horários de trabalho foram atualizados",
    });
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
          <AppearanceSettings
            darkMode={darkMode}
            canCustomizeAppearance={canCustomizeAppearance}
            selectedColorTheme={selectedColorTheme}
            onToggleDarkMode={handleToggleDarkMode}
            onApplyColorTheme={handleApplyColorTheme}
          />
          {/* Notificações */}
          <NotificationSettings
            notificationsEnabled={notificationsEnabled}
            appointmentReminders={appointmentReminders}
            reviewNotifications={reviewNotifications}
            onToggleNotifications={handleToggleNotifications}
            onToggleAppointments={handleToggleAppointments}
            onToggleReviews={handleToggleReviews}
          />
          {/* Preferências de Agenda - Apenas para profissionais */}
          {isProfessional && (
            <WorkHoursSettings
              workDays={workDays}
              startTime={startTime}
              endTime={endTime}
              onToggleWorkDay={handleToggleWorkDay}
              onStartTimeChange={handleStartTimeChange}
              onEndTimeChange={handleEndTimeChange}
              onSave={handleSaveWorkHours}
            />
          )}
          {/* Conta */}
          <AccountSettings
            user={user}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
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
