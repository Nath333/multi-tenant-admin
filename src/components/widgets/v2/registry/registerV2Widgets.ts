/**
 * Register V2 Widgets
 * Registers all new configurable widgets with the main widget registry
 */

import { widgetRegistry } from '../../registry/WidgetRegistry';
import type { WidgetRegistration } from '../../registry/widgetRegistry.types';
import ChartWidget from '../widgets/ChartWidget/ChartWidget';
import DataTableWidget from '../widgets/DataTableWidget/DataTableWidget';
import LightingControlWidget from '../widgets/LightingControlWidget/LightingControlWidget';
import HVACControlWidget from '../widgets/HVACControlWidget/HVACControlWidget';
import ElectricalPanelWidget from '../widgets/ElectricalPanelWidget/ElectricalPanelWidget';
import { V2_WIDGET_METADATA, getDefaultConfig } from './widgetDefinitions';

/**
 * V2 Widget Registrations
 * All 5 smart, configurable widgets
 */
const v2WidgetRegistrations: WidgetRegistration[] = [
  // Chart Widget V2
  {
    metadata: V2_WIDGET_METADATA['chart-v2'],
    component: ChartWidget as any, // Type assertion needed for registry compatibility
    defaultConfig: getDefaultConfig('chart-v2'),
    configSchema: {},
  },

  // Data Table Widget V2
  {
    metadata: V2_WIDGET_METADATA['data-table-v2'],
    component: DataTableWidget as any,
    defaultConfig: getDefaultConfig('data-table-v2'),
    configSchema: {},
  },

  // Lighting Control Widget V2
  {
    metadata: V2_WIDGET_METADATA['lighting-control-v2'],
    component: LightingControlWidget as any,
    defaultConfig: getDefaultConfig('lighting-control-v2'),
    configSchema: {},
  },

  // HVAC Control Widget V2
  {
    metadata: V2_WIDGET_METADATA['hvac-control-v2'],
    component: HVACControlWidget as any,
    defaultConfig: getDefaultConfig('hvac-control-v2'),
    configSchema: {},
  },

  // Electrical Panel Widget V2
  {
    metadata: V2_WIDGET_METADATA['electrical-panel-v2'],
    component: ElectricalPanelWidget as any,
    defaultConfig: getDefaultConfig('electrical-panel-v2'),
    configSchema: {},
  },
];

// Register all V2 widgets
export function registerV2Widgets() {
  v2WidgetRegistrations.forEach((registration) => {
    widgetRegistry.register(registration);
  });
  // V2 configurable widgets registered successfully
}

// Auto-register on import
registerV2Widgets();
