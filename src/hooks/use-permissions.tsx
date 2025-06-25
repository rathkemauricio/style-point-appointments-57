
import { useAuth } from './use-auth';

export const usePermissions = () => {
  const { user } = useAuth();

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isProfessional = () => {
    return user?.role === 'professional';
  };

  const isCustomer = () => {
    return user?.role === 'customer';
  };

  const hasRole = (role: 'admin' | 'professional' | 'customer') => {
    return user?.role === role;
  };

  const canManageUsers = () => {
    return isAdmin();
  };

  const canManageServices = () => {
    return isAdmin() || isProfessional();
  };

  const canViewPortal = () => {
    return isProfessional();
  };

  const canBookAppointments = () => {
    return true; // All users can book appointments
  };

  return {
    isAdmin,
    isProfessional,
    isCustomer,
    hasRole,
    canManageUsers,
    canManageServices,
    canViewPortal,
    canBookAppointments,
  };
};
