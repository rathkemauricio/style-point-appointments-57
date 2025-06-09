
import React from 'react';
import { LogOut } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface AccountSectionProps {
  user: any;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const AccountSection: React.FC<AccountSectionProps> = ({
  user,
  isAuthenticated,
  onLogout,
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
              {user.role === 'professional' ? 'Profissional' : 
               user.role === 'admin' ? 'Administrador' : 'Cliente'}
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sair da conta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
