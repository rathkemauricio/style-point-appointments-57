
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './use-auth';
import userSettingsService from '../services/user-settings.service';
import { UserSettings } from '../models/user-settings.model';

interface SettingsContextType {
  settings: UserSettings | null;
  updateSettings: (newSettings: UserSettings) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Carrega as configurações quando o usuário está disponível
  useEffect(() => {
    if (user?.id) {
      const savedSettings = userSettingsService.getSettings(user.id);
      if (savedSettings) {
        setSettings(savedSettings);
        setIsDarkMode(savedSettings.theme.isDarkMode);
        userSettingsService.applyDarkMode(savedSettings.theme.isDarkMode);
      } else {
        // Configurações padrão se não existirem
        const defaultSettings: UserSettings = {
          userId: user.id,
          theme: {
            colorTheme: 0,
            isDarkMode: false
          },
          notifications: {
            enabled: true,
            appointments: true,
            reviews: true
          }
        };
        setSettings(defaultSettings);
        setIsDarkMode(false);
        userSettingsService.saveSettings(defaultSettings);
      }
    }
  }, [user]);

  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    setIsDarkMode(newSettings.theme.isDarkMode);
    userSettingsService.saveSettings(newSettings);
    userSettingsService.applyDarkMode(newSettings.theme.isDarkMode);
  };

  const toggleDarkMode = () => {
    if (!user?.id || !settings) return;

    const newDarkMode = !isDarkMode;
    const newSettings: UserSettings = {
      ...settings,
      theme: {
        ...settings.theme,
        isDarkMode: newDarkMode
      }
    };

    updateSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSettings, 
      toggleDarkMode,
      isDarkMode 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
