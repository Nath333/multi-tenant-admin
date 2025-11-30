/**
 * Configurable Widget System - Type Definitions
 * Universal types for the new smart widget architecture
 */

// ============================================================================
// Base Configuration Types
// ============================================================================

export type DataSourceType =
  | 'realtime-sensor'
  | 'historical-timeseries'
  | 'aggregated-metrics'
  | 'device-status'
  | 'alert-stream'
  | 'static-data';

export interface DataBinding {
  id: string;
  name: string;
  sourceType: DataSourceType;
  mockDataKey: string;  // References mock data generator
  refreshInterval?: number;  // milliseconds
  filters?: Record<string, unknown>;
  transform?: string;  // Optional data transformation
}

// ============================================================================
// Element Configuration (shared by all widgets)
// ============================================================================

export interface BaseElementConfig {
  id: string;
  name: string;
  enabled: boolean;
  dataBinding?: DataBinding;
  displayOrder: number;
}

// ============================================================================
// Chart Widget Element
// ============================================================================

export type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'scatter' | 'gauge';

export interface ChartElementConfig extends BaseElementConfig {
  type: 'chart';
  chartType: ChartType;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
  showLegend: boolean;
  showGrid: boolean;
  stacked?: boolean;
  fill?: boolean;
}

export interface ChartWidgetConfig {
  elements: ChartElementConfig[];
  layout: 'grid' | 'tabs' | 'carousel';
  gridColumns?: number;
  height?: number;
  timeRange?: '1h' | '24h' | '7d' | '30d';
  [key: string]: unknown;
}

// ============================================================================
// Data Table Widget Element
// ============================================================================

export interface TableColumnConfig {
  id: string;
  name: string;
  dataKey: string;
  width?: number;
  sortable: boolean;
  filterable: boolean;
  render?: 'text' | 'badge' | 'progress' | 'date' | 'number' | 'boolean';
  color?: string;
  [key: string]: unknown;
}

export interface TableElementConfig extends BaseElementConfig {
  type: 'table';
  columns: TableColumnConfig[];
  pageSize: number;
  showPagination: boolean;
  showSearch: boolean;
  exportable: boolean;
}

export interface DataTableWidgetConfig {
  elements: TableElementConfig[];
  defaultView?: string;  // Which table to show by default
  [key: string]: unknown;
}

// ============================================================================
// Lighting Control Widget Element
// ============================================================================

export interface LightingZoneConfig extends BaseElementConfig {
  type: 'lighting-zone';
  location?: string;
  defaultBrightness: number;
  minBrightness: number;
  maxBrightness: number;
  supportsDimming: boolean;
  supportsColor: boolean;
  fixtureCount: number;
  powerRating: number;  // watts per fixture
  schedules?: Array<{
    id: string;
    name: string;
    time: string;
    brightness: number;
    enabled: boolean;
  }>;
}

export interface LightingControlWidgetConfig {
  elements: LightingZoneConfig[];
  showEnergyMetrics: boolean;
  showSchedules: boolean;
  showOccupancy: boolean;
  layout: 'list' | 'grid' | 'compact';
  [key: string]: unknown;
}

// ============================================================================
// HVAC Control Widget Element
// ============================================================================

export interface HVACUnitConfig extends BaseElementConfig {
  type: 'hvac-unit';
  location?: string;
  unitType: 'split' | 'central' | 'rooftop' | 'vrf';
  capacity: number;  // BTU or tons
  defaultTemp: number;
  minTemp: number;
  maxTemp: number;
  supportsHeating: boolean;
  supportsCooling: boolean;
  supportsVentilation: boolean;
  supportsHumidity: boolean;
  modes: Array<'auto' | 'cool' | 'heat' | 'fan' | 'dry'>;
  fanSpeeds: Array<'low' | 'medium' | 'high' | 'auto'>;
}

export interface HVACControlWidgetConfig {
  elements: HVACUnitConfig[];
  showAirQuality: boolean;
  showEnergyUsage: boolean;
  showSchedules: boolean;
  showDiagnostics: boolean;
  layout: 'list' | 'grid' | 'zones';
  [key: string]: unknown;
}

// ============================================================================
// Electrical Panel Widget Element
// ============================================================================

export interface CircuitConfig {
  id: string;
  name: string;
  breakerSize: number;  // amps
  voltage: number;
  phase: 'A' | 'B' | 'C' | '3-phase';
  enabled: boolean;
  critical: boolean;
  [key: string]: unknown;
}

export interface ElectricalPanelConfig extends BaseElementConfig {
  type: 'electrical-panel';
  location?: string;
  totalCapacity: number;  // amps
  voltage: number;
  phases: 1 | 3;
  circuits: CircuitConfig[];
  showPowerFactor: boolean;
  showFrequency: boolean;
  showHarmonics: boolean;
}

export interface ElectricalPanelWidgetConfig {
  elements: ElectricalPanelConfig[];
  showPowerQuality: boolean;
  showAlerts: boolean;
  showEnergyMetrics: boolean;
  layout: 'single' | 'multi';
  [key: string]: unknown;
}

// ============================================================================
// Universal Widget Props
// ============================================================================

export interface WidgetSize {
  w: number;  // width in grid units (1-12)
  h: number;  // height in grid units
}

export interface ConfigurableWidgetProps<T = unknown> {
  id?: string;
  title: string;
  config: T;
  onConfigChange: (newConfig: T) => void;
  onRemove?: () => void;
  onResize?: (newSize: WidgetSize) => void;
  currentSize?: WidgetSize;
  widgetType?: string;
  editMode?: boolean;
  className?: string;
  style?: React.CSSProperties;
  enableAutoResize?: boolean;
}

// ============================================================================
// Widget Types
// ============================================================================

export type WidgetType = 'chart' | 'data-table' | 'lighting-control' | 'hvac-control' | 'electrical-panel';

export interface WidgetDefinition {
  type: WidgetType;
  name: string;
  description: string;
  icon: string;
  defaultConfig: Record<string, unknown>;
  minSize: { w: number; h: number };
  defaultSize: { w: number; h: number };
  maxSize: { w: number; h: number };
}

// ============================================================================
// Configuration Panel Types
// ============================================================================

export interface ConfigPanelTab {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

export interface ConfigPanelProps<T = unknown> {
  config: T;
  onChange: (newConfig: T) => void;
  onClose: () => void;
  widgetType: WidgetType;
}

// ============================================================================
// Mock Data Types
// ============================================================================

export interface MockDataSource {
  key: string;
  name: string;
  description: string;
  type: DataSourceType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generate: () => any;
}
