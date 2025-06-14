
import React from "react";
import AccountSettings from "../AccountSettings";

interface AccountSectionProps {
  user?: {
    email?: string;
    role?: string;
  };
  isAuthenticated: boolean;
  onLogout: () => void;
}
const AccountSection: React.FC<AccountSectionProps> = ({
  user, isAuthenticated, onLogout
}) => (
  <AccountSettings
    user={user}
    isAuthenticated={isAuthenticated}
    onLogout={onLogout}
  />
);
export default AccountSection;
