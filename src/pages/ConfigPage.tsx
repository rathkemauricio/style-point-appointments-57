
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/use-auth';
import { useConfigState } from '../hooks/use-config-state';
import { UserSettings } from '../models/user-settings.model';
import { AppearanceSection } from '../components/config/AppearanceSection';
import { NotificationsSection } from '../components/config/NotificationsSection';
import { WorkHoursSection } from '../components/config/WorkHoursSection';
import { AccountSection } from '../components/config/AccountSection';

const ConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const {
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
    canCustomizeAppearance,
    
    // Functions
    saveSettings,
    updateSettings,
  } = useConfigState();
  
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
          <AppearanceSection
            darkMode={darkMode}
            selectedColorTheme={selectedColorTheme}
            canCustomizeAppearance={canCustomizeAppearance}
            user={user}
            onToggleDarkMode={handleToggleDarkMode}
            onApplyColorTheme={handleApplyColorTheme}
          />
          
          {/* Notificações */}
          <NotificationsSection
            notificationsEnabled={notificationsEnabled}
            appointmentReminders={appointmentReminders}
            reviewNotifications={reviewNotifications}
            onNotificationsChange={(checked) => {
              setNotificationsEnabled(checked);
              saveSettings();
            }}
            onAppointmentRemindersChange={(checked) => {
              setAppointmentReminders(checked);
              saveSettings();
            }}
            onReviewNotificationsChange={(checked) => {
              setReviewNotifications(checked);
              saveSettings();
            }}
          />
          
          {/* Preferências de Agenda - Apenas para profissionais */}
          {isProfessional && (
            <WorkHoursSection
              startTime={startTime}
              endTime={endTime}
              workDays={workDays}
              onStartTimeChange={(time) => {
                setStartTime(time);
                saveSettings();
              }}
              onEndTimeChange={(time) => {
                setEndTime(time);
                saveSettings();
              }}
              onToggleWorkDay={handleToggleWorkDay}
              onSaveWorkHours={saveSettings}
            />
          )}
          
          {/* Conta */}
          <AccountSection
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
