import React, { useState } from 'react';
import { Popover, Input, Select, Slider, Switch, Button, Divider, Tabs, Form } from 'antd';
import {
  EditOutlined,
  BgColorsOutlined,
  BorderOuterOutlined,
  CheckOutlined,
  CloseOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import type { Widget } from '../../../store/widgetStore';
import WidgetConfigForm from '../forms/WidgetConfigForm';
import styles from './QuickEditPopover.module.css';

const { Option } = Select;

interface QuickEditPopoverProps {
  widget: Widget;
  children: React.ReactNode;
  onSave: (updates: Partial<Widget>) => void;
  disabled?: boolean;
}

const COLOR_THEMES = [
  { label: 'Blue', value: 'blue', color: '#1890ff' },
  { label: 'Green', value: 'green', color: '#52c41a' },
  { label: 'Purple', value: 'purple', color: '#722ed1' },
  { label: 'Orange', value: 'orange', color: '#fa8c16' },
  { label: 'Red', value: 'red', color: '#f5222d' },
  { label: 'Gradient', value: 'gradient', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
] as const;

const BORDER_RADIUS_MARKS = {
  0: '0',
  8: '8',
  16: '16',
  24: '24',
} as const;

export default function QuickEditPopover({
  widget,
  children,
  onSave,
  disabled = false,
}: QuickEditPopoverProps) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(widget.title);
  const [colorTheme, setColorTheme] = useState<string>((widget.config?.colorTheme as string) || 'blue');
  const [borderRadius, setBorderRadius] = useState<number>((widget.config?.borderRadius as number) || 8);
  const [showBorder, setShowBorder] = useState<boolean>((widget.config?.showBorder as boolean) ?? true);
  const [widgetDisabled, setWidgetDisabled] = useState<boolean>((widget.config?.disabled as boolean) ?? false);
  const [activeTab, setActiveTab] = useState('general');

  // Sync with widget prop changes
  React.useEffect(() => {
    if (open) {
      setTitle(widget.title);
      setColorTheme((widget.config?.colorTheme as string) || 'blue');
      setBorderRadius((widget.config?.borderRadius as number) || 8);
      setShowBorder((widget.config?.showBorder as boolean) ?? true);
      setWidgetDisabled((widget.config?.disabled as boolean) ?? false);
      // Set form values for widget-specific settings
      form.setFieldsValue(widget.config || {});
    }
  }, [widget, open, form]);

  const handleSave = () => {
    const formValues = form.getFieldsValue();
    onSave({
      title,
      config: {
        ...widget.config,
        ...formValues,
        colorTheme,
        borderRadius,
        showBorder,
        disabled: widgetDisabled,
      },
    });
    setOpen(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setTitle(widget.title);
    setColorTheme((widget.config?.colorTheme as string) || 'blue');
    setBorderRadius((widget.config?.borderRadius as number) || 8);
    setShowBorder((widget.config?.showBorder as boolean) ?? true);
    setWidgetDisabled((widget.config?.disabled as boolean) ?? false);
    form.setFieldsValue(widget.config || {});
    setActiveTab('general');
    setOpen(false);
  };

  // General Settings Tab
  const generalTab = (
    <div className={styles.tabContent}>
      {/* Title */}
      <div className={styles.section}>
        <label className={styles.label}>Widget Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter widget title"
          size="small"
          className={styles.input}
        />
      </div>

      {/* Toggles */}
      <div className={styles.toggleSection}>
        <div className={styles.toggleItem}>
          <Switch
            size="small"
            checked={showBorder}
            onChange={setShowBorder}
          />
          <span className={styles.toggleLabel}>Border</span>
        </div>
        <div className={styles.toggleItem}>
          <Switch
            size="small"
            checked={widgetDisabled}
            onChange={setWidgetDisabled}
          />
          <span className={styles.toggleLabel}>Disabled</span>
        </div>
      </div>

      <Divider className={styles.divider} />

      {/* Theme */}
      <div className={styles.section}>
        <label className={styles.label}>
          <BgColorsOutlined style={{ marginRight: 4, fontSize: 10 }} />
          Theme
        </label>
        <Select
          value={colorTheme}
          onChange={setColorTheme}
          size="small"
          className={styles.select}
          dropdownStyle={{ minWidth: 120 }}
        >
          {COLOR_THEMES.map((theme) => (
            <Option key={theme.value} value={theme.value}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: theme.color,
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}
                />
                <span style={{ fontSize: 11 }}>{theme.label}</span>
              </div>
            </Option>
          ))}
        </Select>
      </div>

      {/* Border Radius */}
      <div className={styles.section}>
        <label className={styles.label}>
          <BorderOuterOutlined style={{ marginRight: 4, fontSize: 10 }} />
          Corner Radius: {borderRadius}px
        </label>
        <Slider
          min={0}
          max={24}
          step={4}
          value={borderRadius}
          onChange={setBorderRadius}
          marks={BORDER_RADIUS_MARKS}
          tooltip={{ formatter: (val) => `${val}px` }}
        />
      </div>
    </div>
  );

  // Widget-Specific Settings Tab
  const widgetTab = (
    <div className={styles.tabContent}>
      <Form
        form={form}
        layout="vertical"
        size="small"
      >
        <WidgetConfigForm
          widgetType={widget.type}
          config={widget.config}
        />
      </Form>
    </div>
  );

  const tabItems = [
    {
      key: 'general',
      label: (
        <span style={{ fontSize: 9, fontWeight: 600 }}>
          <SettingOutlined style={{ marginRight: 4 }} />
          GENERAL
        </span>
      ),
      children: generalTab,
    },
    {
      key: 'specific',
      label: (
        <span style={{ fontSize: 9, fontWeight: 600 }}>
          <AppstoreOutlined style={{ marginRight: 4 }} />
          WIDGET
        </span>
      ),
      children: widgetTab,
    },
  ];

  const content = (
    <div className={styles.quickEditContainer}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="small"
        className={styles.tabs}
      />

      {/* Actions */}
      <div className={styles.actions}>
        <Button
          size="small"
          icon={<CloseOutlined />}
          onClick={handleCancel}
          className={styles.cancelBtn}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          size="small"
          icon={<CheckOutlined />}
          onClick={handleSave}
          className={styles.saveBtn}
        >
          Apply
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      title={
        <div className={styles.header}>
          <EditOutlined style={{ color: '#6366f1' }} />
          <span>Quick Edit</span>
        </div>
      }
      trigger="click"
      open={open && !disabled}
      onOpenChange={setOpen}
      placement="leftTop"
      overlayClassName={styles.quickEditPopover}
      arrow={{ pointAtCenter: true }}
      destroyTooltipOnHide
    >
      {children}
    </Popover>
  );
}
