# Drag-and-Drop Widget Canvas - Usage Guide

## Overview
The V2 widgets now support drag-and-drop functionality, allowing users to drag widgets from the catalog and drop them onto the grid canvas.

## Features Implemented

### 1. **WidgetCatalog with Drag Support**
- Location: `src/components/widgets/registry/WidgetCatalog.tsx`
- Enable drag with: `enableDragAndDrop={true}` prop
- Visual feedback: cursor changes, opacity reduction during drag
- Drag data includes: widgetId, widgetName, defaultSize

### 2. **WidgetGrid as Drop Zone**
- Location: `src/components/WidgetGrid.tsx`
- Accepts widgets dropped in edit mode
- Visual indicator when grid is empty
- Validates drag data before adding widget

### 3. **WidgetLayout Integration**
- Location: `src/components/WidgetLayout.tsx`
- `handleDropWidget` callback connects drop to widget addition
- Success message on widget drop
- Automatic scroll to new widget

## How to Use

### Option 1: Use WidgetCatalog Component Directly

```tsx
import { WidgetCatalog } from './components/widgets/registry/WidgetCatalog';

function MyDashboard() {
  const handleWidgetSelect = (widgetId: string) => {
    // Add widget to dashboard
    console.log('Selected widget:', widgetId);
  };

  return (
    <WidgetCatalog
      onSelect={handleWidgetSelect}
      enableDragAndDrop={true}  // Enable drag-and-drop
    />
  );
}
```

### Option 2: Update Existing Modal

Modify `WidgetCatalogModal.tsx` to use the new `WidgetCatalog` component:

```tsx
import { WidgetCatalog } from './widgets/registry/WidgetCatalog';

// In WidgetCatalogModal:
<Modal>
  <WidgetCatalog
    onSelect={onAddWidget}
    enableDragAndDrop={editMode}  // Enable when in edit mode
  />
</Modal>
```

### Option 3: Standalone Drag-and-Drop Demo Page

Create a demo page at `src/pages/WidgetDragDropDemo.tsx`:

```tsx
import { useState } from 'react';
import { Button, Space } from 'antd';
import { WidgetCatalog } from '../components/widgets/registry/WidgetCatalog';
import WidgetGrid from '../components/WidgetGrid';
import { useWidgetStore } from '../store/widgetStore';

export default function WidgetDragDropDemo() {
  const [editMode, setEditMode] = useState(true);
  const { widgets, addWidget, removeWidget, updateLayout } = useWidgetStore();

  const handleDropWidget = (widgetData: {
    widgetId: string;
    widgetName: string;
    defaultSize: { w: number; h: number };
  }) => {
    const maxY = widgets.reduce((max, w) => Math.max(max, w.y + w.h), 0);

    addWidget({
      type: widgetData.widgetId,
      title: widgetData.widgetName,
      x: 0,
      y: maxY,
      w: widgetData.defaultSize.w,
      h: widgetData.defaultSize.h,
    }, 'demo-page');
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Drag-and-Drop Widget Demo</h1>

      <Space style={{ marginBottom: 24 }}>
        <Button onClick={() => setEditMode(!editMode)}>
          {editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
        </Button>
      </Space>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        {/* Catalog Sidebar */}
        <div style={{
          border: '1px solid #e8e8e8',
          borderRadius: 8,
          padding: 16,
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <h3>Widget Catalog</h3>
          <WidgetCatalog
            onSelect={(widgetId) => {
              // Also allow click to add
              const registration = widgetRegistry.get(widgetId);
              if (registration) {
                handleDropWidget({
                  widgetId,
                  widgetName: registration.metadata.name,
                  defaultSize: {
                    w: registration.metadata.size.defaultW,
                    h: registration.metadata.size.defaultH,
                  },
                });
              }
            }}
            enableDragAndDrop={editMode}
          />
        </div>

        {/* Canvas */}
        <div>
          <WidgetGrid
            widgets={widgets.filter(w => w.pageId === 'demo-page')}
            editMode={editMode}
            pageId="demo-page"
            onLayoutChange={updateLayout}
            onRemove={removeWidget}
            onEdit={() => {}}
            onDropWidget={handleDropWidget}
          />
        </div>
      </div>
    </div>
  );
}
```

## Testing Drag-and-Drop

1. **Enable Edit Mode** on any dashboard page
2. **Open Widget Catalog** (click "Add Widget" button)
3. **Drag a widget card** from the catalog
4. **Drop on the grid canvas** - widget appears at bottom of layout
5. **Success message** confirms widget was added

## Visual Feedback

### During Drag:
- Widget card opacity: 50%
- Cursor: "grabbing"
- Drop zone shows "copy" cursor

### On Drop:
- Widget added to bottom of layout
- Success toast notification
- Auto-scroll to new widget location

### Empty Canvas:
- Shows "🎯 Drop Widgets Here" message
- Helpful hint text

## API Reference

### WidgetCatalog Props

```typescript
interface WidgetCatalogProps {
  onSelect?: (widgetId: string) => void;
  selectedCategory?: WidgetCategory;
  enableDragAndDrop?: boolean;  // NEW: Enable drag-and-drop
}
```

### WidgetGrid Props

```typescript
interface WidgetGridProps {
  widgets: Widget[];
  editMode: boolean;
  pageId: string;
  onLayoutChange: (newLayout: Layout[]) => void;
  onRemove: (widgetId: string, pageId: string) => void;
  onEdit: (widget: Widget) => void;
  onDropWidget?: (widgetData: {   // NEW: Handle dropped widgets
    widgetId: string;
    widgetName: string;
    defaultSize: { w: number; h: number };
  }) => void;
}
```

## Drag Data Format

When a widget is dragged, the following data is transmitted:

```json
{
  "widgetId": "chart-v2",
  "widgetType": "chart-v2",
  "widgetName": "Multi-Chart Dashboard",
  "defaultSize": {
    "w": 8,
    "h": 4
  }
}
```

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- Uses HTML5 Drag and Drop API (widely supported)

## Next Steps

To integrate drag-and-drop into the main application:

1. Update `WidgetCatalogModal.tsx` to use new `WidgetCatalog`
2. Pass `enableDragAndDrop={editMode}` to enable during edit mode
3. Ensure `onDropWidget` handler is connected in `WidgetLayout`

The infrastructure is fully implemented and ready to use! 🎉
