/**
 * Dynamic Widget Sizing Utilities
 * Automatically calculate optimal widget dimensions based on content
 */

import type {
  ChartWidgetConfig,
  DataTableWidgetConfig,
  LightingControlWidgetConfig,
  HVACControlWidgetConfig,
  ElectricalPanelWidgetConfig,
} from '../types/ConfigurableWidget.types';

export interface WidgetSize {
  w: number;  // width in grid units (1-12)
  h: number;  // height in grid units
}

// ============================================================================
// Chart Widget Sizing
// ============================================================================

export function calculateChartWidgetSize(config: ChartWidgetConfig): WidgetSize {
  const enabledCharts = config.elements?.filter(c => c.enabled) || [];
  const chartCount = enabledCharts.length;

  if (chartCount === 0) {
    return { w: 6, h: 4 };  // Empty state
  }

  switch (config.layout) {
    case 'grid': {
      const columns = config.gridColumns || 2;
      const rows = Math.ceil(chartCount / columns);

      // Width: More columns = wider widget
      const width = Math.min(12, Math.max(6, columns * 4));

      // Height: More rows = taller widget
      const height = Math.min(12, Math.max(3, rows * 3));

      return { w: width, h: height };
    }

    case 'tabs':
      // Tabs show one chart at a time, size based on chart height
      return { w: 8, h: config.height ? Math.ceil(config.height / 100) : 4 };

    case 'carousel':
      // Carousel shows one chart at a time
      return { w: 8, h: config.height ? Math.ceil(config.height / 100) : 4 };

    default:
      return { w: 8, h: 4 };
  }
}

// ============================================================================
// Data Table Widget Sizing
// ============================================================================

export function calculateDataTableWidgetSize(config: DataTableWidgetConfig): WidgetSize {
  const enabledTables = config.elements?.filter(t => t.enabled) || [];
  const tableCount = enabledTables.length;

  if (tableCount === 0) {
    return { w: 6, h: 4 };  // Empty state
  }

  // Single table - size based on page size
  if (tableCount === 1) {
    const table = enabledTables[0];
    const pageSize = table.pageSize || 10;

    // More rows = taller widget
    // +2 for header and controls
    const height = Math.min(12, Math.max(4, Math.ceil(pageSize / 3) + 2));

    return { w: 8, h: height };
  }

  // Multiple tables - show tabs
  // Height based on average page size
  const avgPageSize = enabledTables.reduce((sum, t) => sum + (t.pageSize || 10), 0) / tableCount;
  const height = Math.min(12, Math.max(5, Math.ceil(avgPageSize / 3) + 2));

  return { w: 10, h: height };
}

// ============================================================================
// Lighting Control Widget Sizing
// ============================================================================

export function calculateLightingWidgetSize(config: LightingControlWidgetConfig): WidgetSize {
  const enabledZones = config.elements?.filter(z => z.enabled) || [];
  const zoneCount = enabledZones.length;

  if (zoneCount === 0) {
    return { w: 6, h: 4 };  // Empty state
  }

  switch (config.layout) {
    case 'list': {
      // Vertical list - each zone takes ~2 height units
      const height = Math.min(12, Math.max(4, zoneCount * 2 + 1));
      return { w: 6, h: height };
    }

    case 'grid': {
      // Grid layout - 2 columns
      const rows = Math.ceil(zoneCount / 2);
      const height = Math.min(12, Math.max(4, rows * 2 + (config.showEnergyMetrics ? 2 : 0)));
      return { w: 8, h: height };
    }

    case 'compact': {
      // Compact - 3 columns
      const rows = Math.ceil(zoneCount / 3);
      const height = Math.min(12, Math.max(4, rows * 2 + (config.showEnergyMetrics ? 1 : 0)));
      return { w: 10, h: height };
    }

    default:
      return { w: 6, h: 6 };
  }
}

// ============================================================================
// HVAC Control Widget Sizing
// ============================================================================

export function calculateHVACWidgetSize(config: HVACControlWidgetConfig): WidgetSize {
  const enabledUnits = config.elements?.filter(u => u.enabled) || [];
  const unitCount = enabledUnits.length;

  if (unitCount === 0) {
    return { w: 6, h: 4 };  // Empty state
  }

  switch (config.layout) {
    case 'list': {
      // Vertical list - each unit takes ~3 height units
      const height = Math.min(12, Math.max(4, unitCount * 3 + 1));
      return { w: 6, h: height };
    }

    case 'grid': {
      // Grid layout - 2 columns
      const rows = Math.ceil(unitCount / 2);
      const height = Math.min(12, Math.max(4, rows * 3));
      return { w: 8, h: height };
    }

    case 'zones': {
      // Zone layout - 3 columns
      const rows = Math.ceil(unitCount / 3);
      const height = Math.min(12, Math.max(4, rows * 3));
      return { w: 12, h: height };
    }

    default:
      return { w: 6, h: 6 };
  }
}

// ============================================================================
// Electrical Panel Widget Sizing
// ============================================================================

export function calculateElectricalPanelWidgetSize(config: ElectricalPanelWidgetConfig): WidgetSize {
  const enabledPanels = config.elements?.filter(p => p.enabled) || [];
  const panelCount = enabledPanels.length;

  if (panelCount === 0) {
    return { w: 6, h: 4 };  // Empty state
  }

  // Calculate average circuit count
  const avgCircuitCount = enabledPanels.reduce((sum, p) => sum + p.circuits.length, 0) / panelCount;

  switch (config.layout) {
    case 'single': {
      // Single panel view - height based on circuits
      // Each circuit takes ~0.5 height units, +2 for panel header
      const height = Math.min(12, Math.max(4, Math.ceil(avgCircuitCount * 0.5) + 2));
      return { w: 6, h: height };
    }

    case 'multi': {
      // Multi-panel view - 2 columns
      const rows = Math.ceil(panelCount / 2);
      const height = Math.min(12, Math.max(4, rows * (Math.ceil(avgCircuitCount * 0.3) + 2)));
      return { w: 10, h: height };
    }

    default:
      return { w: 6, h: 6 };
  }
}

// ============================================================================
// Universal Size Calculator
// ============================================================================

export function calculateOptimalSize(
  widgetType: string,
  config: any
): WidgetSize {
  switch (widgetType) {
    case 'chart-v2':
      return calculateChartWidgetSize(config as ChartWidgetConfig);

    case 'data-table-v2':
      return calculateDataTableWidgetSize(config as DataTableWidgetConfig);

    case 'lighting-control-v2':
      return calculateLightingWidgetSize(config as LightingControlWidgetConfig);

    case 'hvac-control-v2':
      return calculateHVACWidgetSize(config as HVACControlWidgetConfig);

    case 'electrical-panel-v2':
      return calculateElectricalPanelWidgetSize(config as ElectricalPanelWidgetConfig);

    default:
      return { w: 6, h: 4 };
  }
}

// ============================================================================
// Size Comparison & Update Detection
// ============================================================================

export function shouldResizeWidget(
  currentSize: WidgetSize,
  optimalSize: WidgetSize,
  threshold: number = 1  // Resize if difference is > 1 grid unit
): boolean {
  const widthDiff = Math.abs(currentSize.w - optimalSize.w);
  const heightDiff = Math.abs(currentSize.h - optimalSize.h);

  return widthDiff > threshold || heightDiff > threshold;
}

export function getSizeChangeReason(
  currentSize: WidgetSize,
  optimalSize: WidgetSize
): string {
  const widthChange = optimalSize.w - currentSize.w;
  const heightChange = optimalSize.h - currentSize.h;

  const reasons: string[] = [];

  if (widthChange > 0) {
    reasons.push(`wider (${widthChange} units)`);
  } else if (widthChange < 0) {
    reasons.push(`narrower (${Math.abs(widthChange)} units)`);
  }

  if (heightChange > 0) {
    reasons.push(`taller (${heightChange} units)`);
  } else if (heightChange < 0) {
    reasons.push(`shorter (${Math.abs(heightChange)} units)`);
  }

  return reasons.length > 0
    ? `Widget will be ${reasons.join(' and ')}`
    : 'No size change needed';
}
