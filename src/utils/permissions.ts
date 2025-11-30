/**
 * Permission utilities for role-based access control
 * Uses centralized UserRole type from types/index.ts
 */

import type { UserRole } from '../types';

// Re-export UserRole for consumers of this module
export type { UserRole } from '../types';

export interface Permission {
  resource: string;
  actions: string[];
}

// Permission matrix - defines what each role can do
// superadmin > admin > page-manager > user
export const PERMISSIONS: Record<UserRole, Permission[]> = {
  superadmin: [
    { resource: 'team', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'users', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'tenants', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'devices', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'settings', actions: ['read', 'update'] },
    { resource: 'usage', actions: ['read'] },
    { resource: 'audit-logs', actions: ['read', 'export'] },
    { resource: 'pages', actions: ['read', 'create', 'update', 'delete'] },
  ],
  admin: [
    { resource: 'team', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'users', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'tenants', actions: ['read', 'update'] },
    { resource: 'devices', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'settings', actions: ['read', 'update'] },
    { resource: 'usage', actions: ['read'] },
    { resource: 'audit-logs', actions: ['read', 'export'] },
    { resource: 'pages', actions: ['read', 'create', 'update', 'delete'] },
  ],
  'page-manager': [
    { resource: 'devices', actions: ['read'] },
    { resource: 'usage', actions: ['read'] },
    { resource: 'pages', actions: ['read', 'create', 'update', 'delete'] },
  ],
  user: [
    { resource: 'devices', actions: ['read', 'update'] },
    { resource: 'usage', actions: ['read'] },
    { resource: 'pages', actions: ['read'] },
  ],
};

// Pages that require admin access
export const ADMIN_ONLY_PAGES = [
  '/users',
  '/tenants',
  '/settings',
];

// Pages that require page-manager or admin access
export const PAGE_MANAGER_PAGES = [
  '/pages/manage',
  '/pages/edit',
  '/pages/build',
];

/**
 * Check if user has permission for a specific action on a resource
 */
export const hasPermission = (
  userRole: UserRole,
  resource: string,
  action: string
): boolean => {
  const rolePermissions = PERMISSIONS[userRole] || [];
  const resourcePermission = rolePermissions.find((p) => p.resource === resource);

  if (!resourcePermission) {
    return false;
  }

  return resourcePermission.actions.includes(action) || resourcePermission.actions.includes('*');
};

/**
 * Check if user can access a specific page
 */
export const canAccessPage = (userRole: UserRole, path: string): boolean => {
  // Superadmin and admin can access everything
  if (userRole === 'superadmin' || userRole === 'admin') {
    return true;
  }

  // Check if page requires admin access
  const requiresAdmin = ADMIN_ONLY_PAGES.some((adminPath) =>
    path.startsWith(adminPath)
  );

  if (requiresAdmin) {
    return false;
  }

  // Check if page requires page-manager access
  const requiresPageManager = PAGE_MANAGER_PAGES.some((managerPath) =>
    path.startsWith(managerPath)
  );

  if (requiresPageManager) {
    return userRole === 'page-manager';
  }

  return true;
};

/**
 * Get user role display name
 */
export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    'page-manager': 'Page Manager',
    user: 'User',
  };
  return labels[role] || role;
};

/**
 * Get role color for badges
 */
export const getRoleColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    superadmin: 'purple',
    admin: 'red',
    'page-manager': 'orange',
    user: 'blue',
  };
  return colors[role] || 'default';
};

/**
 * Check if role is an admin-level role
 */
export const isAdminRole = (role: UserRole): boolean => {
  return role === 'superadmin' || role === 'admin';
};

/**
 * Check if role can manage pages
 */
export const canManagePages = (role: UserRole): boolean => {
  return role === 'superadmin' || role === 'admin' || role === 'page-manager';
};
