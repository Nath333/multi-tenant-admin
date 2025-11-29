/**
 * Components Barrel Exports
 *
 * Central export point for commonly used components
 * Usage: import { ErrorBoundary, LoadingSpinner, ProtectedRoute } from '@/components';
 */

// Common Components
export { ErrorBoundary, LoadingSpinner } from './common';

// Routing Components
export { ProtectedRoute, AdminOnlyRoute } from './routing';

// Modal Components
export { WidgetCatalogModal, WidgetConfigModal, KeyboardShortcutsModal } from './modals';

// Drawer Components
export { WidgetPreviewDrawer } from './drawers';

// Builder Components
export { InlinePageBuilder } from './builders';

// Widget Core Components
export { WidgetLayout, WidgetGrid, WidgetErrorBoundary, renderWidget } from './widgets/core';

// Widget Forms
export { WidgetConfigForm } from './widgets/forms';

// V2 Configurable Widgets
export { default as ChartWidget } from './widgets/v2/widgets/ChartWidget/ChartWidget';
export { default as DataTableWidget } from './widgets/v2/widgets/DataTableWidget/DataTableWidget';
export { default as LightingControlWidget } from './widgets/v2/widgets/LightingControlWidget/LightingControlWidget';
export { default as HVACControlWidget } from './widgets/v2/widgets/HVACControlWidget/HVACControlWidget';
export { default as ElectricalPanelWidget } from './widgets/v2/widgets/ElectricalPanelWidget/ElectricalPanelWidget';
