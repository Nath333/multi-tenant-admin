/**
 * WidgetPreviewCache - Shared preview rendering cache
 * Prevents duplicate rendering when widgets are previewed in multiple locations
 * Uses React.memo and singleton pattern to cache widget preview instances
 */

import { memo, useMemo } from 'react';
import { widgetRegistry } from './WidgetRegistry';

interface CachedWidgetPreviewProps {
  widgetId: string;
  width?: number;
  height?: number;
  mode?: 'thumbnail' | 'full';
}

/**
 * Cache storage for widget preview components
 * Maps widgetId to memoized component instance
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const previewCache = new Map<string, React.ComponentType<any>>();

/**
 * Get or create a memoized widget preview component
 */
const getMemoizedPreview = (widgetId: string) => {
  // Check if we already have a memoized version
  if (previewCache.has(widgetId)) {
    return previewCache.get(widgetId)!;
  }

  // Get widget registration
  const registration = widgetRegistry.get(widgetId);

  if (!registration) {
    return null;
  }

  // Create memoized version of the widget component
  const MemoizedWidget = memo(registration.component);

  // Store in cache
  previewCache.set(widgetId, MemoizedWidget);

  return MemoizedWidget;
};

/**
 * CachedWidgetPreview - Renders widget previews with shared caching
 *
 * Features:
 * - Shared cache between WidgetCatalog thumbnail and modal preview
 * - Memoized component instances to prevent re-renders
 * - Two modes: 'thumbnail' for small previews, 'full' for detailed previews
 */
export const CachedWidgetPreview = memo<CachedWidgetPreviewProps>(({
  widgetId,
  width = 300,
  height = 200,
  mode = 'thumbnail'
}) => {
  // Get the memoized widget component from cache
  const MemoizedWidget = useMemo(() => getMemoizedPreview(widgetId), [widgetId]);
  const registration = useMemo(() => widgetRegistry.get(widgetId), [widgetId]);

  if (!MemoizedWidget || !registration) {
    return (
      <div
        style={{
          width,
          height,
          background: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          border: '1px solid #e8e8e8',
          color: '#999',
          fontSize: 12,
        }}
      >
        No preview available
      </div>
    );
  }

  const config = registration.defaultConfig || {};

  // Thumbnail mode - scaled down, no interactions
  if (mode === 'thumbnail') {
    return (
      <div
        style={{
          width,
          height,
          transform: 'scale(0.8)',
          transformOrigin: 'top left',
          overflow: 'hidden',
          borderRadius: 8,
          border: '1px solid #e8e8e8',
          background: '#fff',
          pointerEvents: 'none',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: width / 0.8,
            height: height / 0.8,
          }}
        >
          <MemoizedWidget
            title={registration.metadata.name}
            config={config}
            onConfigChange={() => {}} // No-op for preview mode
            className="widget-preview-thumbnail"
          />
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'transparent',
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }

  // Full mode - full size preview with minimal scaling
  return (
    <div
      style={{
        width,
        height,
        overflow: 'hidden',
        borderRadius: 8,
        background: '#fff',
        pointerEvents: 'none',
        position: 'relative',
      }}
    >
      <MemoizedWidget
        title={registration.metadata.name}
        config={config}
        onConfigChange={() => {}} // No-op for preview mode
        className="widget-preview-full"
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'transparent',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
});

CachedWidgetPreview.displayName = 'CachedWidgetPreview';

/**
 * Clear the preview cache (useful for HMR or testing)
 */
export const clearPreviewCache = () => {
  previewCache.clear();
};

/**
 * Preload widget previews into cache
 * Useful for warming up cache on initial load
 */
export const preloadWidgetPreviews = (widgetIds: string[]) => {
  widgetIds.forEach(widgetId => getMemoizedPreview(widgetId));
};

/**
 * Get cache statistics
 */
export const getPreviewCacheStats = () => {
  return {
    size: previewCache.size,
    widgetIds: Array.from(previewCache.keys()),
  };
};
