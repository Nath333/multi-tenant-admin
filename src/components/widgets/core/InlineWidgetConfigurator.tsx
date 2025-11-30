/**
 * InlineWidgetConfigurator - Simple configuration overlay
 * Shows configuration panel alongside the widget
 */

import { useEffect, useState } from 'react';
import { Form, Input, Select, Switch, Slider, Tabs, Divider, Button } from 'antd';
import { SaveOutlined, CloseOutlined, SettingOutlined, EyeOutlined } from '@ant-design/icons';
import type { Widget } from '../../../store/widgetStore';
import WidgetConfigForm from '../forms/WidgetConfigForm';
import { widgetRegistry } from '../registry/WidgetRegistry';
import styles from './InlineWidgetConfigurator.module.css';

interface InlineWidgetConfiguratorProps {
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

export default function InlineWidgetConfigurator({
  visible,
  widget,
  onSave,
  onCancel
}: InlineWidgetConfiguratorProps) {
  const [form] = Form.useForm();
  const [previewConfig, setPreviewConfig] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (widget && visible) {
      const initialValues = { title: widget.title, ...widget.config };
      form.setFieldsValue(initialValues);
      setPreviewConfig(initialValues);
    }
  }, [widget, form, visible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, onCancel]);

  const handleFormChange = () => setPreviewConfig(form.getFieldsValue());

  const handleSave = () => {
    form.validateFields().then((values) => {
      const { title, ...configValues } = values;
      onSave({ title, config: { ...widget?.config, ...configValues } });
      form.resetFields();
    });
  };

  const renderLiveWidget = () => {
    if (!widget) return null;
    const registration = widgetRegistry.get(widget.type);
    if (!registration) return <div className={styles.errorPreview}>Widget not found</div>;

    try {
      const WidgetComponent = registration.component as unknown as React.ComponentType<Record<string, unknown>>;
      const { title, ...configValues } = previewConfig;
      return (
        <WidgetComponent
          id={widget.id}
          title={title || widget.title}
          widgetType={widget.type}
          editMode={false}
          config={{ ...widget.config, ...configValues }}
          onConfigChange={() => {}}
          disabled={configValues.disabled || false}
        />
      );
    } catch {
      return <div className={styles.errorPreview}>Error rendering preview</div>;
    }
  };

  const tabItems = [
    {
      key: 'general',
      label: <span className={styles.tabLabel}><SettingOutlined /> General</span>,
      children: (
        <div className={styles.formSection}>
          <Form.Item
            label={<span className={styles.labelStyle}>Widget Title</span>}
            name="title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Enter widget title" />
          </Form.Item>

          <div className={styles.toggleSection}>
            <Form.Item name="disabled" valuePropName="checked" initialValue={false} noStyle>
              <div className={styles.toggleItem}>
                <Switch size="small" />
                <span>Disabled</span>
              </div>
            </Form.Item>
            <Form.Item name="showBorder" valuePropName="checked" initialValue={true} noStyle>
              <div className={styles.toggleItem}>
                <Switch size="small" />
                <span>Border</span>
              </div>
            </Form.Item>
          </div>

          <Divider />

          <Form.Item
            label={<span className={styles.labelStyle}>Theme</span>}
            name="colorTheme"
            initialValue="blue"
          >
            <Select>
              {COLOR_THEMES.map((t) => (
                <Option key={t.value} value={t.value}>
                  <div className={styles.themeOption}>
                    <div style={{ width: 12, height: 12, borderRadius: 2, background: t.color }} />
                    {t.label}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className={styles.labelStyle}>Corner Radius</span>}
            name="borderRadius"
            initialValue={8}
          >
            <Slider min={0} max={24} marks={{ 0: '0', 8: '8', 16: '16', 24: '24' }} />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'widget',
      label: <span className={styles.tabLabel}><EyeOutlined /> Widget</span>,
      children: widget && (
        <div className={styles.formSection}>
          <WidgetConfigForm widgetType={widget.type} config={widget.config} />
        </div>
      ),
    },
  ];

  if (!visible || !widget) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.previewPanel}>
          <div className={styles.previewHeader}>
            <EyeOutlined /> Live Preview
          </div>
          <div className={styles.previewContent}>
            <div className={styles.widgetWrapper}>{renderLiveWidget()}</div>
          </div>
        </div>

        <div className={styles.configPanel}>
          <div className={styles.configHeader}>
            <div className={styles.headerContent}>
              <SettingOutlined className={styles.headerIcon} />
              <div>
                <h3 className={styles.headerTitle}>Configure</h3>
                <p className={styles.headerSubtitle}>{widget.title}</p>
              </div>
            </div>
            <Button type="text" icon={<CloseOutlined />} onClick={onCancel} />
          </div>

          <div className={styles.configBody}>
            <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
              <Tabs items={tabItems} size="small" />
            </Form>
          </div>

          <div className={styles.configFooter}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
