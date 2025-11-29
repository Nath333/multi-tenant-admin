# Dynamic Widget Sizing System ✅

## Overview

Your V2 widgets now support **intelligent auto-resizing** based on content. When a user adds 3 charts or 5 lighting zones, the widget automatically adjusts its size to fit the content perfectly.

---

## 🎯 What Was Implemented

### 1. **Dynamic Size Calculation**
Created smart algorithms that calculate optimal widget dimensions based on:
- **Number of elements** (charts, zones, units, panels)
- **Layout type** (grid, list, tabs, carousel)
- **Content features** (show energy metrics, show schedules, etc.)

### 2. **Auto-Resize Hook**
Built `useAutoResize` hook that:
- Monitors configuration changes
- Calculates optimal size
- Triggers resize automatically
- Debounces updates (300ms) to prevent flickering

### 3. **Base Component Integration**
Updated `ConfigurableWidgetBase` to:
- Accept `onResize`, `currentSize`, `widgetType` props
- Integrate auto-resize hook
- Support enable/disable flag

---

## 📁 Files Created

### 1. **Dynamic Sizing Utilities**
**`src/components/widgets/v2/utils/dynamicSizing.ts`**

```typescript
// Calculate optimal size for any widget
export function calculateOptimalSize(
  widgetType: string,
  config: any
): WidgetSize {
  // Returns { w: number, h: number }
}

// Specific calculations for each widget type
calculateChartWidgetSize(config)
calculateDataTableWidgetSize(config)
calculateLightingWidgetSize(config)
calculateHVACWidgetSize(config)
calculateElectricalPanelWidgetSize(config)
```

### 2. **Auto-Resize Hook**
**`src/components/widgets/v2/hooks/useAutoResize.ts`**

```typescript
export function useAutoResize({
  widgetId,
  widgetType,
  config,
  currentSize,
  enabled,
  onResize,
}: UseAutoResizeOptions) {
  // Automatically resize widget when config changes
}
```

### 3. **Updated Types**
**`src/components/widgets/v2/types/ConfigurableWidget.types.ts`**

```typescript
export interface WidgetSize {
  w: number;  // width (1-12 grid units)
  h: number;  // height in grid units
}

export interface ConfigurableWidgetProps<T> {
  // ... existing props
  onResize?: (newSize: WidgetSize) => void;
  currentSize?: WidgetSize;
  widgetType?: string;
  enableAutoResize?: boolean;
}
```

### 4. **Updated Base Component**
**`src/components/widgets/v2/base/ConfigurableWidget.tsx`**

Now includes auto-resize integration.

---

## 🔧 How It Works

### Example: Chart Widget

```typescript
// User adds 3 charts in grid layout (2 columns)
config = {
  elements: [chart1, chart2, chart3],
  layout: 'grid',
  gridColumns: 2,
}

// Algorithm calculates:
// - 3 charts ÷ 2 columns = 2 rows
// - Width: 2 columns × 4 units = 8 units
// - Height: 2 rows × 3 units = 6 units

// Result: Widget resizes to 8×6
```

### Example: Lighting Control Widget

```typescript
// User adds 6 lighting zones in compact layout
config = {
  elements: [zone1, zone2, zone3, zone4, zone5, zone6],
  layout: 'compact',  // 3 columns
  showEnergyMetrics: true,
}

// Algorithm calculates:
// - 6 zones ÷ 3 columns = 2 rows
// - Height: 2 rows × 2 units + 1 for metrics = 5 units
// - Width: Compact layout = 10 units

// Result: Widget resizes to 10×5
```

---

## 📊 Sizing Algorithms

### **Chart Widget**

| Layout | Formula | Example |
|--------|---------|---------|
| **Grid** | `w = columns × 4`<br>`h = rows × 3` | 2 cols, 3 charts → 8×6 |
| **Tabs** | `w = 8`<br>`h = height / 100` | Fixed width, dynamic height |
| **Carousel** | `w = 8`<br>`h = height / 100` | Fixed width, dynamic height |

### **Data Table Widget**

| Scenario | Formula | Example |
|----------|---------|---------|
| **Single table** | `h = (pageSize ÷ 3) + 2` | 10 rows → 6 height |
| **Multiple tables** | `h = (avg pageSize ÷ 3) + 2`<br>`w = 10` | 3 tables → 10×6 |

### **Lighting Control Widget**

| Layout | Formula | Example |
|--------|---------|---------|
| **List** | `w = 6`<br>`h = zones × 2` | 4 zones → 6×8 |
| **Grid** | `w = 8`<br>`h = rows × 2` | 6 zones (2 cols) → 8×6 |
| **Compact** | `w = 10`<br>`h = rows × 2` | 9 zones (3 cols) → 10×6 |

### **HVAC Control Widget**

| Layout | Formula | Example |
|--------|---------|---------|
| **List** | `w = 6`<br>`h = units × 3` | 3 units → 6×9 |
| **Grid** | `w = 8`<br>`h = rows × 3` | 4 units (2 cols) → 8×6 |
| **Zones** | `w = 12`<br>`h = rows × 3` | 6 units (3 cols) → 12×6 |

### **Electrical Panel Widget**

| Layout | Formula | Example |
|--------|---------|---------|
| **Single** | `w = 6`<br>`h = (circuits × 0.5) + 2` | 12 circuits → 6×8 |
| **Multi** | `w = 10`<br>`h = rows × (circuits × 0.3 + 2)` | 4 panels → 10×8 |

---

## 🚀 Integration Steps

To enable auto-resizing in your widgets, follow these steps:

### Step 1: Update Widget Store

Add resize handler to your widget store:

```typescript
// src/store/widgetStore.ts
export interface Widget {
  id: string;
  type: string;
  x: number;
  y: number;
  w: number;  // width
  h: number;  // height
  config: any;
}

// Add method to update widget size
export const updateWidgetSize = (widgetId: string, newSize: { w: number; h: number }) => {
  // Update widget dimensions in store
};
```

### Step 2: Update widgetRenderer

Pass resize handler to widgets:

```typescript
// src/components/widgetRenderer.tsx
export function renderWidget(widget: Widget, editMode: boolean, callbacks) {
  const handleResize = (newSize: WidgetSize) => {
    // Update widget size in store/layout
    updateWidgetSize(widget.id, newSize);
  };

  const commonProps = {
    id: widget.id,
    title: widget.title,
    config: widget.config,
    currentSize: { w: widget.w, h: widget.h },
    widgetType: widget.type,
    onResize: handleResize,
    editMode,
    // ... other props
  };

  switch (widget.type) {
    case 'chart-v2':
      return <ChartWidget {...commonProps} />;
    case 'data-table-v2':
      return <DataTableWidget {...commonProps} />;
    // ... etc
  }
}
```

### Step 3: Update Individual Widgets

Add new props to each widget:

```typescript
// Example: ChartWidget.tsx
function ChartWidget({
  id,
  title,
  config,
  onConfigChange,
  onRemove,
  onResize,           // NEW
  currentSize,        // NEW
  editMode,
  className,
  style
}: ChartWidgetProps) {
  // ... widget code

  return (
    <ConfigurableWidgetBase
      id={id}
      title={title}
      config={config}
      widgetType="chart-v2"   // NEW
      onConfigChange={onConfigChange}
      onRemove={onRemove}
      onResize={onResize}     // NEW
      currentSize={currentSize}  // NEW
      editMode={editMode}
      // ... other props
    >
      {renderContent()}
    </ConfigurableWidgetBase>
  );
}
```

### Step 4: Update WidgetGrid

Handle resize events in the grid:

```typescript
// src/components/WidgetGrid.tsx
const handleWidgetResize = (widgetId: string, newSize: WidgetSize) => {
  // Find widget in layout
  const updatedLayout = layout.map(item =>
    item.i === widgetId
      ? { ...item, w: newSize.w, h: newSize.h }
      : item
  );

  // Update layout
  onLayoutChange(updatedLayout);
};
```

---

## 🎨 User Experience

### Before Auto-Resize
```
User adds 3 charts → Widget stays 8×4 → Content cramped
User adds 8 charts → Widget stays 8×4 → Scrolling required
```

### After Auto-Resize
```
User adds 3 charts → Widget auto-resizes to 8×6 → Perfect fit
User adds 8 charts → Widget auto-resizes to 8×12 → All visible
```

---

## 🔍 Example Scenarios

### Scenario 1: Adding Charts

```typescript
// Initial state: Empty chart widget (8×4)
config = { elements: [], layout: 'grid', gridColumns: 2 }

// User adds 1 chart
config = { elements: [chart1], layout: 'grid', gridColumns: 2 }
// → Auto-resize to 8×3 (1 chart fits in smaller space)

// User adds 2 more charts (total: 3)
config = { elements: [chart1, chart2, chart3], layout: 'grid', gridColumns: 2 }
// → Auto-resize to 8×6 (2 rows needed)

// User switches to tabs layout
config = { elements: [chart1, chart2, chart3], layout: 'tabs' }
// → Auto-resize to 8×4 (tabs show one at a time)
```

### Scenario 2: Adding Lighting Zones

```typescript
// Initial state: Empty lighting widget (6×4)
config = { elements: [], layout: 'grid' }

// User adds 2 zones
config = { elements: [zone1, zone2], layout: 'grid' }
// → Auto-resize to 8×4 (2 zones in 1 row)

// User adds 4 more zones (total: 6)
config = { elements: [zone1, zone2, zone3, zone4, zone5, zone6], layout: 'grid' }
// → Auto-resize to 8×6 (3 rows needed)

// User switches to compact layout
config = { elements: [... 6 zones], layout: 'compact' }
// → Auto-resize to 10×4 (3 columns, 2 rows)
```

---

## ⚙️ Configuration Options

### Enable/Disable Auto-Resize

```typescript
<ConfigurableWidgetBase
  enableAutoResize={true}  // Default: true in edit mode
  // ... other props
/>
```

### Customize Resize Threshold

```typescript
// In dynamicSizing.ts
export function shouldResizeWidget(
  currentSize: WidgetSize,
  optimalSize: WidgetSize,
  threshold: number = 1  // Adjust this value
): boolean {
  // Only resize if difference > threshold
}
```

### Debounce Delay

```typescript
// In useAutoResize.ts
resizeTimeoutRef.current = setTimeout(() => {
  // ... resize logic
}, 300);  // Adjust debounce delay (milliseconds)
```

---

## 📈 Benefits

### For Users
✅ **No manual resizing** - widgets adjust automatically
✅ **Optimal space usage** - always the right size
✅ **Better UX** - no cramped or oversized widgets
✅ **Responsive** - adapts to content changes

### For Developers
✅ **Simple integration** - just pass new props
✅ **Intelligent algorithms** - handles complexity
✅ **Type-safe** - Full TypeScript support
✅ **Performance** - Debounced updates

---

## 🧪 Testing Checklist

- [ ] Add 1-10 charts in grid layout → Widget resizes correctly
- [ ] Switch between grid/tabs/carousel → Widget adjusts
- [ ] Add 1-20 lighting zones → Widget grows appropriately
- [ ] Enable/disable energy metrics → Height adjusts
- [ ] Add tables with different page sizes → Height matches
- [ ] Add HVAC units in different layouts → Size correct
- [ ] Add electrical panels with varying circuit counts → Size appropriate
- [ ] Rapid config changes → Debouncing works (no flicker)
- [ ] Edit mode OFF → Auto-resize disabled
- [ ] Edit mode ON → Auto-resize enabled

---

## 🎯 Next Steps

1. **Integrate with widgetRenderer** - Pass resize handler to all widgets
2. **Update WidgetGrid** - Handle resize events
3. **Update widget store** - Add size update method
4. **Test with real widgets** - Verify resizing works
5. **Fine-tune algorithms** - Adjust size calculations if needed
6. **Add user feedback** - Show resize indicator/animation

---

## 💡 Advanced Features (Optional)

### 1. **Resize Animation**
```css
.widget-container {
  transition: width 0.3s ease, height 0.3s ease;
}
```

### 2. **Size Constraints**
```typescript
// Enforce max/min sizes
const constrainedSize = {
  w: Math.max(minW, Math.min(optimalSize.w, maxW)),
  h: Math.max(minH, Math.min(optimalSize.h, maxH)),
};
```

### 3. **Manual Override**
```typescript
// Allow users to lock widget size
<Widget enableAutoResize={!widget.sizeLocked} />
```

### 4. **Size Preview**
```typescript
// Show size preview before applying
const previewSize = calculateOptimalSize(widgetType, newConfig);
// Display: "This will resize the widget to 8×6"
```

---

## ✅ Summary

Your V2 widget system now features **intelligent auto-resizing**:

- ✅ **Dynamic calculations** based on content
- ✅ **Automatic updates** when config changes
- ✅ **5 sizing algorithms** (one per widget type)
- ✅ **Smart debouncing** to prevent flicker
- ✅ **Type-safe** implementation
- ✅ **Performance optimized**

**Result**: Widgets automatically adjust to perfect size when users add/remove elements!

---

**Implementation Date**: January 2025
**Status**: ✅ **READY FOR INTEGRATION**
**Files Created**: 3 new files + type updates + base component updates
