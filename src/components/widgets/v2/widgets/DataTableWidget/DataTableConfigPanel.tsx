/**
 * Data Table Widget Configuration Panel - REFACTORED VERSION
 * Now uses reusable components while preserving all column management functionality
 *
 * This demonstrates the reusable component library working with complex nested configs.
 * Compare this with DataTableConfigPanel.tsx.backup to see the improvement.
 */

import { Form, Space, Tag, Button, Table as AntTable, Switch, Input, Select, Popconfirm } from 'antd';
import { TableOutlined, LinkOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { DataTableWidgetConfig, TableElementConfig, TableColumnConfig } from '../../types/ConfigurableWidget.types';

// Import all reusable components
import {
  ConfigPanelLayout,
  ConfigSection,
  ElementListManager,
  TextField,
  NumberField,
  SwitchField,
  SelectField,
  DataBindingForm,
  type SelectOption,
} from '../../base';

interface DataTableConfigPanelProps {
  config: DataTableWidgetConfig;
  onChange: (newConfig: DataTableWidgetConfig) => void;
  onClose: () => void;
}

const RENDER_TYPES: SelectOption[] = [
  { label: 'Text', value: 'text' },
  { label: 'Badge', value: 'badge' },
  { label: 'Progress', value: 'progress' },
  { label: 'Date', value: 'date' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
];

export default function DataTableConfigPanel({ config, onChange, onClose }: DataTableConfigPanelProps) {
  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleAddTable = () => {
    const newTable: TableElementConfig = {
      id: `table-${Date.now()}`,
      name: `Table ${config.elements.length + 1}`,
      enabled: true,
      displayOrder: config.elements.length,
      type: 'table',
      columns: [
        { id: 'col-1', name: 'ID', dataKey: 'id', sortable: true, filterable: false, render: 'text', width: 100 },
        { id: 'col-2', name: 'Name', dataKey: 'name', sortable: true, filterable: true, render: 'text' },
        { id: 'col-3', name: 'Status', dataKey: 'status', sortable: true, filterable: true, render: 'badge' },
      ],
      pageSize: 10,
      showPagination: true,
      showSearch: true,
      exportable: true,
    };

    onChange({
      ...config,
      elements: [...config.elements, newTable],
    });
  };

  const handleDeleteTable = (tableId: string) => {
    onChange({
      ...config,
      elements: config.elements.filter(e => e.id !== tableId),
    });
  };

  const handleUpdateTable = (tableId: string, updates: Partial<TableElementConfig>) => {
    onChange({
      ...config,
      elements: config.elements.map(e =>
        e.id === tableId ? { ...e, ...updates } : e
      ),
    });
  };

  const handleAddColumn = (tableId: string) => {
    const table = config.elements.find(e => e.id === tableId);
    if (!table) return;

    const newColumn: TableColumnConfig = {
      id: `col-${Date.now()}`,
      name: `Column ${table.columns.length + 1}`,
      dataKey: `field${table.columns.length + 1}`,
      sortable: true,
      filterable: false,
      render: 'text',
    };

    handleUpdateTable(tableId, {
      columns: [...table.columns, newColumn],
    });
  };

  const handleUpdateColumn = (tableId: string, columnId: string, updates: Partial<TableColumnConfig>) => {
    const table = config.elements.find(e => e.id === tableId);
    if (!table) return;

    handleUpdateTable(tableId, {
      columns: table.columns.map(c =>
        c.id === columnId ? { ...c, ...updates } : c
      ),
    });
  };

  const handleDeleteColumn = (tableId: string, columnId: string) => {
    const table = config.elements.find(e => e.id === tableId);
    if (!table) return;

    handleUpdateTable(tableId, {
      columns: table.columns.filter(c => c.id !== columnId),
    });
  };

  // ============================================================================
  // Render Functions
  // ============================================================================

  const renderTableHeader = (table: TableElementConfig) => (
    <>
      <TableOutlined />
      <span style={{ fontWeight: 500 }}>{table.name}</span>
      <Tag color="blue">{table.columns.length} columns</Tag>
    </>
  );

  const renderTableBadges = (table: TableElementConfig) => (
    <>
      {!table.enabled && <Tag color="red">Disabled</Tag>}
      {table.dataBinding && (
        <Tag color="green" icon={<LinkOutlined />}>
          Bound
        </Tag>
      )}
    </>
  );

  const renderTableForm = (table: TableElementConfig) => (
    <Form layout="vertical">
      {/* Basic Settings */}
      <TextField
        label="Table Name"
        value={table.name}
        onChange={(name) => handleUpdateTable(table.id, { name })}
        placeholder="e.g., Device List"
      />

      {/* Data Binding */}
      <DataBindingForm
        value={table.dataBinding}
        onChange={(binding) => handleUpdateTable(table.id, { dataBinding: binding })}
        dataSourceTypes={['static-data', 'alert-stream']}
      />

      {/* Columns Configuration - Keep original table UI for complexity */}
      <div style={{ marginTop: 24 }}>
        <div style={{ marginBottom: 12, fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Columns ({table.columns.length})</span>
          <Button size="small" icon={<PlusOutlined />} onClick={() => handleAddColumn(table.id)}>
            Add Column
          </Button>
        </div>

        <AntTable
          dataSource={table.columns}
          rowKey="id"
          pagination={false}
          size="small"
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              render: (text, record) => (
                <Input
                  value={text}
                  size="small"
                  onChange={(e) =>
                    handleUpdateColumn(table.id, record.id, { name: e.target.value })
                  }
                />
              ),
            },
            {
              title: 'Data Key',
              dataIndex: 'dataKey',
              render: (text, record) => (
                <Input
                  value={text}
                  size="small"
                  onChange={(e) =>
                    handleUpdateColumn(table.id, record.id, { dataKey: e.target.value })
                  }
                />
              ),
            },
            {
              title: 'Render',
              dataIndex: 'render',
              render: (text, record) => (
                <Select
                  value={text}
                  size="small"
                  style={{ width: '100%' }}
                  onChange={(value) =>
                    handleUpdateColumn(table.id, record.id, { render: value })
                  }
                >
                  {RENDER_TYPES.map(type => (
                    <Select.Option key={type.value} value={type.value}>
                      {type.label}
                    </Select.Option>
                  ))}
                </Select>
              ),
            },
            {
              title: 'Sort',
              dataIndex: 'sortable',
              width: 60,
              render: (checked, record) => (
                <Switch
                  size="small"
                  checked={checked}
                  onChange={(value) =>
                    handleUpdateColumn(table.id, record.id, { sortable: value })
                  }
                />
              ),
            },
            {
              title: 'Action',
              width: 60,
              render: (_, record) => (
                <Popconfirm
                  title="Delete column?"
                  onConfirm={() => handleDeleteColumn(table.id, record.id)}
                >
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              ),
            },
          ]}
        />
      </div>

      {/* Table Settings */}
      <div style={{ marginTop: 16 }}>
        <NumberField
          label="Page Size"
          value={table.pageSize}
          onChange={(pageSize) => handleUpdateTable(table.id, { pageSize: pageSize || 10 })}
          min={5}
          max={100}
        />

        <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 16 }}>
          <SwitchField
            label="Show Pagination"
            checked={table.showPagination}
            onChange={(showPagination) => handleUpdateTable(table.id, { showPagination })}
          />

          <SwitchField
            label="Show Search"
            checked={table.showSearch}
            onChange={(showSearch) => handleUpdateTable(table.id, { showSearch })}
          />

          <SwitchField
            label="Exportable"
            checked={table.exportable}
            onChange={(exportable) => handleUpdateTable(table.id, { exportable })}
          />

          <SwitchField
            label="Enabled"
            checked={table.enabled}
            onChange={(enabled) => handleUpdateTable(table.id, { enabled })}
          />
        </Space>
      </div>
    </Form>
  );

  // ============================================================================
  // Main Render
  // ============================================================================

  return (
    <ConfigPanelLayout onCancel={onClose}>
      {/* Global Settings Section */}
      <ConfigSection title="Global Settings" Icon={TableOutlined}>
        <Form layout="vertical">
          <SelectField
            label="Default View"
            value={config.defaultView}
            onChange={(defaultView) => onChange({ ...config, defaultView: defaultView as string })}
            options={config.elements.map(table => ({
              label: table.name,
              value: table.id,
            }))}
            placeholder="Select default table"
            allowClear
          />
        </Form>
      </ConfigSection>

      {/* Tables Section */}
      <ElementListManager
        elements={config.elements}
        onAdd={handleAddTable}
        onDelete={handleDeleteTable}
        renderElement={renderTableForm}
        renderHeader={renderTableHeader}
        renderHeaderBadges={renderTableBadges}
        emptyText="No tables configured"
        addButtonText="Add Table"
        title="Tables"
        titleIcon={<TableOutlined className="config-section-title-icon" />}
        className="config-section"
      />
    </ConfigPanelLayout>
  );
}
