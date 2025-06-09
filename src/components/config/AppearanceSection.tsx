
import React from 'react';
import { Moon, Sun, PaintBucket } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Switch } from '../ui/switch';
import { useToast } from '../ui/use-toast';
import { UserSettings } from '../../models/user-settings.model';

const colorOptions = [
  { name: 'Caramelo', primary: '#C4804E', secondary: '#FBE6D4', accent: '#8B4513' },
  { name: 'Azul Profissional', primary: '#3B82F6', secondary: '#1E293B', accent: '#06B6D4' },
  { name: 'Verde Esmeralda', primary: '#10B981', secondary: '#064E3B', accent: '#34D399' },
  { name: 'Roxo Elegante', primary: '#8B5CF6', secondary: '#4C1D95', accent: '#A78BFA' },
  { name: 'Azul Marinho', primary: '#1E40AF', secondary: '#1E3A8A', accent: '#3B82F6' },
];

interface AppearanceSectionProps {
  darkMode: boolean;
  selectedColorTheme: number;
  canCustomizeAppearance: boolean;
  user: any;
  onToggleDarkMode: () => void;
  onApplyColorTheme: (index: number) => void;
}

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({
  darkMode,
  selectedColorTheme,
  canCustomizeAppearance,
  onToggleDarkMode,
  onApplyColorTheme,
}) => {
  const { toast } = useToast();

  const handleToggleDarkMode = () => {
    onToggleDarkMode();
    toast({
      title: "Tema alterado",
      description: `Modo ${!darkMode ? "escuro" : "claro"} ativado`,
    });
  };

  const handleApplyColorTheme = (index: number) => {
    onApplyColorTheme(index);
    toast({
      title: "Tema de cores alterado",
      description: `Tema "${colorOptions[index].name}" aplicado com sucesso`,
    });
  };

  return (
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
            <Switch checked={darkMode} onCheckedChange={handleToggleDarkMode} />
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
                    onClick={() => handleApplyColorTheme(index)}
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
};
