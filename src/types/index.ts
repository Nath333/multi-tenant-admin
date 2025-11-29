// Common types for the application

export type UserRole = 'superadmin' | 'admin' | 'user' | 'page-manager';

// Unified User type - consolidates all variations across the app
export interface User {
  id: string;
  username: string;
  name?: string; // Display name (alias for username in some contexts)
  email: string;
  role: UserRole;
  tenantId: string;
  status: 'active' | 'inactive';
  department?: string;
  avatar?: string;
  phone?: string;
  lastLogin?: string;
}

// Unified Tenant type - consolidates all variations across the app
export interface Tenant {
  id: string;
  name: string;
  domain?: string;
  plan: 'free' | 'pro' | 'enterprise'; // Standardized on free/pro/enterprise
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  devicesCount?: number; // For dashboard stats
  usersCount?: number; // For dashboard stats
  devices?: number; // Alias for devicesCount
  users?: number; // Alias for usersCount
  dataUsage?: string;
  logo?: string;
}

// Unified Device type - consolidates all variations
export interface Device {
  id: string;
  name: string;
  type: 'sensor' | 'gateway' | 'actuator' | 'camera';
  status: 'online' | 'offline' | 'warning';
  location: string;
  lastSeen: string;
  tenantId: string;
  battery?: number;
  temperature?: number;
  humidity?: number;
  firmwareVersion?: string;
  firmware?: string; // Alias for firmwareVersion
  model?: string;
  serialNumber?: string;
  signal?: number;
}

export interface Activity {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description: string;
  timestamp: string;
  userId?: string;
  deviceId?: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

// Widget types
export type WidgetType = 'chart' | 'stats' | 'device-status' | 'recent-activity' | 'table' | 'map' | 'analytics' | 'alerts';

export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface StatsWidgetConfig extends Record<string, unknown> {
  statName?: string;
  value?: number | string;
  trend?: number;
  trendDirection?: 'up' | 'down';
  icon?: string;
  color?: string;
  comparedToLastMonth?: string;
}

export interface ChartWidgetConfig extends Record<string, unknown> {
  chartType?: 'line' | 'bar' | 'area';
  dataKey?: string;
  timeRange?: number;
  color?: string;
  showGrid?: boolean;
}

export interface DeviceStatusWidgetConfig extends Record<string, unknown> {
  showOnline?: boolean;
  showOffline?: boolean;
  showWarning?: boolean;
}

export interface TableWidgetConfig extends Record<string, unknown> {
  columns?: string[];
  pageSize?: number;
  showPagination?: boolean;
}

export interface MapWidgetConfig extends Record<string, unknown> {
  showOnline?: boolean;
  showOffline?: boolean;
  showWarning?: boolean;
  centerLat?: number;
  centerLon?: number;
  zoom?: number;
}

export interface AnalyticsWidgetConfig extends Record<string, unknown> {
  metrics?: string[];
  timeRange?: number;
  showSummary?: boolean;
}

export interface AlertsWidgetConfig extends Record<string, unknown> {
  showUnreadOnly?: boolean;
  maxItems?: number;
  severityFilter?: string[];
}

export type WidgetConfig = (
  | StatsWidgetConfig
  | ChartWidgetConfig
  | DeviceStatusWidgetConfig
  | TableWidgetConfig
  | MapWidgetConfig
  | AnalyticsWidgetConfig
  | AlertsWidgetConfig
  | Record<string, unknown>
) & {
  disabled?: boolean;
};

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  position: WidgetPosition;
  config: WidgetConfig;
}

export interface DashboardStats {
  totalDevices: number;
  activeDevices: number;
  alerts: number;
  uptime: number;
}

// Settings types
export interface GeneralSettings {
  siteName: string;
  language: string;
  timezone: string;
  dateFormat: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  alertThreshold: number;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  ipWhitelist: string;
}

// API Response types (for future use)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
