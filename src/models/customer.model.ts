
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  birthdate?: string;
  notes?: string;
  createdAt: string;
  lastVisit?: string;
  totalAppointments: number;
}
