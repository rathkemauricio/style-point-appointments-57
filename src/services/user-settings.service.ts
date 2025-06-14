
import { UserSettings } from '../models/user-settings.model';

/**
 * Nova paleta moderna, uso para claro/escuro:
 * Cada entrada contém { name, light: { primary, secondary, accent }, dark: { primary, secondary, accent } }
 */
export const COLOR_THEMES = [
  {
    name: 'Caramelo',
    light:  { primary: '#C4804E', secondary: '#FBE6D4', accent: '#8B4513' },
    dark:   { primary: '#C4804E', secondary: '#1E293B', accent: '#8B4513' }
  },
  {
    name: 'Azul Profissional',
    light:  { primary: '#3B82F6', secondary: '#E3EFFE', accent: '#06B6D4' },
    dark:   { primary: '#3B82F6', secondary: '#1E293B', accent: '#06B6D4' }
  },
  {
    name: 'Verde Esmeralda',
    light:  { primary: '#10B981', secondary: '#D1FAE5', accent: '#059669' },
    dark:   { primary: '#10B981', secondary: '#064E3B', accent: '#34D399' }
  },
  {
    name: 'Roxo Elegante',
    light:  { primary: '#8B5CF6', secondary: '#F3E8FF', accent: '#A78BFA' },
    dark:   { primary: '#8B5CF6', secondary: '#4C1D95', accent: '#A78BFA' }
  },
  {
    name: 'Azul Marinho',
    light:  { primary: '#1E40AF', secondary: '#DBEAFE', accent: '#3B82F6' },
    dark:   { primary: '#1E40AF', secondary: '#1E3A8A', accent: '#3B82F6' }
  }
];

class UserSettingsService {
  private readonly SETTINGS_KEY = 'user_settings';

  saveSettings(settings: UserSettings): void {
    try {
      const allSettings = this.getAllSettings();
      allSettings[settings.userId] = settings;
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(allSettings));
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  }

  getSettings(userId: string): UserSettings | null {
    try {
      const allSettings = this.getAllSettings();
      return allSettings[userId] || null;
    } catch (error) {
      console.error('Erro ao obter configurações:', error);
      return null;
    }
  }

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
   * Aplica as variáveis do tema na raiz do documento:
   * - Garante coerência entre claro/escuro para cada tema.
   * - Seta tokens semânticos: --primary-color, --secondary-color, --accent-color
   */
  applyColorTheme(theme: UserSettings['theme']): void {
    const colorIndex = theme.colorTheme ?? 0;
    const isDark = theme.isDarkMode;
    const palette = COLOR_THEMES[colorIndex] || COLOR_THEMES[0];
    const scheme = isDark ? palette.dark : palette.light;

    document.documentElement.style.setProperty('--primary-color', scheme.primary);
    document.documentElement.style.setProperty('--secondary-color', scheme.secondary);
    document.documentElement.style.setProperty('--accent-color', scheme.accent);

    // O restante do app depende apenas desses 3 tokens (configurados via CSS)
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

export default new UserSettingsService();
