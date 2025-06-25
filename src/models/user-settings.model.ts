
export interface UserSettings {
  userId: string;
  theme: {
    isDarkMode: boolean;
  };
  notifications: {
    enabled: boolean;
    appointments: boolean;
    reviews: boolean;
  };
  workHours?: {
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
  };
}
