
export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  imageUrl?: string;
  isActive: boolean;
  category?: string;
}
