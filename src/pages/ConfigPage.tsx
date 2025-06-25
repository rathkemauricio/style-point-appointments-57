
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import AppearanceSection from "../components/config/sections/AppearanceSection";
import NotificationSection from "../components/config/sections/NotificationSection";
import WorkHoursSection from "../components/config/sections/WorkHoursSection";
import AccountSection from "../components/config/sections/AccountSection";
import { useConfigState } from "../components/config/sections/useConfigState";

const ConfigPage: React.FC = () => {
  const state = useConfigState();

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Configurações" showBackButton={true} />
      <div className="flex-1 page-container py-6">
        <div className="space-y-6">
          {/* Aparência */}
          <AppearanceSection
            darkMode={state.darkMode}
            onToggleDarkMode={state.handleToggleDarkMode}
          />
          {/* Notificações */}
          <NotificationSection
            notificationsEnabled={state.notificationsEnabled}
            appointmentReminders={state.appointmentReminders}
            reviewNotifications={state.reviewNotifications}
            onToggleNotifications={state.handleToggleNotifications}
            onToggleAppointments={state.handleToggleAppointments}
            onToggleReviews={state.handleToggleReviews}
          />
          {/* Preferências de Agenda - Apenas para profissionais */}
          {state.isProfessional && (
            <WorkHoursSection
              workDays={state.workDays}
              startTime={state.startTime}
              endTime={state.endTime}
              onToggleWorkDay={state.handleToggleWorkDay}
              onStartTimeChange={state.handleStartTimeChange}
              onEndTimeChange={state.handleEndTimeChange}
              onSave={state.handleSaveWorkHours}
            />
          )}
          {/* Conta */}
          <AccountSection
            user={state.user}
            isAuthenticated={state.isAuthenticated}
            onLogout={state.handleLogout}
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
