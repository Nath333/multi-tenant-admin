import {
  BarChartOutlined,
  DashboardOutlined,
  MobileOutlined,
  HistoryOutlined,
  EnvironmentOutlined,
  LineChartOutlined,
  BellOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  DollarOutlined,
  HeatMapOutlined,
  ApiOutlined,
  DatabaseOutlined,
  TableOutlined,
  LockOutlined,
  CloudOutlined,
  BulbOutlined,
  ExperimentOutlined,
  FireOutlined,
  BlockOutlined,
  NumberOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { widgetRegistry } from './WidgetRegistry';
import type { WidgetCategory as RegistryCategory } from './widgetRegistry.types';

const ICON_STYLE = { fontSize: 32 };

/**
 * Map registry category to icon
 */
const CATEGORY_ICON_MAP: Record<RegistryCategory, React.ReactNode> = {
  analytics: <LineChartOutlined style={ICON_STYLE} />,
  monitoring: <HeartOutlined style={ICON_STYLE} />,
  iot: <MobileOutlined style={ICON_STYLE} />,
  charts: <BarChartOutlined style={ICON_STYLE} />,
  tables: <TableOutlined style={ICON_STYLE} />,
  maps: <EnvironmentOutlined style={ICON_STYLE} />,
  controls: <LockOutlined style={ICON_STYLE} />,
  alerts: <BellOutlined style={ICON_STYLE} />,
  custom: <BlockOutlined style={ICON_STYLE} />,
  bms: <ThunderboltOutlined style={ICON_STYLE} />,
};

/**
 * Map widget type to specific icon
 */
const WIDGET_ICON_MAP: Record<string, React.ReactNode> = {
  'analytics': <LineChartOutlined style={ICON_STYLE} />,
  'stats': <DashboardOutlined style={ICON_STYLE} />,
  'chart': <BarChartOutlined style={ICON_STYLE} />,
  'performance-metrics': <ThunderboltOutlined style={ICON_STYLE} />,
  'system-health': <HeartOutlined style={ICON_STYLE} />,
  'device-status': <MobileOutlined style={ICON_STYLE} />,
  'alerts': <BellOutlined style={ICON_STYLE} />,
  'map': <EnvironmentOutlined style={ICON_STYLE} />,
  'revenue-dashboard': <DollarOutlined style={ICON_STYLE} />,
  'user-activity-heatmap': <HeatMapOutlined style={ICON_STYLE} />,
  'api-usage': <ApiOutlined style={ICON_STYLE} />,
  'storage-analytics': <DatabaseOutlined style={ICON_STYLE} />,
  'table': <TableOutlined style={ICON_STYLE} />,
  'recent-activity': <HistoryOutlined style={ICON_STYLE} />,
  'security-control': <LockOutlined style={ICON_STYLE} />,
  'energy-control': <ThunderboltOutlined style={ICON_STYLE} />,
  'climate-control': <CloudOutlined style={ICON_STYLE} />,
  'lighting-control': <BulbOutlined style={ICON_STYLE} />,
  'electrical-panel': <ThunderboltOutlined style={ICON_STYLE} />,
  'hvac-control': <CloudOutlined style={ICON_STYLE} />,
  'electrical-management': <ThunderboltOutlined style={ICON_STYLE} />,
  'energy-analytics': <LineChartOutlined style={ICON_STYLE} />,
  'advanced-lighting': <BulbOutlined style={{ ...ICON_STYLE, color: '#ffd700' }} />,
  'water-management': <ExperimentOutlined style={{ ...ICON_STYLE, color: '#1890ff' }} />,
  'fire-safety': <FireOutlined style={{ ...ICON_STYLE, color: '#ff4d4f' }} />,
  'metric': <NumberOutlined style={ICON_STYLE} />,
  'list': <UnorderedListOutlined style={ICON_STYLE} />,
};

/**
 * Category display configuration
 */
export interface WidgetCategory {
  category: string;
  key: string;
  color: string;
  gradient: string;
  widgets: WidgetDefinition[];
}

export interface WidgetDefinition {
  type: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  tags: string[];
  popular: boolean;
  defaultConfig?: Record<string, unknown>;
}

const CATEGORY_CONFIG: Record<RegistryCategory, { name: string; color: string; gradient: string }> = {
  analytics: {
    name: 'Analytics & Metrics',
    color: '#667eea',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  monitoring: {
    name: 'System & Monitoring',
    color: '#f093fb',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  iot: {
    name: 'IoT & Devices',
    color: '#4facfe',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  charts: {
    name: 'Charts & Graphs',
    color: '#43e97b',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  tables: {
    name: 'Data Tables',
    color: '#fa709a',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  maps: {
    name: 'Maps & Location',
    color: '#30cfd0',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  },
  controls: {
    name: 'Smart Controls',
    color: '#fa709a',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  alerts: {
    name: 'Alerts & Notifications',
    color: '#ff6b6b',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
  },
  custom: {
    name: 'Custom Templates',
    color: '#a8edea',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
  bms: {
    name: 'Building Management',
    color: '#f77062',
    gradient: 'linear-gradient(135deg, #f77062 0%, #fe5196 100%)',
  },
};

// Popular widgets (customize as needed)
const POPULAR_WIDGETS = new Set([
  'stats',
  'analytics',
  'system-health',
  'alerts',
  'revenue-dashboard',
  'api-usage',
  'electrical-panel',
  'advanced-lighting',
  'fire-safety',
]);

/**
 * Convert widget registry to category format for UI
 */
export const getWidgetCategories = (): WidgetCategory[] => {
  const allWidgets = widgetRegistry.getAll();
  const categoryMap = new Map<RegistryCategory, WidgetDefinition[]>();

  // Group widgets by category
  allWidgets.forEach((registration) => {
    const { metadata, defaultConfig } = registration;
    const category = metadata.category;

    const widgetDef: WidgetDefinition = {
      type: metadata.id,
      title: metadata.name,
      icon: WIDGET_ICON_MAP[metadata.id] || CATEGORY_ICON_MAP[category] || <BlockOutlined style={ICON_STYLE} />,
      description: metadata.description,
      tags: metadata.tags || [],
      popular: POPULAR_WIDGETS.has(metadata.id),
      defaultConfig,
    };

    const widgets = categoryMap.get(category) || [];
    widgets.push(widgetDef);
    categoryMap.set(category, widgets);
  });

  // Convert to category array
  const categories: WidgetCategory[] = [];
  categoryMap.forEach((widgets, categoryKey) => {
    const config = CATEGORY_CONFIG[categoryKey];
    if (config) {
      categories.push({
        category: config.name,
        key: categoryKey,
        color: config.color,
        gradient: config.gradient,
        widgets,
      });
    }
  });

  return categories;
};

/**
 * Get default widget size from registry
 */
export const getDefaultWidgetSize = (type: string): { w: number; h: number } => {
  const registration = widgetRegistry.get(type);
  if (registration) {
    return {
      w: registration.metadata.size.defaultW,
      h: registration.metadata.size.defaultH,
    };
  }

  // Fallback
  return { w: 3, h: 2 };
};

/**
 * Grid configuration - FREE PLACEMENT MODE
 */
export const GRID_CONFIG = {
  breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  rowHeight: 80,
  margin: [16, 16] as [number, number],
  containerPadding: [16, 16] as [number, number],
  compactType: null,  // No auto-compacting - free placement
  preventCollision: false,  // Allow overlapping
};
