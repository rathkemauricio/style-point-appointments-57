
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Switch } from "../ui/switch";

interface AppearanceSettingsProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  darkMode,
  onToggleDarkMode,
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
      </div>
    </CardContent>
  </Card>
);

export default AppearanceSettings;
