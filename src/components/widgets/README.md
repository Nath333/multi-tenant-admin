# Widget Architecture Documentation

Professional, scalable widget system for the multi-tenant admin dashboard.

## 📐 Architecture Overview

```
src/components/widgets/
├── base/                    # Base components
│   └── BaseWidget.tsx      # Reusable widget foundation
├── hooks/                   # Custom React hooks
│   ├── useWidgetData.ts    # Data fetching & auto-refresh
│   └── useWidgetMetrics.ts # Metric computation
├── types/                   # TypeScript definitions
│   └── widget.types.ts     # Common widget types
├── utils/                   # Utilities & helpers
│   ├── constants.ts        # Colors, sizes, intervals
│   └── widgetHelpers.ts    # Formatting, calculations
├── registry/                # Widget registry system
│   ├── widgetRegistry.types.ts  # Registry types
│   ├── WidgetRegistry.ts        # Registry singleton
│   ├── WidgetFactory.tsx        # Dynamic widget creation
│   ├── WidgetConfigPanel.tsx    # Config UI
│   ├── WidgetCatalog.tsx        # Browse widgets
│   └── registerWidgets.ts       # Register all widgets
├── templates/               # Reusable widget templates
│   ├── MetricWidget.tsx    # Simple metric display
│   └── ListWidget.tsx      # List of items
└── [Individual Widgets]     # Actual widget implementations
    ├── SystemHealthWidget.tsx
    ├── ChartWidget.tsx
    └── ...
```

## 🎯 Key Features

### 1. **BaseWidget Component**
Provides consistent foundation for all widgets:
- ✅ Standardized header with title/subtitle
- ✅ Built-in actions (edit, remove, refresh)
- ✅ Loading states with skeleton screens
- ✅ Error handling with alerts
- ✅ Custom action support
- ✅ Tooltip integration

### 2. **Custom Hooks**

#### `useWidgetData<T>`
Manages data fetching and auto-refresh:
```typescript
const { data, loading, error, refresh, lastUpdated } = useWidgetData(
  fetchSystemHealth,
  {
    enabled: true,
    interval: 30000, // 30 seconds
  }
);
```

#### `useWidgetMetrics<T>`
Computes metrics with trends:
```typescript
const metrics = useWidgetMetrics(data, {
  metrics: [
    { key: 'cpu', label: 'CPU Usage', unit: '%', thresholds: { warning: 70, critical: 90 } }
  ]
});
```

### 3. **Widget Registry System**

#### Registry Features:
- ✅ Centralized widget registration
- ✅ Metadata management (name, description, category, tags)
- ✅ Dynamic widget discovery
- ✅ Search & filter capabilities
- ✅ Configuration schema
- ✅ Size presets for grid layouts

#### Usage:
```typescript
import { widgetRegistry } from './registry';

// Register a widget
widgetRegistry.register({
  metadata: {
    id: 'my-widget',
    name: 'My Widget',
    description: 'A custom widget',
    category: 'analytics',
    icon: 'BarChartOutlined',
    tags: ['analytics', 'custom'],
    size: { minW: 2, minH: 2, defaultW: 3, defaultH: 3 }
  },
  component: MyWidget,
  configSchema: { /* ... */ },
  defaultConfig: { /* ... */ }
});

// Get all widgets
const widgets = widgetRegistry.getAll();

// Search widgets
const results = widgetRegistry.search('analytics');

// Filter by category
const chartWidgets = widgetRegistry.getByCategory('charts');
```

### 4. **Widget Factory**

Dynamic widget creation from instances:
```typescript
import { WidgetFactory, createWidgetInstance } from './registry';

// Create instance
const instance = createWidgetInstance('system-health', {
  title: 'Production Health',
  position: { x: 0, y: 0, w: 4, h: 4 }
});

// Render widget
<WidgetFactory
  instance={instance}
  onRemove={(id) => handleRemove(id)}
  onEdit={(id) => handleEdit(id)}
/>
```

### 5. **Configuration Panel**

Dynamic form generation from schema:
```typescript
<WidgetConfigPanel
  widgetId="system-health"
  config={currentConfig}
  onChange={(newConfig) => handleConfigChange(newConfig)}
/>
```

### 6. **Widget Catalog**

Browse and discover widgets:
```typescript
<WidgetCatalog
  onSelect={(widgetId) => handleAddWidget(widgetId)}
  selectedCategory="analytics"
/>
```

## 🔧 Creating a New Widget

### Step 1: Create Widget Component

```typescript
// MyWidget.tsx
import { memo } from 'react';
import BaseWidget from './base/BaseWidget';
import type { BaseWidgetProps } from './types/widget.types';
import { useWidgetData } from './hooks/useWidgetData';

interface MyWidgetProps extends BaseWidgetProps {
  config?: {
    showDetails?: boolean;
    refreshInterval?: number;
  };
}

function MyWidget({ title, onRemove, onEdit, config = {} }: MyWidgetProps) {
  const { showDetails = true, refreshInterval = 30000 } = config;

  const { data, loading, error, refresh } = useWidgetData(
    fetchMyData,
    { enabled: true, interval: refreshInterval }
  );

  return (
    <BaseWidget
      title={title}
      onRemove={onRemove}
      onEdit={onEdit}
      onRefresh={refresh}
      loading={loading}
      error={error}
    >
      {/* Your widget content */}
      {data && (
        <div>
          <h3>{data.value}</h3>
          {showDetails && <p>{data.details}</p>}
        </div>
      )}
    </BaseWidget>
  );
}

export default memo(MyWidget);
```

### Step 2: Register Widget

```typescript
// In registerWidgets.ts
import MyWidget from '../MyWidget';

widgetRegistry.register({
  metadata: {
    id: 'my-widget',
    name: 'My Awesome Widget',
    description: 'Does amazing things',
    category: 'analytics',
    icon: 'StarOutlined',
    tags: ['custom', 'awesome'],
    version: '1.0.0',
    size: {
      minW: 2,
      minH: 2,
      defaultW: 3,
      defaultH: 3,
    },
  },
  component: MyWidget,
  configSchema: {
    showDetails: {
      type: 'boolean',
      label: 'Show Details',
      description: 'Display additional details',
      defaultValue: true,
    },
    refreshInterval: {
      type: 'number',
      label: 'Refresh Interval (ms)',
      defaultValue: 30000,
      min: 5000,
      max: 300000,
    },
  },
  defaultConfig: {
    showDetails: true,
    refreshInterval: 30000,
  },
});
```

### Step 3: Use Widget

```typescript
import { WidgetFactory, createWidgetInstance } from './widgets/registry';

const instance = createWidgetInstance('my-widget');

<WidgetFactory instance={instance} />
```

## 📊 Widget Categories

- **analytics**: Analytics dashboards and KPIs
- **monitoring**: System and app monitoring
- **iot**: IoT device management
- **charts**: Data visualizations
- **tables**: Tabular data displays
- **maps**: Geographic visualizations
- **controls**: Interactive controls
- **alerts**: Notifications and alerts
- **custom**: Custom widgets

## 🎨 Utilities

### Formatting
```typescript
import {
  formatValue,
  formatPercentage,
  formatBytes,
  formatDuration,
  getRelativeTime,
} from './utils/widgetHelpers';

formatValue(1234.56, '%', 2); // "1234.56%"
formatPercentage(45.678); // "45.7%"
formatBytes(1536000); // "1.46 MB"
formatDuration(45000); // "45s"
getRelativeTime(new Date('2024-01-01')); // "5h ago"
```

### Status Helpers
```typescript
import {
  getStatusColor,
  getStatusFromThreshold,
} from './utils/widgetHelpers';

getStatusColor('success'); // "#52c41a"
getStatusFromThreshold(85, { warning: 70, critical: 90 }); // "warning"
```

### Constants
```typescript
import {
  STATUS_COLORS,
  REFRESH_INTERVALS,
  TIME_RANGES,
} from './utils/constants';

REFRESH_INTERVALS.fast; // 15000 (15 seconds)
STATUS_COLORS.success; // "#52c41a"
```

## 🧪 Testing

```typescript
import { widgetRegistry } from './registry/WidgetRegistry';

// Get registry statistics
const stats = widgetRegistry.getStats();
console.log(stats);
// {
//   total: 18,
//   byCategory: { analytics: 5, monitoring: 4, ... },
//   topTags: [{ tag: 'monitoring', count: 6 }, ...]
// }

// Validate widget instance
import { validateWidgetInstance } from './registry/WidgetFactory';

const validation = validateWidgetInstance(instance);
if (!validation.valid) {
  console.error(validation.errors);
}
```

## 🚀 Best Practices

1. **Always extend BaseWidgetProps**
   ```typescript
   interface MyWidgetProps extends BaseWidgetProps {
     config?: { /* widget-specific config */ };
   }
   ```

2. **Use memo for performance**
   ```typescript
   export default memo(MyWidget);
   ```

3. **Memoize expensive computations**
   ```typescript
   const processedData = useMemo(() => {
     return expensiveCalculation(data);
   }, [data]);
   ```

4. **Extract sub-components**
   ```typescript
   const MetricCard = memo(({ metric }) => {
     return <div>{metric.value}</div>;
   });
   ```

5. **Use type-only imports**
   ```typescript
   import type { BaseWidgetProps } from './types';
   ```

6. **Provide meaningful defaults**
   ```typescript
   const { showDetails = true } = config;
   ```

## 📚 Available Widgets

- ✅ System Health Widget
- ✅ Chart Widget
- ✅ Statistics Widget
- ✅ Data Table Widget
- ✅ Device Status Widget
- ✅ Recent Activity Widget
- ✅ Alerts Widget
- ✅ Map Widget
- ✅ Analytics Widget
- ✅ Performance Metrics Widget
- ✅ Revenue Dashboard Widget
- ✅ User Activity Heatmap Widget
- ✅ API Usage Widget
- ✅ Storage Analytics Widget
- ✅ HVAC Control Widget
- ✅ Lighting Control Widget
- ✅ Metric Widget (Template)
- ✅ List Widget (Template)

## 🔄 Migration Guide

### Old Pattern
```typescript
// ❌ Old way
function OldWidget({ title, onRemove }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return (
    <Card title={title}>
      {data && <div>{data.value}</div>}
    </Card>
  );
}
```

### New Pattern
```typescript
// ✅ New way
function NewWidget({ title, onRemove, config }: BaseWidgetProps) {
  const { data, loading, error } = useWidgetData(fetchData);

  return (
    <BaseWidget
      title={title}
      onRemove={onRemove}
      loading={loading}
      error={error}
    >
      {data && <div>{data.value}</div>}
    </BaseWidget>
  );
}

export default memo(NewWidget);
```

## 🎯 Benefits

- ✅ **Consistency**: All widgets follow same pattern
- ✅ **Reusability**: Shared logic via hooks and base components
- ✅ **Type Safety**: Comprehensive TypeScript types
- ✅ **Performance**: Proper memoization and optimization
- ✅ **Maintainability**: Clear structure and separation of concerns
- ✅ **Scalability**: Easy to add new widgets
- ✅ **Discoverability**: Registry and catalog system
- ✅ **Configurability**: Dynamic config schemas
- ✅ **Developer Experience**: Less boilerplate, better IDE support

## 📝 License

MIT
