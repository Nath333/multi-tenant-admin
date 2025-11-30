/**
 * Widget Definitions V2
 * Registry of all configurable widgets with default configurations
 */

import type { WidgetDefinition, ChartWidgetConfig, DataTableWidgetConfig } from '../types/ConfigurableWidget.types';

// ============================================================================
// Default Configurations
// ============================================================================

export const DEFAULT_CHART_CONFIG: ChartWidgetConfig = {
  elements: [
    {
      id: 'chart-1',
      name: 'Temperature Trend',
      type: 'chart',
      enabled: true,
      chartType: 'line',
      color: '#1890ff',
      showGrid: true,
      showLegend: true,
      xAxisLabel: 'Time',
      yAxisLabel: 'Temperature (°C)',
      dataBinding: {
        id: 'temp-binding-1',
        name: 'Temperature Data',
        sourceType: 'historical-timeseries',
        mockDataKey: 'temperature-timeseries',
        refreshInterval: 30000,
      },
      displayOrder: 0,
    },
    {
      id: 'chart-2',
      name: 'Device Count',
      type: 'chart',
      enabled: true,
      chartType: 'bar',
      color: '#52c41a',
      showGrid: true,
      showLegend: true,
      xAxisLabel: 'Time',
      yAxisLabel: 'Count',
      dataBinding: {
        id: 'device-binding-1',
        name: 'Device Count',
        sourceType: 'historical-timeseries',
        mockDataKey: 'device-count-timeseries',
        refreshInterval: 60000,
      },
      displayOrder: 1,
    },
  ],
  layout: 'grid',
  gridColumns: 2,
  height: 300,
  timeRange: '24h',
};

export const DEFAULT_DATA_TABLE_CONFIG: DataTableWidgetConfig = {
  elements: [
    {
      id: 'table-1',
      name: 'Device List',
      type: 'table',
      enabled: true,
      columns: [
        { id: 'col-1', name: 'Device ID', dataKey: 'id', width: 120, sortable: true, filterable: false, render: 'text' },
        { id: 'col-2', name: 'Name', dataKey: 'name', width: 150, sortable: true, filterable: true, render: 'text' },
        { id: 'col-3', name: 'Type', dataKey: 'type', width: 120, sortable: true, filterable: true, render: 'text' },
        { id: 'col-4', name: 'Status', dataKey: 'status', width: 100, sortable: true, filterable: true, render: 'badge' },
        { id: 'col-5', name: 'Location', dataKey: 'location', width: 200, sortable: true, filterable: false, render: 'text' },
      ],
      pageSize: 10,
      showPagination: true,
      showSearch: true,
      exportable: true,
      dataBinding: {
        id: 'device-list-binding',
        name: 'Device List Data',
        sourceType: 'static-data',
        mockDataKey: 'device-list',
        refreshInterval: 60000,
      },
      displayOrder: 0,
    },
  ],
  defaultView: undefined,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const DEFAULT_LIGHTING_CONFIG = {
  elements: [
    {
      id: 'light-zone-1',
      name: 'Conference Room',
      type: 'lighting-zone' as any,
      enabled: true,
      defaultBrightness: 80,
      minBrightness: 0,
      maxBrightness: 100,
      supportsDimming: true,
      supportsColor: true,
      fixtureCount: 8,
      powerRating: 15,
      dataBinding: {
        id: 'lighting-binding-1',
        name: 'Lighting Zone Status',
        sourceType: 'device-status' as any,
        mockDataKey: 'lighting-zone-status',
        refreshInterval: 5000,
      },
      displayOrder: 0,
    },
    {
      id: 'light-zone-2',
      name: 'Office Area',
      type: 'lighting-zone' as any,
      enabled: true,
      defaultBrightness: 70,
      minBrightness: 0,
      maxBrightness: 100,
      supportsDimming: true,
      supportsColor: false,
      fixtureCount: 12,
      powerRating: 20,
      dataBinding: {
        id: 'lighting-binding-2',
        name: 'Lighting Zone Status',
        sourceType: 'device-status' as any,
        mockDataKey: 'lighting-zone-status',
        refreshInterval: 5000,
      },
      displayOrder: 1,
    },
  ],
  showEnergyMetrics: true,
  showSchedules: true,
  showOccupancy: true,
  layout: 'grid' as any,
};

export const DEFAULT_HVAC_CONFIG = {
  elements: [
    {
      id: 'hvac-unit-1',
      name: 'Main HVAC Unit',
      type: 'hvac-unit' as any,
      enabled: true,
      location: 'Main Building',
      unitType: 'central' as any,
      capacity: 5,
      defaultTemp: 22,
      minTemp: 16,
      maxTemp: 30,
      supportsHeating: true,
      supportsCooling: true,
      supportsVentilation: true,
      supportsHumidity: true,
      modes: ['auto', 'cool', 'heat', 'fan'] as any[],
      fanSpeeds: ['low', 'medium', 'high', 'auto'] as any[],
      dataBinding: {
        id: 'hvac-binding-1',
        name: 'HVAC Unit Status',
        sourceType: 'device-status' as any,
        mockDataKey: 'hvac-unit-status',
        refreshInterval: 10000,
      },
      displayOrder: 0,
    },
    {
      id: 'hvac-unit-2',
      name: 'North Wing HVAC',
      type: 'hvac-unit' as any,
      enabled: true,
      location: 'North Wing',
      unitType: 'split' as any,
      capacity: 3,
      defaultTemp: 21,
      minTemp: 16,
      maxTemp: 30,
      supportsHeating: true,
      supportsCooling: true,
      supportsVentilation: true,
      supportsHumidity: false,
      modes: ['auto', 'cool', 'heat', 'fan'] as any[],
      fanSpeeds: ['low', 'medium', 'high', 'auto'] as any[],
      dataBinding: {
        id: 'hvac-binding-2',
        name: 'HVAC Unit Status',
        sourceType: 'device-status' as any,
        mockDataKey: 'hvac-unit-status',
        refreshInterval: 10000,
      },
      displayOrder: 1,
    },
  ],
  showAirQuality: true,
  showEnergyUsage: true,
  showSchedules: true,
  showDiagnostics: false,
  layout: 'grid' as any,
};

export const DEFAULT_ELECTRICAL_PANEL_CONFIG = {
  elements: [
    {
      id: 'panel-1',
      name: 'Main Electrical Panel',
      type: 'electrical-panel' as any,
      enabled: true,
      location: 'Main Building - Basement',
      totalCapacity: 400,
      voltage: 480,
      phases: 3 as any,
      circuits: [
        {
          id: 'circuit-1',
          name: 'HVAC Main',
          breakerSize: 100,
          voltage: 480,
          phase: 'A' as any,
          enabled: true,
          critical: true,
        },
        {
          id: 'circuit-2',
          name: 'Lighting Floor 1-3',
          breakerSize: 60,
          voltage: 277,
          phase: 'B' as any,
          enabled: true,
          critical: false,
        },
        {
          id: 'circuit-3',
          name: 'Data Center',
          breakerSize: 150,
          voltage: 480,
          phase: 'C' as any,
          enabled: true,
          critical: true,
        },
      ],
      showPowerFactor: true,
      showFrequency: true,
      showHarmonics: true,
      dataBinding: {
        id: 'panel-binding-1',
        name: 'Electrical Panel Status',
        sourceType: 'device-status' as any,
        mockDataKey: 'circuit-status',
        refreshInterval: 5000,
      },
      displayOrder: 0,
    },
  ],
  showPowerQuality: true,
  showAlerts: true,
  showEnergyMetrics: true,
  layout: 'single' as any,
};

// ============================================================================
// Widget Definitions
// ============================================================================

export const WIDGET_DEFINITIONS: Record<string, WidgetDefinition> = {
  'chart-v2': {
    type: 'chart',
    name: 'Multi-Chart Dashboard',
    description: 'Display multiple charts with different types and data sources. Perfect for monitoring metrics, trends, and analytics.',
    icon: 'LineChartOutlined',
    defaultConfig: DEFAULT_CHART_CONFIG,
    minSize: { w: 4, h: 3 },
    defaultSize: { w: 8, h: 4 },
    maxSize: { w: 12, h: 12 },
  },

  'data-table-v2': {
    type: 'data-table',
    name: 'Configurable Data Table',
    description: 'Display tabular data with customizable columns and data sources. Sortable, filterable, and exportable.',
    icon: 'TableOutlined',
    defaultConfig: DEFAULT_DATA_TABLE_CONFIG,
    minSize: { w: 4, h: 3 },
    defaultSize: { w: 8, h: 5 },
    maxSize: { w: 12, h: 12 },
  },

  'lighting-control-v2': {
    type: 'lighting-control',
    name: 'Lighting Zone Control',
    description: 'Control multiple lighting zones with brightness adjustment, schedules, and energy monitoring.',
    icon: 'BulbOutlined',
    defaultConfig: DEFAULT_LIGHTING_CONFIG,
    minSize: { w: 4, h: 4 },
    defaultSize: { w: 6, h: 6 },
    maxSize: { w: 12, h: 12 },
  },

  'hvac-control-v2': {
    type: 'hvac-control',
    name: 'HVAC Climate Control',
    description: 'Monitor and control multiple HVAC units with temperature, humidity, and air quality management.',
    icon: 'CloudOutlined',
    defaultConfig: DEFAULT_HVAC_CONFIG,
    minSize: { w: 4, h: 4 },
    defaultSize: { w: 6, h: 6 },
    maxSize: { w: 12, h: 12 },
  },

  'electrical-panel-v2': {
    type: 'electrical-panel',
    name: 'Electrical Distribution',
    description: 'Monitor electrical panels and circuits with real-time power metrics and quality analysis.',
    icon: 'ThunderboltOutlined',
    defaultConfig: DEFAULT_ELECTRICAL_PANEL_CONFIG,
    minSize: { w: 4, h: 4 },
    defaultSize: { w: 6, h: 6 },
    maxSize: { w: 12, h: 12 },
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

export const getWidgetDefinition = (type: string): WidgetDefinition | undefined => {
  return WIDGET_DEFINITIONS[type];
};

export const getAllWidgetDefinitions = (): WidgetDefinition[] => {
  return Object.values(WIDGET_DEFINITIONS);
};

export const getDefaultConfig = (type: string): Record<string, unknown> => {
  const definition = getWidgetDefinition(type);
  return definition ? { ...definition.defaultConfig } : {};
};

// ============================================================================
// Widget Metadata for Registry
// ============================================================================

export const V2_WIDGET_METADATA = {
  'chart-v2': {
    id: 'chart-v2',
    name: 'Multi-Chart Dashboard',
    description: 'Display multiple charts with different types and data sources',
    category: 'charts' as const,
    icon: 'LineChartOutlined',
    tags: ['chart', 'analytics', 'metrics', 'configurable', 'v2'],
    version: '2.0.0',
    author: 'System',
    size: {
      minW: 4,
      minH: 3,
      defaultW: 8,
      defaultH: 4,
      maxW: 12,
      maxH: 12,
    },
    preview: 'chart-widget',
  },

  'data-table-v2': {
    id: 'data-table-v2',
    name: 'Configurable Data Table',
    description: 'Display tabular data with customizable columns',
    category: 'tables' as const,
    icon: 'TableOutlined',
    tags: ['table', 'data', 'list', 'configurable', 'v2'],
    version: '2.0.0',
    author: 'System',
    size: {
      minW: 4,
      minH: 3,
      defaultW: 8,
      defaultH: 5,
      maxW: 12,
      maxH: 12,
    },
    preview: 'data-table-widget',
  },

  'lighting-control-v2': {
    id: 'lighting-control-v2',
    name: 'Lighting Zone Control',
    description: 'Control multiple lighting zones',
    category: 'bms' as const,
    icon: 'BulbOutlined',
    tags: ['lighting', 'bms', 'control', 'zones', 'configurable', 'v2'],
    version: '2.0.0',
    author: 'System',
    size: {
      minW: 4,
      minH: 4,
      defaultW: 6,
      defaultH: 6,
      maxW: 12,
      maxH: 12,
    },
    preview: 'lighting-control-widget',
  },

  'hvac-control-v2': {
    id: 'hvac-control-v2',
    name: 'HVAC Climate Control',
    description: 'Monitor and control multiple HVAC units',
    category: 'bms' as const,
    icon: 'CloudOutlined',
    tags: ['hvac', 'bms', 'climate', 'control', 'configurable', 'v2'],
    version: '2.0.0',
    author: 'System',
    size: {
      minW: 4,
      minH: 4,
      defaultW: 6,
      defaultH: 6,
      maxW: 12,
      maxH: 12,
    },
    preview: 'hvac-control-widget',
  },

  'electrical-panel-v2': {
    id: 'electrical-panel-v2',
    name: 'Electrical Distribution',
    description: 'Monitor electrical panels and circuits',
    category: 'bms' as const,
    icon: 'ThunderboltOutlined',
    tags: ['electrical', 'bms', 'power', 'monitoring', 'configurable', 'v2'],
    version: '2.0.0',
    author: 'System',
    size: {
      minW: 4,
      minH: 4,
      defaultW: 6,
      defaultH: 6,
      maxW: 12,
      maxH: 12,
    },
    preview: 'electrical-panel-widget',
  },
};
