/**
 * Chart Widget Configuration Panel - ULTRA-REFACTORED VERSION
 * Uses reusable hooks and components for maximum code reduction.
 *
 * Code reduced from 380 lines (original) -> 250 lines (v1 refactor) -> ~150 lines (v2 ultra)
 */

import { Form, Space } from 'antd';
import type { ReactElement } from 'react';
import {
  LineChartOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import type { ChartWidgetConfig, ChartElementConfig } from '../../types/ConfigurableWidget.types';

// Import reusable components
import {
  ConfigPanelLayout,
  ConfigSection,
  ElementListManager,
  ElementHeaderWithBadges,
  InfoTag,
  TextField,
  NumberField,
  SwitchField,
  LayoutSelector,
  TimeRangeSelector,
  ColorPickerField,
  ChartTypeSelector,
  DataBindingForm,
} from '../../base';

// Import reusable hooks
import { useElementManager } from '../../hooks';

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

const CHART_DEFAULTS: Partial<ChartWidgetConfig> = {
  layout: 'grid',
  gridColumns: 2,
  height: 300,
  timeRange: '24h',
};

export default function ChartConfigPanel({ config, onChange, onClose }: ChartConfigPanelProps) {
  // Use element manager hook for all CRUD operations
  const { safeConfig, handleAdd, handleDelete, handleUpdate, handleUpdateGlobal } = useElementManager<
    ChartWidgetConfig,
    ChartElementConfig
  >({
    config,
    onChange,
    defaults: CHART_DEFAULTS,
    createNewElement: (elements) => ({
      id: `chart-${Date.now()}`,
      name: `Chart ${elements.length + 1}`,
      enabled: true,
      displayOrder: elements.length,
      type: 'chart',
      chartType: 'line',
      showLegend: true,
      showGrid: true,
      color: '#1890ff',
    }),
  });

  // Render header with icon based on chart type
  const renderChartHeader = (chart: ChartElementConfig) => (
    <ElementHeaderWithBadges
      element={chart}
      icon={CHART_TYPE_ICONS[chart.chartType] || <LineChartOutlined />}
      extraTags={<InfoTag color="purple">{chart.chartType}</InfoTag>}
    />
  );

  // Render form for each chart element
  const renderChartForm = (chart: ChartElementConfig) => (
    <Form layout="vertical">
      <TextField
        label="Chart Name"
        value={chart.name}
        onChange={(name) => handleUpdate(chart.id, { name })}
        placeholder="e.g., Temperature Trends"
      />

      <ChartTypeSelector
        value={chart.chartType}
        onChange={(chartType) => handleUpdate(chart.id, { chartType })}
      />

      <ColorPickerField
        label="Chart Color"
        value={chart.color}
        onChange={(color) => handleUpdate(chart.id, { color })}
        presets={['#1890ff', '#52c41a', '#fa8c16', '#eb2f96', '#722ed1']}
      />

      <DataBindingForm
        value={chart.dataBinding}
        onChange={(binding) => handleUpdate(chart.id, { dataBinding: binding })}
        dataSourceTypes={['historical-timeseries', 'realtime-sensor', 'aggregated-metrics']}
      />

      <TextField
        label="X-Axis Label"
        value={chart.xAxisLabel}
        onChange={(xAxisLabel) => handleUpdate(chart.id, { xAxisLabel })}
        placeholder="e.g., Time"
      />

      <TextField
        label="Y-Axis Label"
        value={chart.yAxisLabel}
        onChange={(yAxisLabel) => handleUpdate(chart.id, { yAxisLabel })}
        placeholder="e.g., Value"
      />

      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <SwitchField
          label="Show Legend"
          checked={chart.showLegend}
          onChange={(showLegend) => handleUpdate(chart.id, { showLegend })}
        />
        <SwitchField
          label="Show Grid"
          checked={chart.showGrid}
          onChange={(showGrid) => handleUpdate(chart.id, { showGrid })}
        />
        <SwitchField
          label="Enabled"
          checked={chart.enabled}
          onChange={(enabled) => handleUpdate(chart.id, { enabled })}
        />
      </Space>
    </Form>
  );

  return (
    <ConfigPanelLayout onCancel={onClose}>
      <ConfigSection title="Global Settings" Icon={LineChartOutlined}>
        <Form layout="vertical">
          <LayoutSelector
            value={safeConfig.layout}
            onChange={(layout) => handleUpdateGlobal({ layout: layout as 'grid' | 'tabs' | 'carousel' })}
            options={['grid', 'tabs', 'carousel']}
          />

          {safeConfig.layout === 'grid' && (
            <NumberField
              label="Grid Columns"
              value={safeConfig.gridColumns}
              onChange={(gridColumns) => handleUpdateGlobal({ gridColumns: gridColumns || 2 })}
              min={1}
              max={3}
            />
          )}

          <NumberField
            label="Chart Height"
            value={safeConfig.height}
            onChange={(height) => handleUpdateGlobal({ height: height || 300 })}
            min={200}
            max={800}
            step={50}
            unit="px"
          />

          <TimeRangeSelector
            value={safeConfig.timeRange || '24h'}
            onChange={(timeRange) => handleUpdateGlobal({ timeRange })}
          />
        </Form>
      </ConfigSection>

      <ElementListManager
        elements={safeConfig.elements}
        onAdd={handleAdd}
        onDelete={handleDelete}
        renderElement={renderChartForm}
        renderHeader={renderChartHeader}
        emptyText="No charts configured"
        addButtonText="Add Chart"
        title="Charts"
        titleIcon={<BarChartOutlined className="config-section-title-icon" />}
        className="config-section"
      />
    </ConfigPanelLayout>
  );
}
