
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './use-auth';
import userSettingsService from '../services/user-settings.service';
import { UserSettings } from '../models/user-settings.model';

interface SettingsContextType {
  settings: UserSettings | null;
  updateSettings: (newSettings: UserSettings) => void;
  setDarkMode: (isDark: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);

  // Função para aplicar tema
  const applyThemeSettings = (stgs: UserSettings) => {
    if (stgs?.theme) {
      userSettingsService.applyTheme(stgs.theme);
    }
  };

  // Carregar settings ao iniciar e aplicar tema
  useEffect(() => {
    if (user?.id) {
      const savedSettings = userSettingsService.getSettings(user.id);
      if (savedSettings) {
        setSettings(savedSettings);
        applyThemeSettings(savedSettings);
      } else {
        // Caso nunca tenha settings, seta padrão
        const defaultSettings: UserSettings = {
          userId: user.id,
          theme: { isDarkMode: false },
          notifications: {
            enabled: true,
            appointments: true,
            reviews: true,
          },
        };
        setSettings(defaultSettings);
        applyThemeSettings(defaultSettings);
        userSettingsService.saveSettings(defaultSettings);
      }
    }
  }, [user]);

  // Salva settings e aplica o tema escolhido
  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    userSettingsService.saveSettings(newSettings);
    applyThemeSettings(newSettings);
  };

  // Função isolada para trocar somente o dark mode
  const setDarkMode = (isDark: boolean) => {
    if (!settings) return;
    const updated = {
      ...settings,
      theme: {
        isDarkMode: isDark,
      },
    };
    updateSettings(updated);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, setDarkMode }}>
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
