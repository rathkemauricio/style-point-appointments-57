
import React from "react";
import AppearanceSettings from "../AppearanceSettings";

interface AppearanceSectionProps {
  darkMode: boolean;
  canCustomizeAppearance: boolean;
  selectedColorTheme: number;
  onToggleDarkMode: () => void;
  onApplyColorTheme: (index: number) => void;
}
const AppearanceSection: React.FC<AppearanceSectionProps> = ({
  darkMode,
  canCustomizeAppearance,
  selectedColorTheme,
  onToggleDarkMode,
  onApplyColorTheme,
}) => (
  <AppearanceSettings
    darkMode={darkMode}
    canCustomizeAppearance={canCustomizeAppearance}
    selectedColorTheme={selectedColorTheme}
    onToggleDarkMode={onToggleDarkMode}
    onApplyColorTheme={onApplyColorTheme}
  />
);

export default AppearanceSection;
