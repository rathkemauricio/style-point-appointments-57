
/**
 * Formats a date string to a user-friendly display format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formats time (HH:MM) for display
 */
export function formatTime(time: string): string {
  // For now, just return the time as is (HH:MM)
  return time;
}

/**
 * Combines date and time strings into a complete Date object
 */
export function combineDateAndTime(date: string, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes);
  return result;
}

/**
 * Checks if two time ranges overlap
 */
export function doTimesOverlap(
  startTime1: string,
  endTime1: string,
  startTime2: string,
  endTime2: string
): boolean {
  return (
    (startTime1 >= startTime2 && startTime1 < endTime2) ||
    (endTime1 > startTime2 && endTime1 <= endTime2) ||
    (startTime1 <= startTime2 && endTime1 >= endTime2)
  );
}

/**
 * Gets the day of week name from a date string
 */
export function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { weekday: 'long' });
}

/**
 * Calculates end time based on start time and duration in minutes
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  
  let totalMinutes = hours * 60 + minutes + durationMinutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}

/**
 * Checks if a date is today
 */
export function isToday(dateString: string): boolean {
  const today = new Date();
  const date = new Date(dateString);
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Generates an array of dates from startDate to endDate (inclusive)
 */
export function generateDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const current = new Date(start);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

/**
 * Returns the next N days as date strings
 */
export function getNextDays(numberOfDays: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < numberOfDays; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

/**
 * Get the start and end of a time period (day, week, month, year)
 */
export function getTimePeriod(period: 'day' | 'week' | 'month' | 'year'): {
  startDate: string;
  endDate: string;
} {
  const today = new Date();
  let startDate: Date;
  let endDate: Date = new Date();
  
  switch (period) {
    case 'day':
      startDate = today;
      break;
      
    case 'week':
      // Start of current week (Sunday)
      startDate = new Date(today);
      const dayOfWeek = today.getDay();
      startDate.setDate(today.getDate() - dayOfWeek);
      // End of week (Saturday)
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      break;
      
    case 'month':
      // Start of current month
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      // End of current month
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
      
    case 'year':
      // Start of current year
      startDate = new Date(today.getFullYear(), 0, 1);
      // End of current year
      endDate = new Date(today.getFullYear(), 11, 31);
      break;
      
    default:
      startDate = today;
  }
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}
