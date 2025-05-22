
export interface Notification {
  id: string;
  professionalId: string;
  title: string;
  message: string;
  type: 'appointment' | 'review' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}
