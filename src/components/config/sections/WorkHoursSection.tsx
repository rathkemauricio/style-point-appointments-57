
import React from "react";
import WorkHoursSettings from "../WorkHoursSettings";

interface WorkDays {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}
interface WorkHoursSectionProps {
  workDays: WorkDays;
  startTime: string;
  endTime: string;
  onToggleWorkDay: (day: keyof WorkDays) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onSave: () => void;
}
const WorkHoursSection: React.FC<WorkHoursSectionProps> = ({
  workDays,
  startTime,
  endTime,
  onToggleWorkDay,
  onStartTimeChange,
  onEndTimeChange,
  onSave,
}) => (
  <WorkHoursSettings
    workDays={workDays}
    startTime={startTime}
    endTime={endTime}
    onToggleWorkDay={onToggleWorkDay}
    onStartTimeChange={onStartTimeChange}
    onEndTimeChange={onEndTimeChange}
    onSave={onSave}
  />
);

export default WorkHoursSection;
