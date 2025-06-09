
import React from 'react';
import { usePermissions } from '../hooks/use-permissions';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean; // If true, user must have ALL permissions. If false, user needs ANY permission
  fallback?: React.ReactNode;
  role?: 'admin' | 'professional' | 'customer';
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  role
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isAdmin } = usePermissions();
  
  // Check role-based access
  if (role) {
    if (role === 'admin' && !isAdmin()) {
      return <>{fallback}</>;
    }
  }
  
  // Check single permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }
  
  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    const hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
      
    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }
  
  return <>{children}</>;
};

export default PermissionGuard;
