/**
 * Services Barrel Exports
 *
 * Central export point for all services
 * Usage: import { apiClient, jwtService } from '@/services';
 */

// API Services
export { default as apiClient } from './api/apiClient';

// Auth Services
export * as jwtService from './auth/jwtService';

// Mock Data Services
export * from './mockData';

// Database Services
export { db as mockDb } from './database/mockDatabase';

// Re-export commonly used types
export type { Device, Tenant, User } from './mockData';
