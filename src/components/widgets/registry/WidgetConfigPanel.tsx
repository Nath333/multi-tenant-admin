import { Form, Input, InputNumber, Select, Switch, Slider, ColorPicker } from 'antd';
import { memo, useMemo } from 'react';
import type { ConfigField, WidgetRegistration } from './widgetRegistry.types';
import { widgetRegistry } from './WidgetRegistry';

/**
 * WidgetConfigPanel - Dynamic configuration form for widgets
 * Generates form fields based on widget config schema
 */

interface WidgetConfigPanelProps {
  widgetId: string;
  config?: Record<string, unknown>;
  onChange?: (config: Record<string, unknown>) => void;
}

export const WidgetConfigPanel = memo<WidgetConfigPanelProps>(
  ({ widgetId, config = {}, onChange }) => {
    const [form] = Form.useForm();

    // Get widget registration
    const registration = useMemo<WidgetRegistration | undefined>(
      () => widgetRegistry.get(widgetId),
      [widgetId]
    );

    if (!registration || !registration.configSchema) {
      return (
        <div style={{ padding: 16, textAlign: 'center', color: '#999' }}>
          No configuration options available for this widget.
        </div>
      );
    }

    const { configSchema, defaultConfig } = registration;

    // Handle form value changes
    const handleValuesChange = (_: unknown, allValues: Record<string, unknown>) => {
      onChange?.(allValues);
    };

    // Render form field based on schema type
    const renderField = (key: string, schema: ConfigField) => {
      const value = config[key] ?? schema.defaultValue ?? defaultConfig?.[key];

      switch (schema.type) {
        case 'string':
          return (
            <Form.Item
              key={key}
              name={key}
              label={schema.label}
              tooltip={schema.description}
              rules={[
                { required: schema.required, message: `${schema.label} is required` },
              ]}
              initialValue={value}
            >
              <Input placeholder={`Enter ${schema.label.toLowerCase()}`} />
            </Form.Item>
          );

        case 'number':
          return (
            <Form.Item
              key={key}
              name={key}
              label={schema.label}
              tooltip={schema.description}
              rules={[
                { required: schema.required, message: `${schema.label} is required` },
              ]}
              initialValue={value}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={schema.min}
                max={schema.max}
                step={schema.step}
                placeholder={`Enter ${schema.label.toLowerCase()}`}
              />
            </Form.Item>
          );

        case 'boolean':
          return (
            <Form.Item
              key={key}
              name={key}
              label={schema.label}
              tooltip={schema.description}
              valuePropName="checked"
              initialValue={value}
            >
              <Switch />
            </Form.Item>
          );

        case 'select':
          return (
            <Form.Item
              key={key}
              name={key}
              label={schema.label}
              tooltip={schema.description}
              rules={[
                { required: schema.required, message: `${schema.label} is required` },
              ]}
              initialValue={value}
            >
              <Select
                placeholder={`Select ${schema.label.toLowerCase()}`}
                options={schema.options}
              />
            </Form.Item>
          );

        case 'multiselect':
          return (
            <Form.Item
              key={key}
              name={key}
              label={schema.label}
              tooltip={schema.description}
              rules={[
                { required: schema.required, message: `${schema.label} is required` },
              ]}
              initialValue={value}
            >
              <Select
                mode="multiple"
                placeholder={`Select ${schema.label.toLowerCase()}`}
                options={schema.options}
              />
            </Form.Item>
          );

        case 'range':
          return (
            <Form.Item
              key={key}
              name={key}
              label={schema.label}
              tooltip={schema.description}
              rules={[
                { required: schema.required, message: `${schema.label} is required` },
              ]}
              initialValue={value}
            >
              <Slider min={schema.min} max={schema.max} step={schema.step} />
            </Form.Item>
          );

        case 'color':
          return (
            <Form.Item
              key={key}
              name={key}
              label={schema.label}
              tooltip={schema.description}
              rules={[
                { required: schema.required, message: `${schema.label} is required` },
              ]}
              initialValue={value}
            >
              <ColorPicker showText />
            </Form.Item>
          );

        default:
          return null;
      }
    };

    return (
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        style={{ maxWidth: 600 }}
      >
        {Object.entries(configSchema).map(([key, schema]) => renderField(key, schema))}
      </Form>
    );
  }
);

WidgetConfigPanel.displayName = 'WidgetConfigPanel';

/**
 * Hook for managing widget configuration
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useWidgetConfig(widgetId: string, initialConfig?: Record<string, unknown>) {
  const registration = widgetRegistry.get(widgetId);

  const config = useMemo(() => {
    if (!registration) return initialConfig || {};

    return {
      ...registration.defaultConfig,
      ...initialConfig,
    };
  }, [registration, initialConfig]);

  return {
    config,
    schema: registration?.configSchema,
    hasConfig: !!registration?.configSchema,
  };
}
