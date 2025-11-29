// Application constants - Only actively used constants are kept

export const APP_CONFIG = {
  NAME: 'Multi-Tenant Admin',
  VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'en',
  DEFAULT_THEME: 'light',
} as const;

export const AUTH_CONFIG = {
  LOGIN_DELAY_MS: 500,
  SESSION_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
  STORAGE_KEY: 'auth-storage',
} as const;

export const WIDGET_CONFIG = {
  STORAGE_KEY: 'widget-storage',
  DEFAULT_GRID_COLS: 12,
  DEFAULT_ROW_HEIGHT: 60,
  MIN_WIDGET_WIDTH: 1,
  MIN_WIDGET_HEIGHT: 1,
  // Max width should work across all breakpoints (xxs has 2 cols minimum)
  MAX_WIDGET_WIDTH: 12,
  MAX_WIDGET_HEIGHT: 10,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

export const CHART_CONFIG = {
  DEFAULT_TIME_RANGE_DAYS: 30,
  TIME_RANGE_OPTIONS: [7, 30, 90, 180, 365],
  DEFAULT_COLORS: {
    primary: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    info: '#13c2c2',
  },
} as const;

export const DEVICE_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  WARNING: 'warning',
} as const;

export const USER_ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  PAGE_MANAGER: 'page-manager',
  USER: 'user',
} as const;

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  TTL_MS: 5 * 60 * 1000, // 5 minutes
  MAX_SIZE: 100,
  CLEANUP_INTERVAL_MS: 60 * 1000, // 1 minute
} as const;
