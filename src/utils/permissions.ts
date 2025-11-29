/**
 * Permission utilities for role-based access control
 */

export type UserRole = 'admin' | 'user' | 'viewer';

export interface Permission {
  resource: string;
  actions: string[];
}

// Permission matrix - defines what each role can do
export const PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { resource: 'team', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'users', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'devices', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'settings', actions: ['read', 'update'] },
    { resource: 'usage', actions: ['read'] },
    { resource: 'audit-logs', actions: ['read', 'export'] },
    { resource: 'pages', actions: ['read', 'create', 'update', 'delete'] },
  ],
  user: [
    { resource: 'devices', actions: ['read', 'update'] },
    { resource: 'usage', actions: ['read'] },
    { resource: 'pages', actions: ['read'] },
  ],
  viewer: [
    { resource: 'devices', actions: ['read'] },
    { resource: 'usage', actions: ['read'] },
    { resource: 'pages', actions: ['read'] },
  ],
};

// Pages that require admin access
export const ADMIN_ONLY_PAGES = [
  '/users',
  '/tenants',
  '/settings',
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
  // Admin can access everything
  if (userRole === 'admin') {
    return true;
  }

  // Check if page requires admin access
  const requiresAdmin = ADMIN_ONLY_PAGES.some((adminPath) =>
    path.startsWith(adminPath)
  );

  if (requiresAdmin) {
    return false;
  }

  return true;
};

/**
 * Get user role display name
 */
export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    admin: 'Admin',
    user: 'User',
    viewer: 'Viewer',
  };
  return labels[role] || role;
};

/**
 * Get role color for badges
 */
export const getRoleColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    admin: 'red',
    user: 'blue',
    viewer: 'green',
  };
  return colors[role] || 'default';
};
