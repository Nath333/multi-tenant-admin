/**
 * Chart Widget V2 - Smart Multi-Chart Widget
 * Users can add unlimited charts with different types and data bindings
 */

import { useState, useEffect, useMemo, memo } from 'react';
import { Row, Col, Tabs, Carousel, Empty, Spin } from 'antd';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import ConfigurableWidgetBase from '../../base/ConfigurableWidget';
import ChartConfigPanel from './ChartConfigPanel';
import { generateMockData } from '../../data/mockDataSources';
import { WeeklyCalendar } from '../../shared';
import type { ChartWidgetConfig, ChartElementConfig, ConfigurableWidgetProps } from '../../types/ConfigurableWidget.types';
import type { WeeklySchedule } from '../../shared';

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16'];

interface ChartWidgetProps extends ConfigurableWidgetProps<ChartWidgetConfig> {}

function ChartWidget({ title, config, onConfigChange, onRemove, editMode, className, style }: ChartWidgetProps) {
  const [chartData, setChartData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({});

  // Fetch data for all enabled charts
  useEffect(() => {
    if (!config?.elements) return;

    let mounted = true;
    const intervals: ReturnType<typeof setInterval>[] = [];

    const fetchData = () => {
      const newData: Record<string, any> = {};

      config.elements.forEach((chart) => {
        if (chart.enabled && chart.dataBinding) {
          try {
            const data = generateMockData(chart.dataBinding.mockDataKey);
            newData[chart.id] = data;
          } catch (error) {
            console.error(`Error generating data for chart ${chart.id}:`, error);
            newData[chart.id] = [];
          }
        }
      });

      if (mounted) {
        setChartData(newData);
        setLoading(false);
      }
    };

    setLoading(true);
    fetchData();

    // Set up auto-refresh
    config.elements.forEach((chart) => {
      if (chart.enabled && chart.dataBinding?.refreshInterval) {
        const interval = setInterval(() => {
          if (!mounted) return;
          try {
            const data = generateMockData(chart.dataBinding!.mockDataKey);
            setChartData(prev => ({ ...prev, [chart.id]: data }));
          } catch (error) {
            console.error(`Error refreshing data for chart ${chart.id}:`, error);
          }
        }, chart.dataBinding.refreshInterval);
        intervals.push(interval);
      }
    });

    return () => {
      mounted = false;
      intervals.forEach(clearInterval);
    };
  }, [config?.elements]);

  const handleRefresh = () => {
    if (!config?.elements) return;

    setLoading(true);
    const newData: Record<string, any> = {};

    config.elements.forEach((chart) => {
      if (chart.enabled && chart.dataBinding) {
        const data = generateMockData(chart.dataBinding.mockDataKey);
        newData[chart.id] = data;
      }
    });

    setChartData(newData);
    setLoading(false);
  };

  const renderChart = (chart: ChartElementConfig) => {
    const data = chartData[chart.id] || [];
    const height = config.height || 300;

    if (!chart.enabled) {
      return null;
    }

    if (!chart.dataBinding) {
      return (
        <Empty
          description="No data source bound"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: '48px 0' }}
        />
      );
    }

    // Transform data for charts
    const transformedData = Array.isArray(data)
      ? data.map((item: any, index: number) => ({
          name: item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : `Point ${index + 1}`,
          value: item.value || item.current || 0,
          ...item,
        }))
      : [];

    const commonProps = {
      data: transformedData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chart.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...commonProps}>
              {chart.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" label={chart.xAxisLabel ? { value: chart.xAxisLabel, position: 'insideBottom', offset: -5 } : undefined} />
              <YAxis label={chart.yAxisLabel ? { value: chart.yAxisLabel, angle: -90, position: 'insideLeft' } : undefined} />
              <Tooltip />
              {chart.showLegend && <Legend />}
              <Line type="monotone" dataKey="value" stroke={chart.color || '#1890ff'} strokeWidth={2} dot={false} name={chart.name} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...commonProps}>
              {chart.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" label={chart.xAxisLabel ? { value: chart.xAxisLabel, position: 'insideBottom', offset: -5 } : undefined} />
              <YAxis label={chart.yAxisLabel ? { value: chart.yAxisLabel, angle: -90, position: 'insideLeft' } : undefined} />
              <Tooltip />
              {chart.showLegend && <Legend />}
              <Bar dataKey="value" fill={chart.color || '#1890ff'} name={chart.name} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...commonProps}>
              {chart.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" label={chart.xAxisLabel ? { value: chart.xAxisLabel, position: 'insideBottom', offset: -5 } : undefined} />
              <YAxis label={chart.yAxisLabel ? { value: chart.yAxisLabel, angle: -90, position: 'insideLeft' } : undefined} />
              <Tooltip />
              {chart.showLegend && <Legend />}
              <Area type="monotone" dataKey="value" stroke={chart.color || '#1890ff'} fill={chart.color || '#1890ff'} fillOpacity={0.6} name={chart.name} />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={transformedData.slice(0, 8)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {transformedData.slice(0, 8).map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              {chart.showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ScatterChart {...commonProps}>
              {chart.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" label={chart.xAxisLabel ? { value: chart.xAxisLabel, position: 'insideBottom', offset: -5 } : undefined} />
              <YAxis dataKey="value" label={chart.yAxisLabel ? { value: chart.yAxisLabel, angle: -90, position: 'insideLeft' } : undefined} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              {chart.showLegend && <Legend />}
              <Scatter name={chart.name} data={transformedData} fill={chart.color || '#1890ff'} />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return <Empty description={`Chart type "${chart.chartType}" not yet implemented`} />;
    }
  };

  const enabledCharts = useMemo(() => config?.elements?.filter(c => c.enabled) || [], [config?.elements]);

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Spin size="large" tip="Loading chart data..." />
        </div>
      );
    }

    if (enabledCharts.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No charts configured"
          style={{ padding: '48px 0' }}
        >
          <p style={{ color: '#8c8c8c', fontSize: 13 }}>
            Click the <strong>Configure</strong> button to add charts
          </p>
        </Empty>
      );
    }

    // Grid Layout
    if (config.layout === 'grid') {
      const cols = Math.max(config.gridColumns || 2, 1);
      const span = 24 / cols;

      return (
        <>
          <WeeklyCalendar
            schedule={weeklySchedule}
            onChange={setWeeklySchedule}
            title="Chart Data Weekly Schedule"
          />

          <Row gutter={[16, 16]}>
            {enabledCharts.map((chart) => (
              <Col key={chart.id} span={span} xs={24} sm={24} md={span}>
                <div
                  style={{
                    padding: 16,
                    background: '#fafafa',
                    borderRadius: 8,
                    border: '1px solid #e8e8e8',
                  }}
                >
                  <h4 style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>{chart.name}</h4>
                  {renderChart(chart)}
                </div>
              </Col>
            ))}
          </Row>
        </>
      );
    }

    // Tab Layout
    if (config.layout === 'tabs') {
      return (
        <>
          <WeeklyCalendar
            schedule={weeklySchedule}
            onChange={setWeeklySchedule}
            title="Chart Data Weekly Schedule"
          />

          <Tabs
            items={enabledCharts.map((chart) => ({
              key: chart.id,
              label: chart.name,
              children: (
                <div style={{ padding: '16px 0' }}>
                  {renderChart(chart)}
                </div>
              ),
            }))}
          />
        </>
      );
    }

    // Carousel Layout
    if (config.layout === 'carousel') {
      return (
        <>
          <WeeklyCalendar
            schedule={weeklySchedule}
            onChange={setWeeklySchedule}
            title="Chart Data Weekly Schedule"
          />

          <Carousel autoplay>
            {enabledCharts.map((chart) => (
              <div key={chart.id}>
                <div style={{ padding: 16 }}>
                  <h4 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600, textAlign: 'center' }}>
                    {chart.name}
                  </h4>
                  {renderChart(chart)}
                </div>
              </div>
            ))}
          </Carousel>
        </>
      );
    }

    return null;
  };

  return (
    <ConfigurableWidgetBase
      title={title}
      config={config}
      onConfigChange={onConfigChange}
      onRemove={onRemove}
      editMode={editMode}
      className={className}
      style={style}
      renderConfigPanel={({ config, onChange, onClose }) => (
        <ChartConfigPanel
          config={config}
          onChange={onChange}
          onClose={onClose}
        />
      )}
      onRefresh={handleRefresh}
      loading={loading}
    >
      {renderContent()}
    </ConfigurableWidgetBase>
  );
}

export default memo(ChartWidget);
