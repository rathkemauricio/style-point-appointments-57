import { UserSettings } from '../models/user-settings.model';

class UserSettingsService {
  private readonly SETTINGS_KEY = 'user_settings';

  /**
   * Salvar configurações do usuário
   */
  saveSettings(settings: UserSettings): void {
    try {
      const allSettings = this.getAllSettings();
      allSettings[settings.userId] = settings;
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(allSettings));
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  }

  /**
   * Obter configurações de um usuário específico
   */
  getSettings(userId: string): UserSettings | null {
    try {
      const allSettings = this.getAllSettings();
      return allSettings[userId] || null;
    } catch (error) {
      console.error('Erro ao obter configurações:', error);
      return null;
    }
  }

  /**
   * Obter todas as configurações
   */
  private getAllSettings(): Record<string, UserSettings> {
    try {
      const settingsJson = localStorage.getItem(this.SETTINGS_KEY);
      return settingsJson ? JSON.parse(settingsJson) : {};
    } catch (error) {
      console.error('Erro ao obter todas as configurações:', error);
      return {};
    }
  }

  /**
   * Aplicar tema de cores
   */
  applyColorTheme(theme: UserSettings['theme']): void {
    const colors = [
      { primary: '#C4804E', secondary: '#FBE6D4', accent: '#8B4513' }, // Caramelo
      { primary: '#8B4513', secondary: '#2C1810', accent: '#C4804E' }, // Marrom escuro
      { primary: '#A0522D', secondary: '#DEB887', accent: '#8B4513' }, // Marrom médio
      { primary: '#D2691E', secondary: '#FFE4C4', accent: '#8B4513' }, // Marrom claro
      { primary: '#CD853F', secondary: '#F5DEB3', accent: '#8B4513' }, // Caramelo dourado
    ];

    const selectedTheme = colors[theme.colorTheme];
    if (selectedTheme) {
      document.documentElement.style.setProperty('--primary-color', selectedTheme.primary);
      document.documentElement.style.setProperty('--secondary-color', selectedTheme.secondary);
      document.documentElement.style.setProperty('--accent-color', selectedTheme.accent);
    }

    if (theme.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

export default new UserSettingsService(); 