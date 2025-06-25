
export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // Changed from durationMinutes to duration for consistency
  durationMinutes: number; // Keep both for backward compatibility
  imageUrl?: string;
  isActive: boolean;
  category?: string;
}
