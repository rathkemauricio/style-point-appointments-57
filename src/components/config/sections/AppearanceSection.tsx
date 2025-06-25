
import React from "react";
import AppearanceSettings from "../AppearanceSettings";

interface AppearanceSectionProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const AppearanceSection: React.FC<AppearanceSectionProps> = ({
  darkMode,
  onToggleDarkMode,
}) => (
  <AppearanceSettings
    darkMode={darkMode}
    onToggleDarkMode={onToggleDarkMode}
  />
);

export default AppearanceSection;
