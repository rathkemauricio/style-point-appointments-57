
export interface Professional {
  id: string;
  name: string;
  title: string;
  phone?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
  serviceIds: string[];
  isActive: boolean;
}
