// Comprehensive Widget Configuration Types

export interface BaseWidgetConfig {
  title?: string;
  refreshRate?: number; // in seconds
  colorTheme?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gradient';
  showBorder?: boolean;
  borderRadius?: number;
}

export interface StatsWidgetConfig extends BaseWidgetConfig {
  metricName?: string;
  unit?: string;
  targetValue?: number;
  showTrend?: boolean;
  trendColor?: string;
  prefix?: string;
  suffix?: string;
}

export interface ChartWidgetConfig extends BaseWidgetConfig {
  chartType?: 'line' | 'bar' | 'area' | 'composed';
  dataSource?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  timeRange?: '7d' | '14d' | '30d' | '90d';
  yAxisLabel?: string;
  xAxisLabel?: string;
}

export interface SystemHealthWidgetConfig extends BaseWidgetConfig {
  monitoredServices?: string[];
  alertThreshold?: number;
  showUptime?: boolean;
  customMetrics?: Array<{ name: string; threshold: number }>;
}

export interface PerformanceMetricsWidgetConfig extends BaseWidgetConfig {
  metricsToShow?: Array<'throughput' | 'latency' | 'errorRate'>;
  alertThresholds?: {
    throughput?: number;
    latency?: number;
    errorRate?: number;
  };
  updateInterval?: number;
}

export interface RevenueDashboardWidgetConfig extends BaseWidgetConfig {
  currency?: string;
  showProjections?: boolean;
  targetRevenue?: number;
  includedPlans?: string[];
  fiscalYearStart?: number; // month 1-12
}

export interface UserActivityHeatmapWidgetConfig extends BaseWidgetConfig {
  timezone?: string;
  colorScheme?: 'blue' | 'green' | 'heat' | 'cool';
  showWeekends?: boolean;
  aggregationType?: 'count' | 'average' | 'sum';
}

export interface ApiUsageWidgetConfig extends BaseWidgetConfig {
  rateLimit?: number;
  showTopEndpoints?: number;
  warningThreshold?: number; // percentage
  criticalThreshold?: number; // percentage
  excludeEndpoints?: string[];
}

export interface StorageAnalyticsWidgetConfig extends BaseWidgetConfig {
  totalCapacity?: number; // in GB
  warningThreshold?: number; // percentage
  showFileTypes?: boolean;
  customCategories?: Array<{ name: string; pattern: string }>;
}

export interface DeviceStatusWidgetConfig extends BaseWidgetConfig {
  locationFilter?: string;
  deviceTypeFilter?: string;
  showOfflineDevices?: boolean;
  groupBy?: 'location' | 'type' | 'status';
}

export interface MapWidgetConfig extends BaseWidgetConfig {
  defaultZoom?: number;
  centerLat?: number;
  centerLng?: number;
  markerColor?: string;
  showLabels?: boolean;
  clusterMarkers?: boolean;
}

export interface AlertsWidgetConfig extends BaseWidgetConfig {
  severityFilter?: Array<'critical' | 'warning' | 'info'>;
  maxAlertsShown?: number;
  autoRefresh?: boolean;
  soundEnabled?: boolean;
}

export interface TableWidgetConfig extends BaseWidgetConfig {
  dataSource?: string;
  columnsToShow?: string[];
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  enableSearch?: boolean;
}

export interface RecentActivityWidgetConfig extends BaseWidgetConfig {
  activityTypes?: string[];
  maxItems?: number;
  showUserAvatars?: boolean;
  groupByUser?: boolean;
  timeFormat?: '12h' | '24h';
}

export interface HVACControlWidgetConfig extends BaseWidgetConfig {
  roomName?: string;
  location?: string;
  defaultMode?: 'cool' | 'heat' | 'auto' | 'fan';
  tempUnit?: 'celsius' | 'fahrenheit';
  minTemp?: number;
  maxTemp?: number;
  showSchedule?: boolean;
}

export interface LightingControlWidgetConfig extends BaseWidgetConfig {
  zoneName?: string;
  location?: string;
  defaultBrightness?: number;
  supportColorChange?: boolean;
  showScenes?: boolean;
  enableScheduling?: boolean;
}

export interface AnalyticsWidgetConfig extends BaseWidgetConfig {
  metricsDisplayed?: string[];
  comparisonPeriod?: 'previous' | 'lastYear' | 'target';
  showPredictions?: boolean;
  kpiTargets?: Record<string, number>;
}

export interface ElectricalPanelCircuitConfig {
  id: string;
  name: string;
  capacity: number; // in Amps
  voltage: number;
  phase: 'A' | 'B' | 'C';
}

export interface ElectricalPanelWidgetConfig extends BaseWidgetConfig {
  panelName?: string;
  totalCapacity?: number; // in Amps
  voltage?: number;
  frequency?: number; // Hz
  showAlerts?: boolean;
  showPowerFactor?: boolean;
  circuits?: ElectricalPanelCircuitConfig[];
}

export interface WaterTankConfig {
  id: string;
  name: string;
  capacity: number; // in Liters
  targetLevel?: number; // percentage
}

export interface WaterPumpConfig {
  id: string;
  name: string;
  maxPower?: number; // kW
}

export interface WaterManagementWidgetConfig extends BaseWidgetConfig {
  buildingName?: string;
  showConsumption?: boolean;
  showQuality?: boolean;
  tanks?: WaterTankConfig[];
  pumps?: WaterPumpConfig[];
}

export interface FireSafetyZoneConfig {
  id: string;
  name: string;
  detectorCount?: number;
  sprinklerCount?: number;
  pullStationCount?: number;
  specialSystem?: string;
}

export interface FireSafetyWidgetConfig extends BaseWidgetConfig {
  buildingName?: string;
  showEmergencySystems?: boolean;
  showRecentEvents?: boolean;
  zones?: FireSafetyZoneConfig[];
}

export interface SecurityZoneConfig {
  id: string;
  name: string;
  sensorCount?: number;
  cameraCount?: number;
  initialArmedState?: boolean;
}

export interface SecurityControlWidgetConfig extends BaseWidgetConfig {
  systemName?: string;
  location?: string;
  showCameras?: boolean;
  showAlerts?: boolean;
  showSensorStatus?: boolean;
  zones?: SecurityZoneConfig[];
}

export interface EnergyControlWidgetConfig extends BaseWidgetConfig {
  facilityName?: string;
  showSolarPanel?: boolean;
  showBattery?: boolean;
  showGridStatus?: boolean;
  peakDemandLimit?: number; // kW
}

export interface ClimateControlWidgetConfig extends BaseWidgetConfig {
  buildingName?: string;
  showHumidity?: boolean;
  showAirQuality?: boolean;
  showEnergyUsage?: boolean;
  numberOfZones?: number;
  defaultTempUnit?: 'celsius' | 'fahrenheit';
}

export type WidgetConfigType =
  | StatsWidgetConfig
  | ChartWidgetConfig
  | SystemHealthWidgetConfig
  | PerformanceMetricsWidgetConfig
  | RevenueDashboardWidgetConfig
  | UserActivityHeatmapWidgetConfig
  | ApiUsageWidgetConfig
  | StorageAnalyticsWidgetConfig
  | DeviceStatusWidgetConfig
  | MapWidgetConfig
  | AlertsWidgetConfig
  | TableWidgetConfig
  | RecentActivityWidgetConfig
  | HVACControlWidgetConfig
  | LightingControlWidgetConfig
  | AnalyticsWidgetConfig
  | ElectricalPanelWidgetConfig
  | WaterManagementWidgetConfig
  | FireSafetyWidgetConfig
  | SecurityControlWidgetConfig
  | EnergyControlWidgetConfig
  | ClimateControlWidgetConfig;
