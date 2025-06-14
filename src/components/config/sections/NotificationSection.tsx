
import React from "react";
import NotificationSettings from "../NotificationSettings";

interface NotificationSectionProps {
  notificationsEnabled: boolean;
  appointmentReminders: boolean;
  reviewNotifications: boolean;
  onToggleNotifications: (checked: boolean) => void;
  onToggleAppointments: (checked: boolean) => void;
  onToggleReviews: (checked: boolean) => void;
}
const NotificationSection: React.FC<NotificationSectionProps> = ({
  notificationsEnabled,
  appointmentReminders,
  reviewNotifications,
  onToggleNotifications,
  onToggleAppointments,
  onToggleReviews
}) => (
  <NotificationSettings
    notificationsEnabled={notificationsEnabled}
    appointmentReminders={appointmentReminders}
    reviewNotifications={reviewNotifications}
    onToggleNotifications={onToggleNotifications}
    onToggleAppointments={onToggleAppointments}
    onToggleReviews={onToggleReviews}
  />
);
export default NotificationSection;
