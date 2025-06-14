
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/use-auth';
import { useSettings } from '../hooks/use-settings';
import { AppearanceSection } from '../components/config/AppearanceSection';
import { NotificationsSection } from '../components/config/NotificationsSection';
import { WorkHoursSection } from '../components/config/WorkHoursSection';
import { AccountSection } from '../components/config/AccountSection';

const ConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated, user } = useAuth();
  const { isDarkMode, toggleDarkMode, settings, updateSettings } = useSettings();
  
  // Verificar se é profissional
  const isProfessional = user?.role === 'professional';

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
            darkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />
          
          {/* Notificações */}
          {settings && (
            <NotificationsSection
              notificationsEnabled={settings.notifications.enabled}
              appointmentReminders={settings.notifications.appointments}
              reviewNotifications={settings.notifications.reviews}
              onNotificationsChange={(checked) => {
                const newSettings = {
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    enabled: checked
                  }
                };
                updateSettings(newSettings);
              }}
              onAppointmentRemindersChange={(checked) => {
                const newSettings = {
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    appointments: checked
                  }
                };
                updateSettings(newSettings);
              }}
              onReviewNotificationsChange={(checked) => {
                const newSettings = {
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    reviews: checked
                  }
                };
                updateSettings(newSettings);
              }}
            />
          )}
          
          {/* Preferências de Agenda - Apenas para profissionais */}
          {isProfessional && settings?.workHours && (
            <WorkHoursSection
              startTime={settings.workHours.startTime}
              endTime={settings.workHours.endTime}
              workDays={settings.workHours.workDays}
              onStartTimeChange={(time) => {
                const newSettings = {
                  ...settings,
                  workHours: {
                    ...settings.workHours!,
                    startTime: time
                  }
                };
                updateSettings(newSettings);
              }}
              onEndTimeChange={(time) => {
                const newSettings = {
                  ...settings,
                  workHours: {
                    ...settings.workHours!,
                    endTime: time
                  }
                };
                updateSettings(newSettings);
              }}
              onToggleWorkDay={(day) => {
                const newSettings = {
                  ...settings,
                  workHours: {
                    ...settings.workHours!,
                    workDays: {
                      ...settings.workHours!.workDays,
                      [day]: !settings.workHours!.workDays[day]
                    }
                  }
                };
                updateSettings(newSettings);
              }}
              onSaveWorkHours={() => {
                // Já salva automaticamente no updateSettings
              }}
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
