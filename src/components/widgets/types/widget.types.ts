import type { ReactNode, CSSProperties } from 'react';

/**
 * Widget animation configuration for micro-interactions
 */
export interface WidgetAnimationConfig {
  /** Enable entrance animation */
  entrance?: {
    enabled: boolean;
    type: 'fade' | 'slide' | 'scale' | 'bounce' | 'rotate' | 'flip';
    duration: number;
    delay: number;
    easing: string;
  };
  /** Enable exit animation */
  exit?: {
    enabled: boolean;
    type: 'fade' | 'slide' | 'scale' | 'bounce' | 'rotate' | 'flip';
    duration: number;
    easing: string;
  };
  /** Hover animation effects */
  hover?: {
    enabled: boolean;
    scale?: number;
    lift?: number;
    glow?: boolean;
    tilt?: boolean;
  };
  /** Loading state animation */
  loading?: {
    type: 'pulse' | 'shimmer' | 'skeleton' | 'dots' | 'spinner';
    color?: string;
  };
  /** Update/change animation */
  dataUpdate?: {
    enabled: boolean;
    highlight?: boolean;
    flashDuration?: number;
  };
}

/**
 * Widget dependency resolution configuration
 */
export interface WidgetDependency {
  /** Unique dependency identifier */
  id: string;
  /** Widget type this dependency is for */
  widgetType: string;
  /** Required widget IDs that must exist */
  requiredWidgets?: string[];
  /** Required data sources */
  requiredDataSources?: string[];
  /** Minimum required permissions */
  requiredPermissions?: string[];
  /** Feature flags that must be enabled */
  requiredFeatures?: string[];
  /** Dependencies that must load before this widget */
  loadAfter?: string[];
  /** Optional dependencies that enhance functionality */
  optionalDependencies?: string[];
  /** Validation function */
  validate?: () => Promise<boolean>;
}

/**
 * Widget lifecycle hooks configuration
 */
export interface WidgetLifecycleHooks {
  /** Called before widget mounts */
  onBeforeMount?: () => Promise<void> | void;
  /** Called after widget mounts */
  onMounted?: () => Promise<void> | void;
  /** Called before widget updates */
  onBeforeUpdate?: (prevProps: any, nextProps: any) => Promise<void> | void;
  /** Called after widget updates */
  onUpdated?: (prevProps: any, nextProps: any) => Promise<void> | void;
  /** Called before widget unmounts */
  onBeforeUnmount?: () => Promise<void> | void;
  /** Called when widget data refreshes */
  onDataRefresh?: () => Promise<void> | void;
  /** Called when widget encounters error */
  onError?: (error: Error) => Promise<void> | void;
  /** Called when widget becomes visible */
  onVisible?: () => Promise<void> | void;
  /** Called when widget becomes hidden */
  onHidden?: () => Promise<void> | void;
}

/**
 * Widget event bus configuration
 */
export interface WidgetEventBus {
  /** Subscribe to widget events */
  subscribe: (event: string, handler: (data: any) => void) => () => void;
  /** Publish widget events */
  publish: (event: string, data: any) => void;
  /** Subscribe to global events */
  subscribeGlobal: (event: string, handler: (data: any) => void) => () => void;
  /** Publish global events */
  publishGlobal: (event: string, data: any) => void;
  /** Clear all event listeners */
  clear: () => void;
}

/**
 * Widget performance monitoring configuration
 */
export interface WidgetPerformanceMetrics {
  /** Render time in milliseconds */
  renderTime: number;
  /** Data fetch time in milliseconds */
  fetchTime?: number;
  /** Memory usage in bytes */
  memoryUsage?: number;
  /** Number of re-renders */
  rerenderCount: number;
  /** Last update timestamp */
  lastUpdate: Date;
  /** Performance score (0-100) */
  performanceScore?: number;
  /** Optimization suggestions */
  suggestions?: string[];
}

/**
 * Widget analytics tracking configuration
 */
export interface WidgetAnalytics {
  /** Track widget views */
  trackView?: boolean;
  /** Track widget interactions */
  trackInteractions?: boolean;
  /** Track widget errors */
  trackErrors?: boolean;
  /** Track performance metrics */
  trackPerformance?: boolean;
  /** Custom event tracking */
  customEvents?: {
    event: string;
    metadata?: Record<string, any>;
  }[];
  /** Analytics provider */
  provider?: 'google' | 'mixpanel' | 'amplitude' | 'custom';
  /** Custom analytics handler */
  onAnalyticsEvent?: (event: string, data: any) => void;
}

/**
 * Widget state synchronization configuration
 */
export interface WidgetStateSyncConfig {
  /** Enable state sync across pages */
  enabled: boolean;
  /** Sync strategy */
  strategy: 'localStorage' | 'sessionStorage' | 'indexedDB' | 'websocket' | 'custom';
  /** Sync key */
  syncKey: string;
  /** Auto-sync interval in milliseconds */
  autoSyncInterval?: number;
  /** Conflict resolution strategy */
  conflictResolution?: 'lastWrite' | 'firstWrite' | 'merge' | 'custom';
  /** Custom sync handler */
  onSync?: (localState: any, remoteState: any) => any;
  /** State transformation before sync */
  transformBeforeSync?: (state: any) => any;
  /** State transformation after sync */
  transformAfterSync?: (state: any) => any;
}

/**
 * Advanced widget configuration with JSON schema
 */
export interface WidgetConfigSchema {
  /** Schema version */
  $schema?: string;
  /** Schema type */
  type: 'object';
  /** Required properties */
  required?: string[];
  /** Property definitions */
  properties: Record<string, {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    title?: string;
    description?: string;
    default?: any;
    enum?: any[];
    minimum?: number;
    maximum?: number;
    pattern?: string;
    items?: any;
    properties?: any;
  }>;
  /** Additional properties allowed */
  additionalProperties?: boolean;
}

/**
 * Widget theme with advanced customization
 */
export interface WidgetTheme {
  /** Primary color */
  primaryColor?: string;
  /** Secondary color */
  secondaryColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Background gradient */
  backgroundGradient?: {
    from: string;
    to: string;
    direction: 'horizontal' | 'vertical' | 'diagonal' | 'radial';
  };
  /** Border configuration */
  border?: {
    color?: string;
    width?: number;
    style?: 'solid' | 'dashed' | 'dotted' | 'double';
    radius?: number;
  };
  /** Shadow configuration */
  shadow?: {
    x: number;
    y: number;
    blur: number;
    spread: number;
    color: string;
  };
  /** Text styling */
  text?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: number;
  };
  /** Custom CSS variables */
  cssVariables?: Record<string, string>;
}

/**
 * Widget size variants with responsive breakpoints
 */
export interface WidgetSize {
  /** Base size */
  base: 'small' | 'medium' | 'large' | 'xlarge';
  /** Responsive breakpoints */
  responsive?: {
    xs?: 'small' | 'medium' | 'large' | 'xlarge';
    sm?: 'small' | 'medium' | 'large' | 'xlarge';
    md?: 'small' | 'medium' | 'large' | 'xlarge';
    lg?: 'small' | 'medium' | 'large' | 'xlarge';
    xl?: 'small' | 'medium' | 'large' | 'xlarge';
  };
  /** Custom dimensions */
  custom?: {
    width?: number | string;
    height?: number | string;
    minWidth?: number | string;
    minHeight?: number | string;
    maxWidth?: number | string;
    maxHeight?: number | string;
  };
}

/**
 * Base props that all widgets should inherit
 */
export interface BaseWidgetProps {
  /** Widget title displayed in header */
  title: string;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Widget ID */
  id?: string;
  /** Callback when widget is removed */
  onRemove?: () => void;
  /** Callback when widget edit is triggered */
  onEdit?: () => void;
  /** Callback when widget configuration changes */
  onConfigChange?: (newConfig: Record<string, unknown>) => void;
  /** Callback when widget is refreshed */
  onRefresh?: () => void;
  /** Custom CSS classes */
  className?: string;
  /** Custom inline styles */
  style?: CSSProperties;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: Error | string | null;
  /** Widget configuration */
  config?: Record<string, unknown>;
  /** Animation configuration */
  animation?: WidgetAnimationConfig;
  /** Lifecycle hooks */
  lifecycle?: WidgetLifecycleHooks;
  /** Event bus */
  eventBus?: WidgetEventBus;
  /** State synchronization */
  stateSync?: WidgetStateSyncConfig;
  /** Analytics tracking */
  analytics?: WidgetAnalytics;
  /** Performance monitoring */
  performance?: WidgetPerformanceMetrics;
  /** Theme customization */
  theme?: WidgetTheme;
  /** Size configuration */
  size?: WidgetSize;
  /** Dependencies */
  dependencies?: WidgetDependency[];
  /** Configuration schema */
  configSchema?: WidgetConfigSchema;
  /** Disabled state - when true, widget is visible but non-interactive */
  disabled?: boolean;
}

/**
 * Widget header action button configuration
 */
export interface WidgetAction {
  key: string;
  icon: ReactNode;
  tooltip?: string;
  onClick: () => void;
  visible?: boolean;
  disabled?: boolean;
  danger?: boolean;
  /** Keyboard shortcut */
  shortcut?: string;
  /** Analytics tracking */
  trackAnalytics?: boolean;
  /** Permission required */
  requiredPermission?: string;
}

/**
 * Widget status types for health indicators
 */
export type WidgetStatus = 'success' | 'warning' | 'error' | 'processing' | 'default' | 'info' | 'critical';

/**
 * Widget data state for data fetching hooks with advanced caching
 */
export interface WidgetDataState<T = any> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  /** Cache status */
  cached?: boolean;
  /** Cache timestamp */
  cachedAt?: Date;
  /** Cache TTL in milliseconds */
  cacheTTL?: number;
  /** Stale-while-revalidate */
  staleWhileRevalidate?: boolean;
  /** Optimistic update state */
  optimisticData?: T;
  /** Retry configuration */
  retry?: {
    count: number;
    maxRetries: number;
    backoff: 'linear' | 'exponential';
  };
}

/**
 * Widget refresh configuration with advanced scheduling
 */
export interface WidgetRefreshConfig {
  enabled: boolean;
  interval: number;
  /** Refresh on visibility change */
  refreshOnFocus?: boolean;
  /** Refresh on reconnect */
  refreshOnReconnect?: boolean;
  /** Refresh on window focus */
  refreshOnWindowFocus?: boolean;
  /** Cron-like schedule */
  schedule?: string;
  /** Refresh strategy */
  strategy?: 'interval' | 'polling' | 'websocket' | 'sse';
  /** Backoff strategy on error */
  errorBackoff?: {
    enabled: boolean;
    initialDelay: number;
    maxDelay: number;
    multiplier: number;
  };
}

/**
 * Widget metric data structure with advanced formatting
 */
export interface WidgetMetric {
  id?: string;
  label: string;
  value: string | number;
  unit?: string;
  trend?: number | {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    percentage: boolean;
    timeframe?: string;
    comparison?: {
      previousValue: number;
      previousPeriod: string;
    };
  };
  status?: WidgetStatus;
  format?: (value: number) => string;
  /** Sparkline data */
  sparkline?: number[];
  /** Target/goal value */
  target?: number;
  /** Historical data */
  history?: Array<{
    timestamp: Date;
    value: number;
  }>;
  /** Alert thresholds */
  thresholds?: {
    warning?: number;
    critical?: number;
    target?: number;
  };
}

/**
 * Widget time range with advanced options
 */
export interface WidgetTimeRange {
  label: string;
  value: string | number;
  days?: number;
  /** Custom date range */
  custom?: {
    start: Date;
    end: Date;
  };
  /** Comparison period */
  comparison?: {
    enabled: boolean;
    type: 'previous' | 'year-over-year' | 'custom';
    customPeriod?: {
      start: Date;
      end: Date;
    };
  };
  /** Timezone */
  timezone?: string;
  /** Granularity */
  granularity?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
}

/**
 * Widget persistence configuration with versioning
 */
export interface WidgetPersistence {
  /** Unique widget instance ID */
  id: string;
  /** Widget type identifier */
  type: string;
  /** Persisted configuration */
  config?: Record<string, unknown>;
  /** Layout position */
  position?: {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
  };
  /** Version for migration */
  version?: number;
  /** Created timestamp */
  createdAt?: Date;
  /** Updated timestamp */
  updatedAt?: Date;
  /** User who created */
  createdBy?: string;
  /** User who last updated */
  updatedBy?: string;
  /** Tags for categorization */
  tags?: string[];
  /** Locked state */
  locked?: boolean;
}
