
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

interface AccountSettingsProps {
  user?: {
    email?: string;
    role?: string;
  };
  isAuthenticated: boolean;
  onLogout: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
  user,
  isAuthenticated,
  onLogout
}) => {
  if (!isAuthenticated) return null;
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Conta</h2>
        {user && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Logado como:</p>
            <p className="font-medium">{user.email}</p>
            <p className="text-sm">
              {user.role === 'professional'
                ? 'Profissional'
                : user.role === 'admin'
                ? 'Administrador'
                : 'Cliente'}
            </p>
          </div>
        )}
        <Button
          variant="destructive"
          className="w-full"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sair da conta
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
