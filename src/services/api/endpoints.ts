/**
 * API Endpoints - Centralized API endpoint definitions
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },

  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    BY_TENANT: (tenantId: string) => `/users?tenantId=${tenantId}`,
  },

  // Tenants
  TENANTS: {
    BASE: '/tenants',
    BY_ID: (id: string) => `/tenants/${id}`,
    STATS: (id: string) => `/tenants/${id}/stats`,
  },

  // Devices
  DEVICES: {
    BASE: '/devices',
    BY_ID: (id: string) => `/devices/${id}`,
    BY_TENANT: (tenantId: string) => `/devices?tenantId=${tenantId}`,
    STATUS: (id: string) => `/devices/${id}/status`,
    COMMAND: (id: string) => `/devices/${id}/command`,
    TELEMETRY: (id: string) => `/devices/${id}/telemetry`,
  },

  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    DEVICES: '/analytics/devices',
    USERS: '/analytics/users',
    CUSTOM: '/analytics/custom',
    TRENDS: '/analytics/trends',
  },

  // Notifications & Alerts
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id: string) => `/notifications/${id}`,
    UNREAD: '/notifications/unread',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },

  ALERTS: {
    BASE: '/alerts',
    BY_ID: (id: string) => `/alerts/${id}`,
    ACTIVE: '/alerts/active',
    ACKNOWLEDGE: (id: string) => `/alerts/${id}/acknowledge`,
  },

  // Settings
  SETTINGS: {
    GENERAL: '/settings/general',
    NOTIFICATIONS: '/settings/notifications',
    SECURITY: '/settings/security',
  },

  // Widgets
  WIDGETS: {
    BASE: '/widgets',
    BY_ID: (id: string) => `/widgets/${id}`,
    LAYOUTS: '/widgets/layouts',
  },

  // Maps & Locations
  LOCATIONS: {
    BASE: '/locations',
    BY_ID: (id: string) => `/locations/${id}`,
    DEVICES: (locationId: string) => `/locations/${locationId}/devices`,
    GEOFENCE: '/locations/geofence',
  },
} as const;
