/**
 * WidgetPreview - Live miniature preview of widgets
 * Renders actual widget components in a scaled-down, non-interactive state
 */

import { memo } from 'react';
import { widgetRegistry } from './WidgetRegistry';

interface WidgetPreviewProps {
  widgetId: string;
  width?: number;
  height?: number;
}

export const WidgetPreview = memo<WidgetPreviewProps>(({
  widgetId,
  width = 300,
  height = 200
}) => {
  const registration = widgetRegistry.get(widgetId);

  if (!registration) {
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

  const WidgetComponent = registration.component;
  const config = registration.defaultConfig || {};

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
        <WidgetComponent
          title={registration.metadata.name}
          config={config}
          onConfigChange={() => {}} // No-op for preview mode
          className="widget-preview"
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
});

WidgetPreview.displayName = 'WidgetPreview';
