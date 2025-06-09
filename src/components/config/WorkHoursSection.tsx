
import React from 'react';
import { Clock, Save } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Toggle } from '../ui/toggle';
import { useToast } from '../ui/use-toast';

interface WorkHoursSectionProps {
  startTime: string;
  endTime: string;
  workDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onToggleWorkDay: (day: keyof typeof workDays) => void;
  onSaveWorkHours: () => void;
}

export const WorkHoursSection: React.FC<WorkHoursSectionProps> = ({
  startTime,
  endTime,
  workDays,
  onStartTimeChange,
  onEndTimeChange,
  onToggleWorkDay,
  onSaveWorkHours,
}) => {
  const { toast } = useToast();

  const handleSaveWorkHours = () => {
    onSaveWorkHours();
    toast({
      title: "Horários salvos",
      description: "Seus horários de trabalho foram atualizados",
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Horários de trabalho</h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-muted p-2 rounded-full">
              <Clock size={18} />
            </div>
            <div>
              <p className="font-medium">Definir horários</p>
              <p className="text-sm text-muted-foreground">Configure seus dias e horários disponíveis</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mt-2">
              <Toggle 
                pressed={workDays.monday}
                onPressedChange={() => onToggleWorkDay('monday')}
                aria-label="Segunda-feira"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Seg
              </Toggle>
              <Toggle 
                pressed={workDays.tuesday}
                onPressedChange={() => onToggleWorkDay('tuesday')}
                aria-label="Terça-feira"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Ter
              </Toggle>
              <Toggle 
                pressed={workDays.wednesday}
                onPressedChange={() => onToggleWorkDay('wednesday')}
                aria-label="Quarta-feira"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Qua
              </Toggle>
              <Toggle 
                pressed={workDays.thursday}
                onPressedChange={() => onToggleWorkDay('thursday')}
                aria-label="Quinta-feira"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Qui
              </Toggle>
              <Toggle 
                pressed={workDays.friday}
                onPressedChange={() => onToggleWorkDay('friday')}
                aria-label="Sexta-feira"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Sex
              </Toggle>
              <Toggle 
                pressed={workDays.saturday}
                onPressedChange={() => onToggleWorkDay('saturday')}
                aria-label="Sábado"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Sáb
              </Toggle>
              <Toggle 
                pressed={workDays.sunday}
                onPressedChange={() => onToggleWorkDay('sunday')}
                aria-label="Domingo"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Dom
              </Toggle>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Horário inicial</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => onStartTimeChange(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-time">Horário final</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => onEndTimeChange(e.target.value)}
                />
              </div>
            </div>
            
            <Button onClick={handleSaveWorkHours} className="w-full">
              <Save className="mr-2 h-4 w-4" /> Salvar horários
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
