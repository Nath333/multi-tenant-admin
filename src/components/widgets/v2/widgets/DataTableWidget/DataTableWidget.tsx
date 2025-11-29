/**
 * Data Table Widget V2 - Smart Multi-Table Widget
 * Users can add unlimited tables with custom columns and data bindings
 */

import { useState, useEffect, useMemo, memo } from 'react';
import { Table, Tabs, Input, Button, Badge, Progress, Tag, Space, Empty, Spin } from 'antd';
import { SearchOutlined, DownloadOutlined, TableOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ConfigurableWidgetBase from '../../base/ConfigurableWidget';
import DataTableConfigPanel from './DataTableConfigPanel';
import { generateMockData } from '../../data/mockDataSources';
import { WeeklyCalendar } from '../../shared';
import type { DataTableWidgetConfig, TableElementConfig, ConfigurableWidgetProps } from '../../types/ConfigurableWidget.types';
import type { WeeklySchedule } from '../../shared';

interface DataTableWidgetProps extends ConfigurableWidgetProps<DataTableWidgetConfig> {}

function DataTableWidget({ title, config, onConfigChange, onRemove, editMode, className, style }: DataTableWidgetProps) {
  const [tableData, setTableData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState<Record<string, string>>({});
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({});

  // Fetch data for all enabled tables
  useEffect(() => {
    if (!config?.elements) return;

    let mounted = true;
    const intervals: number[] = [];

    const fetchData = () => {
      const newData: Record<string, any[]> = {};

      config.elements.forEach((table) => {
        if (table.enabled && table.dataBinding) {
          try {
            const data = generateMockData(table.dataBinding.mockDataKey);
            newData[table.id] = Array.isArray(data) ? data : [];
          } catch (error) {
            console.error(`Error generating data for table ${table.id}:`, error);
            newData[table.id] = [];
          }
        }
      });

      if (mounted) {
        setTableData(newData);
        setLoading(false);
      }
    };

    setLoading(true);
    fetchData();

    // Set up auto-refresh
    config.elements.forEach((table) => {
      if (table.enabled && table.dataBinding?.refreshInterval) {
        const interval = setInterval(() => {
          if (!mounted) return;
          try {
            const data = generateMockData(table.dataBinding!.mockDataKey);
            setTableData(prev => ({ ...prev, [table.id]: Array.isArray(data) ? data : [] }));
          } catch (error) {
            console.error(`Error refreshing data for table ${table.id}:`, error);
          }
        }, table.dataBinding.refreshInterval);
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
    const newData: Record<string, any[]> = {};

    config.elements.forEach((table) => {
      if (table.enabled && table.dataBinding) {
        const data = generateMockData(table.dataBinding.mockDataKey);
        newData[table.id] = Array.isArray(data) ? data : [];
      }
    });

    setTableData(newData);
    setLoading(false);
  };

  const handleExport = (tableId: string) => {
    if (!config?.elements) return;

    const table = config.elements.find(t => t.id === tableId);
    const data = tableData[tableId] || [];

    if (!table || !data.length) return;

    // Convert to CSV
    const headers = table.columns.map(col => col.name).join(',');
    const rows = data.map(row =>
      table.columns.map(col => row[col.dataKey] || '').join(',')
    );
    const csv = [headers, ...rows].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${table.name.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderCellValue = (value: any, renderType: string) => {
    switch (renderType) {
      case 'badge':
        const colorMap: Record<string, string> = {
          online: 'green',
          offline: 'red',
          warning: 'orange',
          error: 'red',
          good: 'green',
          moderate: 'orange',
          poor: 'red',
          completed: 'green',
          'in-progress': 'blue',
          scheduled: 'purple',
          overdue: 'red',
        };
        return <Badge status="default" color={colorMap[value?.toLowerCase()] || 'default'} text={value} />;

      case 'progress':
        return <Progress percent={value || 0} size="small" />;

      case 'date':
        return value ? new Date(value).toLocaleString() : '-';

      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;

      case 'boolean':
        return value ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>;

      case 'text':
      default:
        return value || '-';
    }
  };

  const getTableColumns = (table: TableElementConfig): ColumnsType<any> => {
    return table.columns.map(col => ({
      title: col.name,
      dataIndex: col.dataKey,
      key: col.id,
      width: col.width,
      sorter: col.sortable ? (a, b) => {
        const aVal = a[col.dataKey];
        const bVal = b[col.dataKey];
        if (typeof aVal === 'string') return aVal.localeCompare(bVal);
        return aVal - bVal;
      } : undefined,
      render: (value: any) => renderCellValue(value, col.render || 'text'),
    }));
  };

  const getFilteredData = (tableId: string, data: any[]) => {
    const search = searchText[tableId]?.toLowerCase();
    if (!search) return data;

    return data.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(search)
      )
    );
  };

  const renderTable = (table: TableElementConfig) => {
    if (!table.enabled) return null;

    if (!table.dataBinding) {
      return (
        <Empty
          description="No data source bound"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: '48px 0' }}
        />
      );
    }

    const data = tableData[table.id] || [];
    const filteredData = getFilteredData(table.id, data);
    const columns = getTableColumns(table);

    return (
      <div>
        {(table.showSearch || table.exportable) && (
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            {table.showSearch && (
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined />}
                value={searchText[table.id] || ''}
                onChange={(e) => setSearchText(prev => ({ ...prev, [table.id]: e.target.value }))}
                style={{ width: 300 }}
                allowClear
              />
            )}
            {table.exportable && (
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleExport(table.id)}
              >
                Export CSV
              </Button>
            )}
          </div>
        )}

        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey={(record, index) => record.id || `row-${index}`}
          pagination={table.showPagination ? { pageSize: table.pageSize, showSizeChanger: true, showTotal: (total) => `Total ${total} items` } : false}
          size="small"
          bordered
          loading={loading}
        />
      </div>
    );
  };

  const enabledTables = useMemo(() => config?.elements?.filter(t => t.enabled) || [], [config?.elements]);

  const renderContent = () => {
    if (loading && !Object.keys(tableData).length) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Spin size="large" tip="Loading table data..." />
        </div>
      );
    }

    if (enabledTables.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No tables configured"
          style={{ padding: '48px 0' }}
        >
          <p style={{ color: '#8c8c8c', fontSize: 13 }}>
            Click the <strong>Configure</strong> button to add tables
          </p>
        </Empty>
      );
    }

    // Single table - show directly
    if (enabledTables.length === 1) {
      return (
        <>
          <WeeklyCalendar
            schedule={weeklySchedule}
            onChange={setWeeklySchedule}
            title="Data Table Weekly Schedule"
          />
          {renderTable(enabledTables[0])}
        </>
      );
    }

    // Multiple tables - use tabs
    return (
      <>
        <WeeklyCalendar
          schedule={weeklySchedule}
          onChange={setWeeklySchedule}
          title="Data Table Weekly Schedule"
        />

        <Tabs
          defaultActiveKey={config.defaultView || enabledTables[0]?.id}
          items={enabledTables.map((table) => ({
            key: table.id,
            label: (
              <Space>
                <TableOutlined />
                {table.name}
                <Badge count={tableData[table.id]?.length || 0} showZero style={{ backgroundColor: '#52c41a' }} />
              </Space>
            ),
            children: renderTable(table),
          }))}
        />
      </>
    );
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
        <DataTableConfigPanel
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

export default memo(DataTableWidget);
