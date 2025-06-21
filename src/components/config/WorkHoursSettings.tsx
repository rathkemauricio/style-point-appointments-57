
import React from "react";
import { Clock, Save } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Toggle } from "../ui/toggle";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface WorkDays {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

interface WorkHoursSettingsProps {
  workDays: WorkDays;
  startTime: string;
  endTime: string;
  onToggleWorkDay: (day: keyof WorkDays) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onSave: () => void;
}

const daysOfWeek: { key: keyof WorkDays, label: string }[] = [
  { key: "monday", label: "Seg" },
  { key: "tuesday", label: "Ter" },
  { key: "wednesday", label: "Qua" },
  { key: "thursday", label: "Qui" },
  { key: "friday", label: "Sex" },
  { key: "saturday", label: "Sáb" },
  { key: "sunday", label: "Dom" },
];

const WorkHoursSettings: React.FC<WorkHoursSettingsProps> = ({
  workDays,
  startTime,
  endTime,
  onToggleWorkDay,
  onStartTimeChange,
  onEndTimeChange,
  onSave
}) => (
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
        <div className="flex flex-wrap gap-2 mt-2">
          {daysOfWeek.map(day => (
            <Toggle
              key={day.key}
              pressed={workDays[day.key]}
              onPressedChange={() => onToggleWorkDay(day.key)}
              aria-label={day.label}
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {day.label}
            </Toggle>
          ))}
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
        <Button onClick={onSave} className="w-full">
          <Save className="mr-2 h-4 w-4" /> Salvar horários
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default WorkHoursSettings;
