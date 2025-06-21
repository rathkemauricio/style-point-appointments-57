
import React from "react";
import { Bell } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Switch } from "../ui/switch";

interface NotificationSettingsProps {
  notificationsEnabled: boolean;
  appointmentReminders: boolean;
  reviewNotifications: boolean;
  onToggleNotifications: (checked: boolean) => void;
  onToggleAppointments: (checked: boolean) => void;
  onToggleReviews: (checked: boolean) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  notificationsEnabled,
  appointmentReminders,
  reviewNotifications,
  onToggleNotifications,
  onToggleAppointments,
  onToggleReviews
}) => (
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
          <Switch checked={notificationsEnabled} onCheckedChange={onToggleNotifications} />
        </div>
        {notificationsEnabled && (
          <div className="pl-10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Lembretes de agendamentos</p>
                <p className="text-sm text-muted-foreground">Receber lembretes de agendamentos</p>
              </div>
              <Switch checked={appointmentReminders} onCheckedChange={onToggleAppointments} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Novas avaliações</p>
                <p className="text-sm text-muted-foreground">Receber notificações de novas avaliações</p>
              </div>
              <Switch checked={reviewNotifications} onCheckedChange={onToggleReviews} />
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export default NotificationSettings;
