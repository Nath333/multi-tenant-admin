/**
 * Utils Barrel Exports
 *
 * Central export point for all utility functions
 * Usage: import { hasPermission, AppError } from '@/utils';
 */

// Permission utilities
export {
  hasPermission,
  canAccessPage,
  getRoleLabel,
  getRoleColor,
  isAdminRole,
  canManagePages,
  PERMISSIONS,
  ADMIN_ONLY_PAGES,
  PAGE_MANAGER_PAGES,
} from './permissions';
export type { Permission } from './permissions';

// Error utilities
export {
  AppError,
  ValidationError,
  NetworkError,
  TimeoutError,
  createErrorFromStatus,
  logError,
  retryWithBackoff,
} from './errors';
