
import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface TimePickerInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
  className?: string;
}

export const TimePickerInput: React.FC<TimePickerInputProps> = ({
  value,
  onChange,
  label,
  id,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  return (
    <div className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        type="time"
        value={value}
        onChange={handleChange}
        className="timepicker-input"
      />
    </div>
  );
};
