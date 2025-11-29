# Widget Template Guide

This guide explains how to use the `TemplateWidget.tsx` as a starting point for creating new widgets in the application.

## Overview

The `TemplateWidget` is a professional, production-ready template that demonstrates best practices for widget development. It includes all the features and patterns used in modern React applications.

## Features

### ✅ Modern Architecture
- **BaseWidget Integration**: Consistent UI/UX across all widgets
- **Custom Hooks**: Data management with `useWidgetData`
- **Type Safety**: Full TypeScript support with strict types
- **Performance**: Memoization with `memo`, `useMemo`, and `useCallback`

### ✅ Professional UI/UX
- **Responsive Design**: Mobile-first with breakpoints
- **Theming Support**: Multiple color schemes
- **Animations**: Smooth transitions and hover effects
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: Graceful error displays

### ✅ Configuration
- **Flexible Config**: Extensive configuration options
- **Auto-refresh**: Real-time data updates
- **Customizable Display**: Show/hide sections
- **Sorting & Filtering**: Built-in data manipulation

### ✅ Accessibility
- **Semantic HTML**: Proper structure
- **ARIA Support**: Screen reader friendly
- **Keyboard Navigation**: Full keyboard support
- **Color Contrast**: WCAG compliant

## Quick Start

### Step 1: Copy the Template

```bash
cp src/components/widgets/TemplateWidget.tsx src/components/widgets/MyCustomWidget.tsx
```

### Step 2: Rename & Update

Replace all instances of `Template` with your widget name:

```tsx
// Before
function TemplateWidget({ ... }) { ... }
interface TemplateWidgetProps { ... }
interface TemplateData { ... }

// After
function MyCustomWidget({ ... }) { ... }
interface MyCustomWidgetProps { ... }
interface MyCustomData { ... }
```

### Step 3: Define Your Data Structure

Update the interfaces to match your data:

```tsx
interface MyCustomData {
  // Your data structure
  summary: {
    totalUsers: number;
    activeUsers: number;
  };
  users: User[];
  lastUpdated: Date;
}
```

### Step 4: Implement Data Fetching

Replace `fetchTemplateData` with your API call:

```tsx
const fetchMyCustomData = async (): Promise<MyCustomData> => {
  const response = await fetch('/api/my-custom-data');
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
};
```

### Step 5: Customize Configuration

Update the config interface for your needs:

```tsx
interface MyCustomWidgetProps extends BaseWidgetProps {
  config?: {
    displayMode?: 'grid' | 'list';
    showChart?: boolean;
    filterBy?: string;
    // ... your custom options
  };
}
```

### Step 6: Implement Rendering

Update the render logic in the return statement:

```tsx
return (
  <BaseWidget {...baseProps}>
    {data && (
      <>
        {/* Your custom UI here */}
        <MyCustomComponent data={data} />
      </>
    )}
  </BaseWidget>
);
```

## Code Structure

### Recommended File Organization

```tsx
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
// All interfaces and types

// ============================================================================
// CONSTANTS
// ============================================================================
// Static values, colors, configs

// ============================================================================
// API / DATA FETCHING
// ============================================================================
// API functions, data transformers

// ============================================================================
// CHILD COMPONENTS
// ============================================================================
// Small, focused components

// ============================================================================
// MAIN COMPONENT
// ============================================================================
// The main widget component

// ============================================================================
// EXPORTS & USAGE EXAMPLES
// ============================================================================
// Export statement and JSDoc examples
```

## Best Practices

### 1. Type Safety

Always use TypeScript interfaces:

```tsx
// ✅ Good
interface UserData {
  id: string;
  name: string;
  status: WidgetStatus;
}

// ❌ Bad
const userData: any = { ... };
```

### 2. Performance Optimization

Use memoization for expensive operations:

```tsx
// ✅ Good
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.value - b.value);
}, [data]);

// ❌ Bad
const sortedData = data.sort((a, b) => a.value - b.value);
```

### 3. Component Decomposition

Break down complex UI into smaller components:

```tsx
// ✅ Good
const MetricCard = memo(({ metric }) => { ... });
const MetricList = memo(({ metrics }) => (
  <>{metrics.map(m => <MetricCard key={m.id} metric={m} />)}</>
));

// ❌ Bad
// One large component with all logic
```

### 4. Error Handling

Always handle errors gracefully:

```tsx
// ✅ Good
const { data, loading, error } = useWidgetData(fetchData);
// BaseWidget handles error display automatically

// ❌ Bad
const data = await fetchData(); // No error handling
```

### 5. Accessibility

Include ARIA labels and semantic HTML:

```tsx
// ✅ Good
<button aria-label="Refresh data" onClick={refresh}>
  <ReloadOutlined />
</button>

// ❌ Bad
<div onClick={refresh}>Refresh</div>
```

## Configuration Examples

### Example 1: Simple Statistics Widget

```tsx
interface StatsWidgetProps extends BaseWidgetProps {
  config?: {
    metric: 'users' | 'revenue' | 'orders';
    period: 'day' | 'week' | 'month';
  };
}

// Usage
<StatsWidget
  title="Revenue"
  config={{ metric: 'revenue', period: 'month' }}
/>
```

### Example 2: Chart Widget

```tsx
interface ChartWidgetProps extends BaseWidgetProps {
  config?: {
    chartType: 'line' | 'bar' | 'pie';
    dataSource: string;
    showLegend?: boolean;
    showGrid?: boolean;
  };
}

// Usage
<ChartWidget
  title="Sales Trends"
  config={{
    chartType: 'line',
    dataSource: '/api/sales',
    showLegend: true,
  }}
/>
```

### Example 3: Data Table Widget

```tsx
interface TableWidgetProps extends BaseWidgetProps {
  config?: {
    columns: ColumnDef[];
    pageSize?: number;
    sortable?: boolean;
    filterable?: boolean;
  };
}

// Usage
<TableWidget
  title="User List"
  config={{
    columns: [...],
    pageSize: 10,
    sortable: true,
  }}
/>
```

## Advanced Topics

### Custom Hooks

Create custom hooks for reusable logic:

```tsx
// hooks/useChartData.ts
export const useChartData = (url: string, options?: ChartOptions) => {
  const { data, loading, error } = useWidgetData(
    () => fetchChartData(url, options)
  );

  const formattedData = useMemo(() => {
    return formatForChart(data);
  }, [data]);

  return { data: formattedData, loading, error };
};
```

### Theme Integration

Use theme colors consistently:

```tsx
import { STATUS_COLORS } from './utils/constants';

const MyComponent = () => (
  <div style={{ color: STATUS_COLORS.success }}>
    Success message
  </div>
);
```

### Animation Effects

Add smooth animations:

```tsx
const cardStyle = {
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
  boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)',
};
```

### Real-time Updates

Implement WebSocket support:

```tsx
useEffect(() => {
  const ws = new WebSocket('ws://api.example.com/live');

  ws.onmessage = (event) => {
    const newData = JSON.parse(event.data);
    setData(newData);
  };

  return () => ws.close();
}, []);
```

## Testing

### Unit Tests Example

```tsx
import { render, screen } from '@testing-library/react';
import MyCustomWidget from './MyCustomWidget';

describe('MyCustomWidget', () => {
  it('renders title correctly', () => {
    render(<MyCustomWidget title="Test Widget" />);
    expect(screen.getByText('Test Widget')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(<MyCustomWidget title="Test" />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Common Issues

1. **Type Errors with BaseWidgetProps**
   - Ensure you extend `BaseWidgetProps` correctly
   - Import types from `./types/widget.types`

2. **Data Not Updating**
   - Check `autoRefresh` is enabled
   - Verify `refreshInterval` is set
   - Ensure `useWidgetData` is configured correctly

3. **Styling Issues**
   - Use consistent spacing (8px grid system)
   - Follow Ant Design theme variables
   - Test responsive breakpoints

4. **Performance Issues**
   - Use `memo` for expensive components
   - Implement `useMemo` for calculations
   - Use `useCallback` for event handlers

## Resources

- [BaseWidget Documentation](./base/BaseWidget.tsx)
- [Widget Types](./types/widget.types.ts)
- [Widget Utilities](./utils/widgetHelpers.ts)
- [Ant Design Components](https://ant.design/components/overview/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)

## Contributing

When creating new widgets:

1. Follow this template structure
2. Add comprehensive JSDoc comments
3. Include usage examples
4. Write unit tests
5. Update this guide if you add new patterns

## Support

For questions or issues:
- Check existing widgets for reference
- Review the codebase documentation
- Reach out to the team

---

**Happy Widget Building!** 🎉
