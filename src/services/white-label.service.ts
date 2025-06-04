import { WhiteLabelConfig, defaultConfig } from '../config/whiteLabel';

class WhiteLabelService {
  private readonly CONFIG_KEY = 'white_label_config';
  private readonly BUSINESS_CONFIG_KEY = 'business_config';

  /**
   * Obter configuração do white label
   */
  getConfig(): WhiteLabelConfig {
    try {
      const configJson = localStorage.getItem(this.CONFIG_KEY);
      return configJson ? JSON.parse(configJson) : defaultConfig;
    } catch (error) {
      console.error('Erro ao obter configuração do white label:', error);
      return defaultConfig;
    }
  }

  /**
   * Salvar configuração do white label (apenas admin)
   */
  saveConfig(config: WhiteLabelConfig): void {
    try {
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
      this.applyTheme(config.theme);
    } catch (error) {
      console.error('Erro ao salvar configuração do white label:', error);
    }
  }

  /**
   * Obter configuração específica do negócio
   */
  getBusinessConfig(businessId: string): Partial<WhiteLabelConfig> | null {
    try {
      const configsJson = localStorage.getItem(this.BUSINESS_CONFIG_KEY);
      const configs = configsJson ? JSON.parse(configsJson) : {};
      return configs[businessId] || null;
    } catch (error) {
      console.error('Erro ao obter configuração do negócio:', error);
      return null;
    }
  }

  /**
   * Salvar configuração específica do negócio
   */
  saveBusinessConfig(businessId: string, config: Partial<WhiteLabelConfig>): void {
    try {
      const configsJson = localStorage.getItem(this.BUSINESS_CONFIG_KEY);
      const configs = configsJson ? JSON.parse(configsJson) : {};
      configs[businessId] = config;
      localStorage.setItem(this.BUSINESS_CONFIG_KEY, JSON.stringify(configs));
      
      // Se houver configurações de tema, aplicá-las
      if (config.theme) {
        this.applyTheme(config.theme);
      }
    } catch (error) {
      console.error('Erro ao salvar configuração do negócio:', error);
    }
  }

  /**
   * Aplicar tema
   */
  private applyTheme(theme: WhiteLabelConfig['theme']): void {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const colors = isDarkMode ? theme.colors.dark : theme.colors.light;

    // Aplicar cores
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--secondary-color', colors.secondary);
    document.documentElement.style.setProperty('--accent-color', colors.accent);

    // Aplicar fonte principal
    if (theme.fonts.primary) {
      document.documentElement.style.setProperty('--font-primary', theme.fonts.primary);
    }

    // Aplicar fonte secundária se existir
    if (theme.fonts.secondary) {
      document.documentElement.style.setProperty('--font-secondary', theme.fonts.secondary);
    }

    // Aplicar border radius se especificado
    if (theme.borderRadius) {
      document.documentElement.style.setProperty('--radius', theme.borderRadius);
    }
  }

  /**
   * Resetar configurações para o padrão
   */
  resetConfig(): void {
    localStorage.removeItem(this.CONFIG_KEY);
    this.applyTheme(defaultConfig.theme);
  }
}

export default new WhiteLabelService(); 