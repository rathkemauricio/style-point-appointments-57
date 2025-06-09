
import { useAuth } from './use-auth';
import permissionsService from '../services/permissions.service';
import { PERMISSIONS } from '../models/permissions.model';

export const usePermissions = () => {
  const { user } = useAuth();
  
  const hasPermission = (permissionId: string): boolean => {
    if (!user) return false;
    return permissionsService.hasPermission(permissionId);
  };
  
  const hasAnyPermission = (permissionIds: string[]): boolean => {
    if (!user) return false;
    return permissionsService.hasAnyPermission(permissionIds);
  };
  
  const hasAllPermissions = (permissionIds: string[]): boolean => {
    if (!user) return false;
    return permissionsService.hasAllPermissions(permissionIds);
  };
  
  const getUserPermissions = () => {
    if (!user) return null;
    return permissionsService.getUserPermissions(user.id);
  };
  
  const getAllPermissions = () => {
    return permissionsService.getAllPermissions();
  };
  
  // Convenience methods for common permission checks
  const canManageAgenda = () => hasAnyPermission(['create_appointment', 'edit_appointment', 'delete_appointment']);
  const canManageServices = () => hasAnyPermission(['create_service', 'edit_service', 'delete_service']);
  const canViewFinancials = () => hasPermission('view_revenue');
  const canManageCustomers = () => hasAnyPermission(['edit_customer', 'delete_customer']);
  const canManageSettings = () => hasPermission('manage_settings');
  const isAdmin = () => user?.role === 'admin';
  
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserPermissions,
    getAllPermissions,
    canManageAgenda,
    canManageServices,
    canViewFinancials,
    canManageCustomers,
    canManageSettings,
    isAdmin,
    // Export permission constants for easy access
    PERMISSIONS
  };
};
