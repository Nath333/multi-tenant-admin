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

// Re-export types
export type { Tenant } from '../services/mockData';
export type { ThemeMode } from './themeStore';
