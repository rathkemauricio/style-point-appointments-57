
import React from "react";
import { Moon, Sun, PaintBucket } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Switch } from "../ui/switch";

const colorOptions = [
  { name: 'Caramelo', primary: '#C4804E', secondary: '#FBE6D4', accent: '#8B4513' },
  { name: 'Marrom Escuro', primary: '#8B4513', secondary: '#2C1810', accent: '#C4804E' },
  { name: 'Marrom Médio', primary: '#A0522D', secondary: '#DEB887', accent: '#8B4513' },
  { name: 'Marrom Claro', primary: '#D2691E', secondary: '#FFE4C4', accent: '#8B4513' },
  { name: 'Caramelo Dourado', primary: '#CD853F', secondary: '#F5DEB3', accent: '#8B4513' },
];

interface AppearanceSettingsProps {
  darkMode: boolean;
  canCustomizeAppearance: boolean;
  selectedColorTheme: number;
  onToggleDarkMode: () => void;
  onApplyColorTheme: (index: number) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  darkMode,
  canCustomizeAppearance,
  selectedColorTheme,
  onToggleDarkMode,
  onApplyColorTheme,
}) => (
  <Card>
    <CardContent className="p-4">
      <h2 className="text-lg font-semibold mb-4">Aparência</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-muted p-2 rounded-full">
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div>
              <p className="font-medium">Modo escuro</p>
              <p className="text-sm text-muted-foreground">Alterar o tema da aplicação</p>
            </div>
          </div>
          <Switch checked={darkMode} onCheckedChange={onToggleDarkMode} />
        </div>
        {canCustomizeAppearance && (
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-muted p-2 rounded-full">
                <PaintBucket size={18} />
              </div>
              <div>
                <p className="font-medium">Cores do app</p>
                <p className="text-sm text-muted-foreground">Personalizar as cores do app</p>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {colorOptions.map((color, index) => (
                <button
                  key={index}
                  className={`w-full aspect-square rounded-full border-2 ${selectedColorTheme === index ? 'border-ring scale-110' : 'border-transparent'} transition-all`}
                  style={{ backgroundColor: color.primary }}
                  onClick={() => onApplyColorTheme(index)}
                  aria-label={`Tema de cor ${color.name}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export default AppearanceSettings;
