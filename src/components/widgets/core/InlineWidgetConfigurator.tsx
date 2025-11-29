/**
 * InlineWidgetConfigurator - Configuration overlay that keeps the widget visible
 * Shows configuration panel alongside the widget instead of hiding it in a drawer
 */

import { useEffect, useState, useRef } from 'react';
import { Form, Input, Select, Switch, Slider, Tabs, Divider, Button } from 'antd';
import {
  SaveOutlined,
  CloseOutlined,
  SettingOutlined,
  EyeOutlined,
  ExpandOutlined,
  CompressOutlined
} from '@ant-design/icons';
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

const BORDER_RADIUS_MARKS = {
  0: '0px',
  8: '8px',
  16: '16px',
  24: '24px',
} as const;

const INPUT_STYLE = { borderRadius: 6, fontSize: 13 } as const;

export default function InlineWidgetConfigurator({
  visible,
  widget,
  onSave,
  onCancel
}: InlineWidgetConfiguratorProps) {
  const [form] = Form.useForm();
  const [previewConfig, setPreviewConfig] = useState<Record<string, unknown>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (widget && visible) {
      const initialValues = {
        title: widget.title,
        ...widget.config,
      };
      form.setFieldsValue(initialValues);
      setPreviewConfig(initialValues);
    }
  }, [widget, form, visible]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, onCancel]);

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

  // Render live preview of the widget
  const renderLiveWidget = () => {
    if (!widget) return null;

    const registration = widgetRegistry.get(widget.type);
    if (!registration) {
      return (
        <div className={styles.errorPreview}>
          Widget type "{widget.type}" not found
        </div>
      );
    }

    try {
      const WidgetComponent = registration.component as React.ComponentType<{
        id: string;
        title: string;
        widgetType: string;
        editMode: boolean;
        config: Record<string, unknown>;
        onConfigChange: () => void;
        disabled?: boolean;
      }>;
      const { title, ...configValues } = previewConfig;

      return (
        <WidgetComponent
          id={widget.id}
          title={(title as string) || widget.title}
          widgetType={widget.type}
          editMode={false}
          config={{ ...widget.config, ...configValues }}
          onConfigChange={() => {}}
          disabled={(configValues.disabled as boolean) || false}
        />
      );
    } catch (error) {
      console.error('Error rendering widget preview:', error);
      return (
        <div className={styles.errorPreview}>
          Error rendering preview
        </div>
      );
    }
  };

  const renderGeneralSettings = () => (
    <div className={styles.formSection}>
      {/* Title Section */}
      <Form.Item
        label={<span className={styles.labelStyle}>Widget Title</span>}
        name="title"
        rules={[{ required: true, message: 'Please enter a widget title' }]}
        style={{ marginBottom: 12 }}
      >
        <Input
          placeholder="Enter widget title"
          style={INPUT_STYLE}
          size="middle"
        />
      </Form.Item>

      {/* Toggle Section */}
      <div className={styles.toggleSection}>
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
            <span className={styles.toggleLabel}>Show Border</span>
          </div>
        </Form.Item>
      </div>

      <Divider style={{ margin: '16px 0', borderColor: '#e5e7eb' }} />

      {/* Theme Section */}
      <Form.Item
        label={<span className={styles.labelStyle}>Color Theme</span>}
        name="colorTheme"
        initialValue="blue"
        style={{ marginBottom: 12 }}
      >
        <Select style={INPUT_STYLE} size="middle" dropdownStyle={{ minWidth: 160 }}>
          {COLOR_THEMES.map((theme) => (
            <Option key={theme.value} value={theme.value}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    background: theme.color,
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}
                />
                <span style={{ fontSize: 13 }}>{theme.label}</span>
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
  );

  const renderWidgetSettings = () => {
    if (!widget) return null;

    return (
      <div className={styles.formSection}>
        <WidgetConfigForm widgetType={widget.type} config={widget.config} />
      </div>
    );
  };

  const tabItems = [
    {
      key: 'general',
      label: (
        <span className={styles.tabLabel}>
          <SettingOutlined /> General
        </span>
      ),
      children: renderGeneralSettings(),
    },
    {
      key: 'specific',
      label: (
        <span className={styles.tabLabel}>
          <EyeOutlined /> Widget
        </span>
      ),
      children: renderWidgetSettings(),
    },
  ];

  if (!visible || !widget) return null;

  return (
    <div className={styles.overlay} onClick={handleCancel}>
      <div
        ref={containerRef}
        className={`${styles.container} ${isExpanded ? styles.expanded : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left side - Live Widget Preview */}
        <div className={styles.previewPanel}>
          <div className={styles.previewHeader}>
            <div className={styles.previewBadge}>
              <EyeOutlined />
              <span>LIVE PREVIEW</span>
            </div>
            <Button
              type="text"
              size="small"
              icon={isExpanded ? <CompressOutlined /> : <ExpandOutlined />}
              onClick={() => setIsExpanded(!isExpanded)}
              className={styles.expandButton}
            />
          </div>
          <div className={styles.previewContent}>
            <div className={styles.widgetWrapper}>
              {renderLiveWidget()}
            </div>
          </div>
          <div className={styles.previewFooter}>
            <span className={styles.previewHint}>
              Changes update in real-time
            </span>
          </div>
        </div>

        {/* Right side - Configuration Panel */}
        <div className={styles.configPanel}>
          <div className={styles.configHeader}>
            <div className={styles.headerContent}>
              <div className={styles.headerIcon}>
                <SettingOutlined />
              </div>
              <div className={styles.headerText}>
                <h3 className={styles.headerTitle}>Configure Widget</h3>
                <p className={styles.headerSubtitle}>{widget.title}</p>
              </div>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleCancel}
              className={styles.closeButton}
            />
          </div>

          <div className={styles.configBody}>
            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleFormChange}
            >
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
                className={styles.tabs}
                size="small"
              />
            </Form>
          </div>

          <div className={styles.configFooter}>
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
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
