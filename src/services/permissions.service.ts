
import { UserPermissions, RolePermissions, DEFAULT_ROLE_PERMISSIONS, PERMISSIONS } from '../models/permissions.model';
import { AuthUser } from '../models/auth.model';
import authService from './auth.service';

class PermissionsService {
  private readonly PERMISSIONS_KEY = 'user_permissions';
  
  /**
   * Check if the current user has a specific permission
   */
  hasPermission(permissionId: string): boolean {
    const user = authService.getCurrentUser();
    if (!user) return false;
    
    // Get user-specific permissions
    const userPermissions = this.getUserPermissions(user.id);
    if (userPermissions && userPermissions.permissions.includes(permissionId)) {
      return true;
    }
    
    // Fallback to role-based permissions
    const rolePermissions = this.getRolePermissions(user.role);
    return rolePermissions.includes(permissionId);
  }
  
  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissionIds: string[]): boolean {
    return permissionIds.some(id => this.hasPermission(id));
  }
  
  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(permissionIds: string[]): boolean {
    return permissionIds.every(id => this.hasPermission(id));
  }
  
  /**
   * Get all permissions for the current user
   */
  getUserPermissions(userId: string): UserPermissions | null {
    try {
      const stored = localStorage.getItem(`${this.PERMISSIONS_KEY}_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return null;
    }
  }
  
  /**
   * Set permissions for a specific user
   */
  setUserPermissions(userPermissions: UserPermissions): void {
    try {
      localStorage.setItem(
        `${this.PERMISSIONS_KEY}_${userPermissions.userId}`,
        JSON.stringify(userPermissions)
      );
    } catch (error) {
      console.error('Error setting user permissions:', error);
    }
  }
  
  /**
   * Get default permissions for a role
   */
  getRolePermissions(role: 'admin' | 'professional' | 'customer'): string[] {
    return DEFAULT_ROLE_PERMISSIONS[role] || [];
  }
  
  /**
   * Get all available permissions grouped by category
   */
  getAllPermissions() {
    const grouped: Record<string, typeof PERMISSIONS[keyof typeof PERMISSIONS][]> = {};
    
    Object.values(PERMISSIONS).forEach(permission => {
      if (!grouped[permission.category]) {
        grouped[permission.category] = [];
      }
      grouped[permission.category].push(permission);
    });
    
    return grouped;
  }
  
  /**
   * Grant a permission to a user
   */
  grantPermission(userId: string, permissionId: string): void {
    const userPermissions = this.getUserPermissions(userId) || {
      userId,
      permissions: []
    };
    
    if (!userPermissions.permissions.includes(permissionId)) {
      userPermissions.permissions.push(permissionId);
      this.setUserPermissions(userPermissions);
    }
  }
  
  /**
   * Revoke a permission from a user
   */
  revokePermission(userId: string, permissionId: string): void {
    const userPermissions = this.getUserPermissions(userId);
    if (!userPermissions) return;
    
    userPermissions.permissions = userPermissions.permissions.filter(
      id => id !== permissionId
    );
    this.setUserPermissions(userPermissions);
  }
  
  /**
   * Reset user permissions to role defaults
   */
  resetToRoleDefaults(userId: string, role: 'admin' | 'professional' | 'customer'): void {
    const userPermissions: UserPermissions = {
      userId,
      permissions: [...this.getRolePermissions(role)]
    };
    
    this.setUserPermissions(userPermissions);
  }
}

export default new PermissionsService();
