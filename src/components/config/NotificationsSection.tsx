
import React from 'react';
import { Bell } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Switch } from '../ui/switch';

interface NotificationsSectionProps {
  notificationsEnabled: boolean;
  appointmentReminders: boolean;
  reviewNotifications: boolean;
  onNotificationsChange: (enabled: boolean) => void;
  onAppointmentRemindersChange: (enabled: boolean) => void;
  onReviewNotificationsChange: (enabled: boolean) => void;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  notificationsEnabled,
  appointmentReminders,
  reviewNotifications,
  onNotificationsChange,
  onAppointmentRemindersChange,
  onReviewNotificationsChange,
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Notificações</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-muted p-2 rounded-full">
                <Bell size={18} />
              </div>
              <div>
                <p className="font-medium">Notificações</p>
                <p className="text-sm text-muted-foreground">Ativar ou desativar notificações</p>
              </div>
            </div>
            <Switch 
              checked={notificationsEnabled}
              onCheckedChange={onNotificationsChange}
            />
          </div>
          
          {notificationsEnabled && (
            <div className="pl-10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Lembretes de agendamentos</p>
                  <p className="text-sm text-muted-foreground">Receber lembretes de agendamentos</p>
                </div>
                <Switch 
                  checked={appointmentReminders} 
                  onCheckedChange={onAppointmentRemindersChange}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Novas avaliações</p>
                  <p className="text-sm text-muted-foreground">Receber notificações de novas avaliações</p>
                </div>
                <Switch 
                  checked={reviewNotifications}
                  onCheckedChange={onReviewNotificationsChange}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
