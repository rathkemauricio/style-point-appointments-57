
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useSettings } from '@/hooks/use-settings';
import { UserSettings } from '@/models/user-settings.model';

export const useConfigState = () => {
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

  const isProfessional = user?.role === 'professional';
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (settings) {
      setDarkModeLocal(settings.theme.isDarkMode);
      setNotificationsEnabled(settings.notifications.enabled);
      setAppointmentReminders(settings.notifications.appointments);
      setReviewNotifications(settings.notifications.reviews);
      if (isProfessional && settings.workHours) {
        setStartTime(settings.workHours.startTime);
        setEndTime(settings.workHours.endTime);
        setWorkDays(settings.workHours.workDays);
      }
    }
  }, [settings, isProfessional]);

  // Funções handlers para cada grupo de configurações
  const saveSettings = () => {
    if (!user?.id) return;
    const newSettings: UserSettings = {
      userId: user.id,
      theme: {
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

  return {
    // Estado dos settings
    user, isAuthenticated, isProfessional, isAdmin,
    // Aparência
    darkMode,
    // Notificações
    notificationsEnabled, appointmentReminders, reviewNotifications,
    // Agenda
    workDays, startTime, endTime,
    // Actions
    handleToggleDarkMode,
    handleToggleNotifications, handleToggleAppointments, handleToggleReviews,
    handleToggleWorkDay, handleStartTimeChange, handleEndTimeChange, handleSaveWorkHours,
    handleLogout
  };
};
