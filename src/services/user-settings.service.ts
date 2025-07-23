
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
   * Aplicar apenas o dark mode
   */
  applyTheme(theme: UserSettings['theme']): void {
    const html = document.documentElement;
    if (theme.isDarkMode) {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
    } else {
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
    }
  }
}

export default new UserSettingsService();
