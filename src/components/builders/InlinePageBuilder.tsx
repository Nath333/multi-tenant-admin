import { useState, useMemo } from 'react';
import { Button, Card, Modal, Form, Input, Select, Typography, Space, message, Empty, Row, Col, Tooltip, Tag, Divider, Badge } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  CloseOutlined,
  EyeOutlined,
  StarFilled,
  DashboardOutlined,
} from '@ant-design/icons';
import GridLayout, { type Layout } from 'react-grid-layout';
import { usePagesStore } from '../../store/pagesStore';
import type { PageWidget } from '../../store/pagesStore';
import { useAuthStore } from '../../store/authStore';
import { getWidgetMockData } from '../../services/mockData';
import { widgetRegistry } from '../widgets/registry/WidgetRegistry';
import '../widgets/v2/registry/registerV2Widgets';  // Import V2 widgets
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../widgets/core/WidgetLayout.css';

const { Text } = Typography;

// Category display names mapping
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  analytics: 'Analytics',
  monitoring: 'Monitoring',
  iot: 'IoT & Devices',
  charts: 'Data',
  tables: 'Data',
  maps: 'Maps',
  controls: 'Controls',
  alerts: 'Alerts',
  custom: 'Custom',
  bms: 'BMS Control',
};

// Category colors for visual consistency
const CATEGORY_COLORS: Record<string, string> = {
  analytics: '#1890ff',
  monitoring: '#52c41a',
  iot: '#722ed1',
  charts: '#13c2c2',
  tables: '#fa8c16',
  maps: '#eb2f96',
  controls: '#2f54eb',
  alerts: '#ff4d4f',
  custom: '#8c8c8c',
  bms: '#faad14',
};

// Mark popular widgets (can be customized)
const POPULAR_WIDGETS = new Set([
  'stats',
  'chart',
  'system-health',
  'alerts',
  'advanced-lighting',
  'electrical-panel',
  'fire-safety',
  'hvac-control',
]);

interface InlinePageBuilderProps {
  pageId: string;
}

export default function InlinePageBuilder({ pageId }: InlinePageBuilderProps) {
  const { getPage, updatePage, addWidgetToPage, removeWidgetFromPage, updateWidgetInPage } = usePagesStore();
  const { currentTenant } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<PageWidget | null>(null);
  const [selectedWidgetType, setSelectedWidgetType] = useState<string | null>(null);
  const [form] = Form.useForm();

  const page = getPage(pageId);

  // Dynamically load all widgets from registry
  const widgetTypes = useMemo(() => {
    const allWidgets = widgetRegistry.getAll();
    return allWidgets.map((registration) => ({
      value: registration.metadata.id,
      label: registration.metadata.name,
      description: registration.metadata.description,
      category: CATEGORY_DISPLAY_NAMES[registration.metadata.category] || registration.metadata.category,
      color: CATEGORY_COLORS[registration.metadata.category] || '#8c8c8c',
      popular: POPULAR_WIDGETS.has(registration.metadata.id),
      size: {
        w: registration.metadata.size.defaultW,
        h: registration.metadata.size.defaultH,
      },
    }));
  }, []);

  // Create widgetComponents map from registry
  const widgetComponents = useMemo(() => {
    const allWidgets = widgetRegistry.getAll();
    const components: Record<string, React.ComponentType<any>> = {};
    allWidgets.forEach((registration) => {
      components[registration.metadata.id] = registration.component;
    });
    return components;
  }, []);

  if (!page) {
    return <Empty description="Page not found" />;
  }

  const handleLayoutChange = (newLayout: Layout[]) => {
    // Calculate canvas boundaries based on grid system
    const COLS = 12;
    const CANVAS_HEIGHT_PX = 2500;
    const ROW_HEIGHT = 80;
    const MARGIN = 16;
    const maxRows = Math.floor((CANVAS_HEIGHT_PX - MARGIN * 2) / (ROW_HEIGHT + MARGIN));

    const updatedWidgets = page.widgets.map((widget) => {
      const layoutItem = newLayout.find((item) => item.i === widget.id);
      if (layoutItem) {
        // Boundary detection: Constrain X within grid columns
        const constrainedX = Math.max(0, Math.min(layoutItem.x, COLS - layoutItem.w));

        // Boundary detection: Constrain Y within canvas height
        const constrainedY = Math.max(0, Math.min(layoutItem.y, maxRows - layoutItem.h));

        // Ensure width doesn't exceed grid
        const constrainedW = Math.min(layoutItem.w, COLS - constrainedX);

        // Ensure height doesn't exceed canvas
        const constrainedH = Math.min(layoutItem.h, maxRows - constrainedY);

        return {
          ...widget,
          layout: {
            x: constrainedX,
            y: constrainedY,
            w: constrainedW,
            h: constrainedH,
          },
        };
      }
      return widget;
    });

    updatePage(page.id, { widgets: updatedWidgets });
  };

  const handleAddOrUpdateWidget = (values: { type: string; title: string; config?: Record<string, unknown> }) => {
    const { type, title, config } = values;
    // Merge user-provided config with defaults
    const defaultConfig = getWidgetMockData(type, currentTenant?.id);
    const mergedConfig = { ...defaultConfig, ...(config || {}) };

    if (editingWidget) {
      updateWidgetInPage(page.id, editingWidget.id, {
        title: title,
        type: type,
        config: mergedConfig,
      });
      message.success('Widget updated successfully!');
    } else {
      const widgetType = widgetTypes.find(t => t.value === type);
      const newWidget: PageWidget = {
        id: `widget-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        type: type,
        title: title,
        config: mergedConfig,
        layout: {
          x: 0,
          y: Infinity,
          w: widgetType?.size.w || 4,
          h: widgetType?.size.h || 3,
        },
      };

      addWidgetToPage(page.id, newWidget);
      message.success('Widget added successfully!');
    }

    setIsModalOpen(false);
    setEditingWidget(null);
    setSelectedWidgetType(null);
    form.resetFields();
  };

  const handleRemoveWidget = (widgetId: string) => {
    removeWidgetFromPage(page.id, widgetId);
    message.success('Widget removed!');
  };

  const handleEditWidget = (widget: PageWidget) => {
    setEditingWidget(widget);
    setSelectedWidgetType(widget.type);
    form.setFieldsValue({
      title: widget.title,
      type: widget.type,
      config: widget.config || {},
    });
    setIsModalOpen(true);
  };

  const layout = page.widgets.map((widget) => {
    return {
      i: widget.id,
      x: widget.layout.x,
      y: widget.layout.y,
      w: widget.layout.w,
      h: widget.layout.h,
      minW: 2,  // Allow resizing smaller
      minH: 2,  // Allow resizing smaller
      maxW: 12, // Full width
      maxH: 20, // Tall widgets allowed
    };
  });

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingWidget(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Add Widget
        </Button>
      </Space>

      {page.widgets.length === 0 ? (
        <Card>
          <Empty description="No widgets yet">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingWidget(null);
                form.resetFields();
                setIsModalOpen(true);
              }}
            >
              Add Your First Widget
            </Button>
          </Empty>
        </Card>
      ) : (
        <div className="grid-container" style={{ minHeight: '2500px' }}>
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={80}
            width={1200}
            onLayoutChange={handleLayoutChange}
            isDraggable={true}
            isResizable={true}
            draggableHandle=".drag-handle"
            compactType={null}
            preventCollision={false}
            margin={[16, 16]}
            containerPadding={[20, 20]}
            useCSSTransforms={true}
            transformScale={1}
            resizeHandles={['se', 'sw', 'ne', 'nw', 's', 'e', 'w', 'n']}
            verticalCompact={false}
            autoSize={true}
            isBounded={false}
            allowOverlap={true}
          >
            {page.widgets.map((widget) => {
              const WidgetComponent = widgetComponents[widget.type];
              if (!WidgetComponent) return null;

              // Get the widget registration to access default config
              const registration = widgetRegistry.get(widget.type);
              const widgetConfig = widget.config || registration?.defaultConfig || {};

              return (
                <div key={widget.id} style={{ position: 'relative', height: '100%' }} className="widget-card">
                  <div
                    className="drag-handle"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 36,
                      background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.08) 0%, rgba(24, 144, 255, 0.12) 100%)',
                      backdropFilter: 'blur(8px)',
                      cursor: 'grab',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 12px',
                      borderRadius: '8px 8px 0 0',
                      borderBottom: '1px solid rgba(24, 144, 255, 0.15)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <Space size={8}>
                      <div style={{
                        width: 4,
                        height: 16,
                        background: 'linear-gradient(180deg, #1890ff 0%, #096dd9 100%)',
                        borderRadius: 2,
                      }} />
                      <Text style={{ fontSize: 12, color: '#1890ff', fontWeight: 500 }}>
                        ⋮⋮ Drag to move
                      </Text>
                      <Tag color="cyan" style={{ margin: 0, fontSize: 10, padding: '0 6px' }}>
                        {widget.layout.w}×{widget.layout.h}
                      </Tag>
                    </Space>
                    <Space size="small">
                      <Tooltip title="Edit widget">
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditWidget(widget);
                          }}
                          style={{ color: '#1890ff', padding: '0 8px' }}
                        />
                      </Tooltip>
                      <Tooltip title="Remove widget">
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<CloseOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveWidget(widget.id);
                          }}
                          style={{ padding: '0 8px' }}
                        />
                      </Tooltip>
                    </Space>
                  </div>
                  <div style={{ marginTop: 36 }}>
                    <WidgetComponent
                      config={widgetConfig}
                      title={widget.title}
                      onConfigChange={(newConfig: Record<string, unknown>) => {
                        updateWidgetInPage(page.id, widget.id, { config: newConfig });
                      }}
                      editMode={true}
                    />
                  </div>
                </div>
              );
            })}
          </GridLayout>
        </div>
      )}

      <Modal
        title={
          <Space>
            {editingWidget ? <EditOutlined /> : <PlusOutlined />}
            <span>{editingWidget ? 'Edit Widget' : 'Add Widget'}</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingWidget(null);
          setSelectedWidgetType(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editingWidget ? 'Update Widget' : 'Add Widget'}
        width={900}
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrUpdateWidget}>
          <Form.Item
            label="Widget Title"
            name="title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="e.g., Temperature Monitor" />
          </Form.Item>

          <Form.Item
            label="Widget Type"
            name="type"
            rules={[{ required: true, message: 'Please select a widget type' }]}
          >
            <Select
              placeholder="Select widget type"
              onChange={(value) => setSelectedWidgetType(value)}
              optionLabelProp="label"
              disabled={!!editingWidget}
            >
              {widgetTypes.map((type) => (
                <Select.Option key={type.value} value={type.value} label={type.label}>
                  <Space>
                    <div>
                      <div style={{ fontWeight: 500 }}>
                        {type.label}
                        {type.popular && <Tag color="gold" style={{ marginLeft: 8, fontSize: 10 }}>POPULAR</Tag>}
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {type.description}
                      </Text>
                    </div>
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Widget configuration would go here */}
        </Form>

        {selectedWidgetType && (
          <Card
            title={
              <Space>
                <EyeOutlined style={{ color: '#1890ff' }} />
                <Text strong>Live Preview</Text>
                <Badge
                  count={`${widgetTypes.find(t => t.value === selectedWidgetType)?.size.w}x${widgetTypes.find(t => t.value === selectedWidgetType)?.size.h} grid`}
                  style={{ backgroundColor: '#52c41a' }}
                />
              </Space>
            }
            style={{
              marginTop: 16,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
              border: `2px solid ${widgetTypes.find(t => t.value === selectedWidgetType)?.color}40`,
            }}
          >
            <div style={{
              padding: 16,
              background: 'white',
              borderRadius: 8,
              minHeight: 200,
            }}>
              {(() => {
                const WidgetComponent = widgetComponents[selectedWidgetType];
                if (!WidgetComponent) return <Empty description="Preview not available" />;

                const previewConfig = getWidgetMockData(selectedWidgetType, currentTenant?.id);
                const previewTitle = form.getFieldValue('title') || `Sample ${widgetTypes.find(t => t.value === selectedWidgetType)?.label}`;

                return <WidgetComponent {...previewConfig} title={previewTitle} />;
              })()}
            </div>
          </Card>
        )}

        <Divider />
        <div>
          <Space>
            <DashboardOutlined style={{ color: '#1890ff' }} />
            <Text strong>Available Widgets</Text>
          </Space>
        </div>
        <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
          {widgetTypes.map((type) => {
            const isSelected = selectedWidgetType === type.value;
            return (
              <Col span={12} key={type.value}>
                <Card
                  size="small"
                  hoverable
                  onClick={() => {
                    form.setFieldsValue({ type: type.value });
                    setSelectedWidgetType(type.value);
                  }}
                  style={{
                    cursor: 'pointer',
                    border: isSelected ? `2px solid ${type.color}` : '1px solid #d9d9d9',
                    background: isSelected ? `${type.color}15` : 'white',
                  }}
                >
                  <Space>
                    <div>
                      <Text strong style={{ fontSize: 13 }}>{type.label}</Text>
                      {type.popular && <StarFilled style={{ color: '#faad14', fontSize: 12, marginLeft: 4 }} />}
                      <div style={{ fontSize: 11, color: '#666' }}>
                        {type.size.w}×{type.size.h} · {type.category}
                      </div>
                    </div>
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Modal>
    </div>
  );
}
