
export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  professionalId: string;
  appointmentId: string;
  serviceIds: string[];
  rating: number; // 1-5 estrelas
  comment?: string;
  date: string;
}
