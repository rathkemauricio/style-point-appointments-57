import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './use-auth';
import userSettingsService from '../services/user-settings.service';
import { UserSettings } from '../models/user-settings.model';

interface SettingsContextType {
  settings: UserSettings | null;
  updateSettings: (newSettings: UserSettings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    if (user?.id) {
      const savedSettings = userSettingsService.getSettings(user.id);
      if (savedSettings) {
        setSettings(savedSettings);
        userSettingsService.applyColorTheme(savedSettings.theme);
      }
    }
  }, [user]);

  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    userSettingsService.saveSettings(newSettings);
    userSettingsService.applyColorTheme(newSettings.theme);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
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