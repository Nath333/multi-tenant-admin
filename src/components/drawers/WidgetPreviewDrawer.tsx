import { Drawer, Button, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { CachedWidgetPreview } from '../widgets/registry/WidgetPreviewCache';
import type { WidgetDefinition } from '../widgets/registry/registryHelpers';

interface WidgetPreviewDrawerProps {
  visible: boolean;
  widget: WidgetDefinition | null;
  onClose: () => void;
  onAddWidget: (type: string, title: string, config?: Record<string, unknown>) => void;
}

export default function WidgetPreviewDrawer({
  visible,
  widget,
  onClose,
  onAddWidget,
}: WidgetPreviewDrawerProps) {
  const handleAddWidget = () => {
    if (widget) {
      onAddWidget(widget.type, widget.title, widget.defaultConfig);
      onClose();
    }
  };

  return (
    <Drawer
      title={
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            margin: '-24px -24px 24px -24px',
            padding: '24px',
            color: 'white',
          }}
        >
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'white' }}>Widget Preview</h3>
          {widget && (
            <p style={{ margin: '8px 0 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: 15, fontWeight: 400 }}>
              {widget.title}
            </p>
          )}
        </div>
      }
      placement="right"
      size={680}
      open={visible}
      onClose={onClose}
      styles={{
        body: {
          padding: '0 24px 24px 24px',
          background: '#f8fafc',
        },
        header: {
          padding: 0,
          border: 'none',
        },
      }}
      footer={
        <div
          style={{
            padding: '16px 24px',
            background: 'white',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 13, color: '#718096' }}>
            {widget?.tags?.slice(0, 3).map((tag: string) => (
              <Tag key={tag} style={{ margin: '0 4px 0 0', borderRadius: 6 }}>
                {tag}
              </Tag>
            ))}
          </div>
          <Space>
            <Button onClick={onClose} size="large">
              Close
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={handleAddWidget}
              style={{
                borderRadius: 8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                height: 44,
                paddingLeft: 24,
                paddingRight: 24,
              }}
            >
              Add to Dashboard
            </Button>
          </Space>
        </div>
      }
    >
      {widget && (
        <div>
          <div
            style={{
              marginBottom: 20,
              padding: 20,
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <div
                style={{
                  width: 6,
                  height: 20,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 3,
                  marginRight: 12,
                }}
              />
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1a202c' }}>Description</h4>
            </div>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.7, paddingLeft: 18 }}>
              {widget.description}
            </p>
          </div>

          <div
            style={{
              marginBottom: 20,
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                background: 'linear-gradient(to right, #f8fafc, #fff)',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 20,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 3,
                  marginRight: 12,
                }}
              />
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1a202c' }}>Live Preview</h4>
              <Tag color="green" style={{ marginLeft: 'auto', borderRadius: 6 }}>
                Interactive
              </Tag>
            </div>
            <div style={{ padding: 20, minHeight: 320, background: '#fafbfc' }}>
              <CachedWidgetPreview
                widgetId={widget.type}
                width={600}
                height={320}
                mode="full"
              />
            </div>
          </div>

          <div
            style={{
              padding: 20,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
              borderRadius: 12,
              border: '2px solid rgba(102, 126, 234, 0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, position: 'relative' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                💡
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: 15, fontWeight: 700, color: '#667eea' }}>Pro Tip</h4>
                <p style={{ margin: 0, color: '#475569', fontSize: 14, lineHeight: 1.7 }}>
                  This is a live preview with sample data. After adding the widget, you can customize its appearance,
                  behavior, and data sources by clicking the edit icon in the widget&apos;s header.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
