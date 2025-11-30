/**
 * Store Barrel Exports
 *
 * Central export point for all Zustand stores
 * Usage: import { useAuthStore, useWidgetStore } from '@/store';
 */

export { useAuthStore } from './authStore';
export { useWidgetStore } from './widgetStore';
export { usePagesStore } from './pagesStore';
export { useThemeStore } from './themeStore';
export { useTenantsStore } from './tenantsStore';
export { useUsersStore } from './usersStore';

// CRUD store factory for creating new entity stores
export { createCrudStore } from './createCrudStore';
export type { CrudStoreConfig, CrudState, ExtendedCrudState, BaseEntity } from './createCrudStore';

// Re-export types from centralized location
export type { Tenant, User, Device, UserRole } from '../types';
export type { ThemeMode } from './themeStore';
