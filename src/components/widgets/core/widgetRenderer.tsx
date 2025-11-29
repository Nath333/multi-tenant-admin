import { Card } from 'antd';
import type { Widget } from '../../../store/widgetStore';
import { widgetRegistry } from '../registry/WidgetRegistry';
import WidgetErrorBoundary from './WidgetErrorBoundary';

interface WidgetRendererProps {
  widget: Widget;
  editMode: boolean;
  onRemove: (widgetId: string, pageId: string) => void;
  onEdit: (widget: Widget) => void;
  onConfigChange?: (widgetId: string, newConfig: any) => void;
  pageId: string;
}

export const renderWidget = ({
  widget,
  editMode,
  onRemove,
  onEdit,
  onConfigChange,
  pageId,
}: WidgetRendererProps) => {
  const registration = widgetRegistry.get(widget.type);

  if (!registration) {
    return (
      <Card title={widget.title} style={{ border: '2px solid #ff4d4f' }}>
        <div style={{ padding: 20, textAlign: 'center', color: '#ff4d4f' }}>
          <strong>Unknown widget type:</strong> {widget.type}
          <br />
          <small>This widget is not registered in the system.</small>
        </div>
      </Card>
    );
  }

  const WidgetComponent = registration.component as any;

  return (
    <WidgetErrorBoundary
      widgetTitle={widget.title}
      onRemove={editMode ? () => onRemove(widget.id, pageId) : undefined}
    >
      <WidgetComponent
        id={widget.id}
        title={widget.title}
        widgetType={widget.type}
        editMode={editMode}
        config={widget.config || registration.defaultConfig}
        onConfigChange={(newConfig: any) => {
          if (onConfigChange) {
            onConfigChange(widget.id, newConfig);
          }
        }}
        onRemove={editMode ? () => onRemove(widget.id, pageId) : undefined}
        onEdit={() => onEdit(widget)}
        disabled={widget.disabled || widget.config?.disabled || false}
      />
    </WidgetErrorBoundary>
  );
};
