/**
 * Chart Widget Configuration Panel - REFACTORED VERSION
 * Now uses reusable components to reduce code from 380 lines to ~120 lines!
 *
 * This demonstrates the power of the new component library.
 * Compare this with ChartConfigPanel.tsx.backup to see the difference.
 */

import { Form, Space, Tag } from 'antd';
import type { ReactElement } from 'react';
import {
  LineChartOutlined,
  BarChartOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import type { ChartWidgetConfig, ChartElementConfig } from '../../types/ConfigurableWidget.types';

// Import all reusable components
import {
  ConfigPanelLayout,
  ConfigSection,
  ElementListManager,
  TextField,
  NumberField,
  SwitchField,
  LayoutSelector,
  TimeRangeSelector,
  ColorPickerField,
  ChartTypeSelector,
  DataBindingForm,
} from '../../base';

interface ChartConfigPanelProps {
  config: ChartWidgetConfig;
  onChange: (newConfig: ChartWidgetConfig) => void;
  onClose: () => void;
}

const CHART_TYPE_ICONS: Record<string, ReactElement> = {
  line: <LineChartOutlined />,
  bar: <BarChartOutlined />,
  area: <LineChartOutlined />,
  pie: <LineChartOutlined />,
  scatter: <LineChartOutlined />,
  gauge: <LineChartOutlined />,
};

export default function ChartConfigPanel({ config, onChange, onClose }: ChartConfigPanelProps) {
  // Ensure config has default values
  const safeConfig: ChartWidgetConfig = {
    elements: config?.elements || [],
    layout: config?.layout || 'grid',
    gridColumns: config?.gridColumns || 2,
    height: config?.height || 300,
    timeRange: config?.timeRange || '24h',
  };

  // Note: allCompatibleDataSources not needed here as DataBindingForm handles it internally

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleAddChart = () => {
    const newChart: ChartElementConfig = {
      id: `chart-${Date.now()}`,
      name: `Chart ${safeConfig.elements.length + 1}`,
      enabled: true,
      displayOrder: safeConfig.elements.length,
      type: 'chart',
      chartType: 'line',
      showLegend: true,
      showGrid: true,
      color: '#1890ff',
    };

    onChange({
      ...safeConfig,
      elements: [...safeConfig.elements, newChart],
    });
  };

  const handleDeleteChart = (chartId: string) => {
    onChange({
      ...safeConfig,
      elements: safeConfig.elements.filter(e => e.id !== chartId),
    });
  };

  const handleUpdateChart = (chartId: string, updates: Partial<ChartElementConfig>) => {
    onChange({
      ...safeConfig,
      elements: safeConfig.elements.map(e =>
        e.id === chartId ? { ...e, ...updates } : e
      ),
    });
  };

  const handleUpdateGlobalSettings = (updates: Partial<ChartWidgetConfig>) => {
    onChange({ ...safeConfig, ...updates });
  };

  // ============================================================================
  // Render Functions
  // ============================================================================

  const renderChartHeader = (chart: ChartElementConfig) => (
    <>
      {CHART_TYPE_ICONS[chart.chartType]}
      <span style={{ fontWeight: 500 }}>{chart.name}</span>
    </>
  );

  const renderChartBadges = (chart: ChartElementConfig) => (
    <>
      {!chart.enabled && <Tag color="red">Disabled</Tag>}
      {chart.dataBinding && (
        <Tag color="green" icon={<LinkOutlined />}>
          Bound
        </Tag>
      )}
    </>
  );

  const renderChartForm = (chart: ChartElementConfig) => (
    <Form layout="vertical">
      {/* Basic Settings */}
      <TextField
        label="Chart Name"
        value={chart.name}
        onChange={(name) => handleUpdateChart(chart.id, { name })}
        placeholder="e.g., Temperature Trends"
      />

      <ChartTypeSelector
        value={chart.chartType}
        onChange={(chartType) => handleUpdateChart(chart.id, { chartType })}
      />

      <ColorPickerField
        label="Chart Color"
        value={chart.color}
        onChange={(color) => handleUpdateChart(chart.id, { color })}
        presets={['#1890ff', '#52c41a', '#fa8c16', '#eb2f96', '#722ed1']}
      />

      {/* Data Binding */}
      <DataBindingForm
        value={chart.dataBinding}
        onChange={(binding) => handleUpdateChart(chart.id, { dataBinding: binding })}
        dataSourceTypes={['historical-timeseries', 'realtime-sensor', 'aggregated-metrics']}
      />

      {/* Axis Labels */}
      <TextField
        label="X-Axis Label"
        value={chart.xAxisLabel}
        onChange={(xAxisLabel) => handleUpdateChart(chart.id, { xAxisLabel })}
        placeholder="e.g., Time"
      />

      <TextField
        label="Y-Axis Label"
        value={chart.yAxisLabel}
        onChange={(yAxisLabel) => handleUpdateChart(chart.id, { yAxisLabel })}
        placeholder="e.g., Value"
      />

      {/* Display Options */}
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <SwitchField
          label="Show Legend"
          checked={chart.showLegend}
          onChange={(showLegend) => handleUpdateChart(chart.id, { showLegend })}
        />

        <SwitchField
          label="Show Grid"
          checked={chart.showGrid}
          onChange={(showGrid) => handleUpdateChart(chart.id, { showGrid })}
        />

        <SwitchField
          label="Enabled"
          checked={chart.enabled}
          onChange={(enabled) => handleUpdateChart(chart.id, { enabled })}
        />
      </Space>
    </Form>
  );

  // ============================================================================
  // Main Render
  // ============================================================================

  return (
    <ConfigPanelLayout onCancel={onClose}>
      {/* Global Settings Section */}
      <ConfigSection title="Global Settings" Icon={LineChartOutlined}>
        <Form layout="vertical">
          <LayoutSelector
            value={safeConfig.layout}
            onChange={(layout) => handleUpdateGlobalSettings({ layout: layout as 'grid' | 'tabs' | 'carousel' })}
            options={['grid', 'tabs', 'carousel']}
          />

          {safeConfig.layout === 'grid' && (
            <NumberField
              label="Grid Columns"
              value={safeConfig.gridColumns}
              onChange={(gridColumns) => handleUpdateGlobalSettings({ gridColumns: gridColumns || 2 })}
              min={1}
              max={3}
            />
          )}

          <NumberField
            label="Chart Height"
            value={safeConfig.height}
            onChange={(height) => handleUpdateGlobalSettings({ height: height || 300 })}
            min={200}
            max={800}
            step={50}
            unit="px"
          />

          <TimeRangeSelector
            value={safeConfig.timeRange || '24h'}
            onChange={(timeRange) => handleUpdateGlobalSettings({ timeRange })}
          />
        </Form>
      </ConfigSection>

      {/* Charts Section */}
      <ElementListManager
        elements={safeConfig.elements}
        onAdd={handleAddChart}
        onDelete={handleDeleteChart}
        renderElement={renderChartForm}
        renderHeader={renderChartHeader}
        renderHeaderBadges={renderChartBadges}
        emptyText="No charts configured"
        addButtonText="Add Chart"
        title="Charts"
        titleIcon={<BarChartOutlined className="config-section-title-icon" />}
        className="config-section"
      />
    </ConfigPanelLayout>
  );
}
