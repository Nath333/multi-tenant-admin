/**
 * Specialized Field Components
 * Domain-specific form fields for widget configuration
 *
 * These components encapsulate common widget configuration patterns
 */

import { Form, ColorPicker, Radio, Select } from 'antd';
import type { Color } from 'antd/es/color-picker';

// ============================================================================
// ColorPickerField Component
// ============================================================================

interface ColorPickerFieldProps {
  label: string;
  value?: string;
  onChange: (color: string) => void;
  presets?: string[];
  disabled?: boolean;
  className?: string;
}

export function ColorPickerField({
  label,
  value,
  onChange,
  presets,
  disabled = false,
  className,
}: ColorPickerFieldProps) {
  const handleColorChange = (_: Color, hex: string) => {
    onChange(hex);
  };

  return (
    <Form.Item label={label} className={className}>
      <ColorPicker
        value={value}
        onChange={handleColorChange}
        showText
        disabled={disabled}
        presets={presets ? [{ label: 'Recommended', colors: presets }] : undefined}
      />
    </Form.Item>
  );
}

// ============================================================================
// LayoutSelector Component
// ============================================================================

// All supported layout types across different widget configurations
export type LayoutType = 'grid' | 'tabs' | 'carousel' | 'list' | 'compact' | 'single' | 'multi' | 'zones';

interface LayoutSelectorProps<T extends string = LayoutType> {
  label?: string;
  value: T;
  onChange: (layout: T) => void;
  options?: T[];
  disabled?: boolean;
  className?: string;
}

export function LayoutSelector<T extends string = LayoutType>({
  label = 'Layout Mode',
  value,
  onChange,
  options = ['grid', 'tabs', 'carousel'] as T[],
  disabled = false,
  className,
}: LayoutSelectorProps<T>) {
  const layoutLabels: Record<string, string> = {
    grid: 'Grid',
    tabs: 'Tabs',
    carousel: 'Carousel',
    list: 'List',
    compact: 'Compact',
    single: 'Single',
    multi: 'Multi',
    zones: 'Zones',
  };

  return (
    <Form.Item label={label} className={className}>
      <Radio.Group value={value} onChange={(e) => onChange(e.target.value as T)} disabled={disabled}>
        {options.map((option) => (
          <Radio key={option} value={option}>
            {layoutLabels[option] || option}
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );
}

// ============================================================================
// TimeRangeSelector Component
// ============================================================================

interface TimeRangeSelectorProps {
  label?: string;
  value: '1h' | '24h' | '7d' | '30d';
  onChange: (timeRange: '1h' | '24h' | '7d' | '30d') => void;
  disabled?: boolean;
  className?: string;
}

export function TimeRangeSelector({
  label = 'Time Range',
  value,
  onChange,
  disabled = false,
  className,
}: TimeRangeSelectorProps) {
  const timeRangeOptions = [
    { label: 'Last Hour', value: '1h' as const },
    { label: 'Last 24 Hours', value: '24h' as const },
    { label: 'Last 7 Days', value: '7d' as const },
    { label: 'Last 30 Days', value: '30d' as const },
  ];

  return (
    <Form.Item label={label} className={className}>
      <Select value={value} onChange={onChange} disabled={disabled}>
        {timeRangeOptions.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}

// ============================================================================
// ChartTypeSelector Component
// ============================================================================

import {
  LineChartOutlined,
  BarChartOutlined,
  AreaChartOutlined,
  PieChartOutlined,
  DashOutlined,
} from '@ant-design/icons';
import type { ReactElement } from 'react';
import type { ChartType } from '../types/ConfigurableWidget.types';

interface ChartTypeSelectorProps {
  label?: string;
  value: ChartType;
  onChange: (chartType: ChartType) => void;
  disabled?: boolean;
  className?: string;
}

export function ChartTypeSelector({
  label = 'Chart Type',
  value,
  onChange,
  disabled = false,
  className,
}: ChartTypeSelectorProps) {
  const chartTypeOptions: Array<{ value: ChartType; label: string; icon: ReactElement }> = [
    { value: 'line', label: 'Line Chart', icon: <LineChartOutlined /> },
    { value: 'bar', label: 'Bar Chart', icon: <BarChartOutlined /> },
    { value: 'area', label: 'Area Chart', icon: <AreaChartOutlined /> },
    { value: 'pie', label: 'Pie Chart', icon: <PieChartOutlined /> },
    { value: 'scatter', label: 'Scatter Plot', icon: <DashOutlined /> },
    { value: 'gauge', label: 'Gauge', icon: <DashOutlined /> },
  ];

  return (
    <Form.Item label={label} className={className}>
      <Select value={value} onChange={onChange} disabled={disabled}>
        {chartTypeOptions.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.icon} {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}
