/**
 * NOXIS RBAC ENGINE
 * Derived from Hub v13.1.0 Security Spec.
 */

export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF' | 'VIEWER' | 'EXTERNAL_AUDIT';

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: ['index', 'scan', 'lens', 'messages', 'alerts', 'more'],
  MANAGER: ['index', 'scan', 'lens', 'messages', 'alerts', 'more'],
  STAFF: ['index', 'scan', 'lens', 'messages', 'alerts', 'more'],
  VIEWER: ['index', 'scan', 'messages'],
  EXTERNAL_AUDIT: ['index', 'scan']
};

/**
 * Check if a role can access a specific tab route.
 */
export function canAccessTab(role: string | null, tabName: string): boolean {
  if (!role) return true; 
  
  const permissions = ROLE_PERMISSIONS[role as UserRole];
  if (!permissions) return ROLE_PERMISSIONS.VIEWER.includes(tabName);
  
  return permissions.includes(tabName);
}
