import { useEffect, useState } from 'react';
import { Drawer, Form, Input, Select, Switch, Slider, Tabs, Divider, Button } from 'antd';
import { SaveOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import type { Widget } from '../../store/widgetStore';
import WidgetConfigForm from '../widgets/forms/WidgetConfigForm';
import { widgetRegistry } from '../widgets/registry/WidgetRegistry';
import styles from './WidgetConfigModal.module.css';

interface WidgetConfigModalProps {
  visible: boolean;
  widget: Widget | null;
  onSave: (updates: Partial<Widget>) => void;
  onCancel: () => void;
}

const { Option } = Select;

const COLOR_THEMES = [
  { label: 'Blue', value: 'blue', color: '#1890ff' },
  { label: 'Green', value: 'green', color: '#52c41a' },
  { label: 'Purple', value: 'purple', color: '#722ed1' },
  { label: 'Orange', value: 'orange', color: '#fa8c16' },
  { label: 'Red', value: 'red', color: '#f5222d' },
  { label: 'Gradient', value: 'gradient', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
] as const;

const BORDER_RADIUS_MARKS = {
  0: '0px',
  8: '8px',
  16: '16px',
  24: '24px',
} as const;

const INPUT_STYLE = { borderRadius: 6, fontSize: 13 } as const;

function WidgetConfigModal({ visible, widget, onSave, onCancel }: WidgetConfigModalProps) {
  const [form] = Form.useForm();
  const [previewConfig, setPreviewConfig] = useState<any>({});

  useEffect(() => {
    if (widget) {
      const initialValues = {
        title: widget.title,
        ...widget.config,
      };
      form.setFieldsValue(initialValues);
      setPreviewConfig(initialValues);
    }
  }, [widget, form]);

  // Update preview when form values change
  const handleFormChange = () => {
    const values = form.getFieldsValue();
    setPreviewConfig(values);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const { title, ...configValues } = values;
      onSave({
        title,
        config: {
          ...widget?.config,
          ...configValues,
        },
      });
      form.resetFields();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const renderGeneralSettings = () => (
    <div className={styles.formContainer}>
      {/* Title Section */}
      <Form.Item
        label={<span className={styles.labelStyle}>Widget Title</span>}
        name="title"
        rules={[{ required: true, message: 'Please enter a widget title' }]}
        style={{ marginBottom: 10 }}
      >
        <Input
          placeholder="Enter widget title"
          style={INPUT_STYLE}
          size="small"
        />
      </Form.Item>

      {/* Compact Toggle Section */}
      <div className={styles.compactSection}>
        <div className={styles.toggleRow}>
          <Form.Item
            name="disabled"
            valuePropName="checked"
            initialValue={false}
            style={{ marginBottom: 0 }}
          >
            <div className={styles.toggleItem}>
              <Switch size="small" />
              <span className={styles.toggleLabel}>Disabled</span>
            </div>
          </Form.Item>

          <Form.Item
            name="showBorder"
            valuePropName="checked"
            initialValue={true}
            style={{ marginBottom: 0 }}
          >
            <div className={styles.toggleItem}>
              <Switch size="small" />
              <span className={styles.toggleLabel}>Border</span>
            </div>
          </Form.Item>
        </div>
      </div>

      <Divider style={{ margin: '12px 0 10px 0', borderColor: '#e5e7eb' }} />

      {/* Theme & Styling Section */}
      <div className={styles.styleSection}>
        <Form.Item
          label={<span className={styles.labelStyle}>Theme</span>}
          name="colorTheme"
          initialValue="blue"
          style={{ marginBottom: 8 }}
        >
          <Select
            style={INPUT_STYLE}
            size="small"
            dropdownStyle={{ minWidth: 140 }}
          >
            {COLOR_THEMES.map((theme) => (
              <Option key={theme.value} value={theme.value}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 2,
                      background: theme.color,
                      border: '1px solid rgba(0,0,0,0.06)',
                    }}
                  />
                  <span style={{ fontSize: 11 }}>{theme.label}</span>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={<span className={styles.labelStyle}>Corner Radius</span>}
          name="borderRadius"
          initialValue={8}
          style={{ marginBottom: 0 }}
        >
          <Slider
            min={0}
            max={24}
            marks={BORDER_RADIUS_MARKS}
            tooltip={{ formatter: (val) => `${val}px` }}
          />
        </Form.Item>
      </div>
    </div>
  );

  const renderWidgetSpecificSettings = () => {
    if (!widget) return null;

    // Use the centralized WidgetConfigForm component
    return (
      <div className={styles.formContainer}>
        <WidgetConfigForm widgetType={widget.type} config={widget.config} />
      </div>
    );
  };

  const tabItems = [
    {
      key: 'general',
      label: 'General Settings',
      children: renderGeneralSettings(),
    },
    {
      key: 'specific',
      label: 'Widget Settings',
      children: renderWidgetSpecificSettings(),
    },
  ];

  // Render widget preview
  const renderWidgetPreview = () => {
    if (!widget) {
      return (
        <div className={styles.emptyPreview}>
          No widget selected
        </div>
      );
    }

    const registration = widgetRegistry.get(widget.type);
    if (!registration) {
      return (
        <div className={styles.errorPreview}>
          Widget type "{widget.type}" not found in registry
        </div>
      );
    }

    try {
      const WidgetComponent = registration.component as any;
      const { title, ...configValues } = previewConfig;

      return (
        <div className={styles.previewContainer}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginBottom: 8,
            color: '#6366f1',
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.8px'
          }}>
            <EyeOutlined style={{ fontSize: 12 }} />
            <span>PREVIEW</span>
          </div>
          <div className={styles.previewContent}>
            <WidgetComponent
              id={widget.id}
              title={title || widget.title}
              widgetType={widget.type}
              editMode={false}
              config={{ ...widget.config, ...configValues }}
              onConfigChange={() => {}}
              disabled={configValues.disabled || false}
            />
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error rendering widget preview:', error);
      return (
        <div className={styles.errorPreview}>
          <div>Error rendering preview</div>
          <div className={styles.errorDetail}>{String(error)}</div>
        </div>
      );
    }
  };

  return (
    <Drawer
      title={
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            ⚙️
          </div>
          <div>
            <div className={styles.headerTitle}>
              Configure Widget
            </div>
            <div className={styles.headerSubtitle}>
              {widget?.title || 'Widget Settings'}
            </div>
          </div>
        </div>
      }
      open={visible}
      onClose={handleCancel}
      size="large"
      styles={{
        body: {
          padding: 0,
          background: '#fafbfc',
        },
        header: {
          padding: '12px 16px',
          borderBottom: '2px solid #e5e7eb',
          background: 'linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)',
        },
      }}
      footer={
        <div className={styles.footer}>
          <Button
            icon={<CloseOutlined />}
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            className={styles.saveButton}
          >
            Save
          </Button>
        </div>
      }
    >
      <div className={styles.content}>
        {/* Left Panel - Configuration Form */}
        <div className={styles.leftPanel}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              Configuration
            </h3>
            <p className={styles.sectionDescription}>
              Customize widget appearance & behavior
            </p>
          </div>
          <Form
            form={form}
            layout="vertical"
            size="small"
            onValuesChange={handleFormChange}
          >
            <Tabs
              items={tabItems}
              tabBarStyle={{
                marginBottom: 10,
                fontWeight: 600,
                fontSize: 10.5,
                padding: '0 2px',
              }}
              size="small"
              animated={{ inkBar: true, tabPane: false }}
            />
          </Form>
        </div>

        {/* Right Panel - Live Preview */}
        <div className={styles.rightPanel}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              Preview
            </h3>
            <p className={styles.sectionDescription}>
              Live preview of configuration changes
            </p>
          </div>
          {renderWidgetPreview()}
        </div>
      </div>
    </Drawer>
  );
}

export default WidgetConfigModal;
