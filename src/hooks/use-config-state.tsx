
import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { useSettings } from './use-settings';
import { UserSettings } from '../models/user-settings.model';

export const useConfigState = () => {
  const { user } = useAuth();
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

  return {
    // States
    darkMode,
    setDarkMode,
    notificationsEnabled,
    setNotificationsEnabled,
    appointmentReminders,
    setAppointmentReminders,
    reviewNotifications,
    setReviewNotifications,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    workDays,
    setWorkDays,
    selectedColorTheme,
    setSelectedColorTheme,
    
    // User info
    user,
    isProfessional,
    isAdmin,
    canCustomizeAppearance,
    
    // Functions
    saveSettings,
    updateSettings,
  };
};
