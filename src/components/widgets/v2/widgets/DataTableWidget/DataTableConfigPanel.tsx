/**
 * Data Table Widget Configuration Panel - ULTRA-REFACTORED VERSION
 * Uses reusable hooks and components including NestedTableEditor for columns.
 */

import { Form, Space } from 'antd';
import { TableOutlined } from '@ant-design/icons';
import type { DataTableWidgetConfig, TableElementConfig, TableColumnConfig } from '../../types/ConfigurableWidget.types';

// Import reusable components
import {
  ConfigPanelLayout,
  ConfigSection,
  ElementListManager,
  ElementHeaderWithBadges,
  CountTag,
  TextField,
  NumberField,
  SwitchField,
  SelectField,
  DataBindingForm,
  NestedTableEditor,
  textColumn,
  switchColumn,
  selectColumn,
  type ColumnDefinition,
} from '../../base';

// Import reusable hooks
import { useElementManager, useNestedElementManager } from '../../hooks';

interface DataTableConfigPanelProps {
  config: DataTableWidgetConfig;
  onChange: (newConfig: DataTableWidgetConfig) => void;
  onClose: () => void;
}

const RENDER_TYPE_OPTIONS = [
  { label: 'Text', value: 'text' },
  { label: 'Badge', value: 'badge' },
  { label: 'Progress', value: 'progress' },
  { label: 'Date', value: 'date' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
];

// Column definitions for the nested table editor
const COLUMN_DEFINITIONS: ColumnDefinition<TableColumnConfig>[] = [
  textColumn('name', 'Name'),
  textColumn('dataKey', 'Data Key'),
  selectColumn('render', 'Render', RENDER_TYPE_OPTIONS),
  switchColumn('sortable', 'Sort'),
];

export default function DataTableConfigPanel({ config, onChange, onClose }: DataTableConfigPanelProps) {
  // Use element manager hook for table CRUD operations
  const { safeConfig, handleAdd, handleDelete, handleUpdate, handleUpdateGlobal } = useElementManager<
    DataTableWidgetConfig,
    TableElementConfig
  >({
    config,
    onChange,
    defaults: {},
    createNewElement: (elements) => ({
      id: `table-${Date.now()}`,
      name: `Table ${elements.length + 1}`,
      enabled: true,
      displayOrder: elements.length,
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
    }),
  });

  // Use nested element manager for column operations
  const { handleAddNested, handleDeleteNested, handleUpdateNested } = useNestedElementManager<
    DataTableWidgetConfig,
    TableElementConfig,
    TableColumnConfig
  >({
    config: safeConfig,
    onChange,
    nestedKey: 'columns',
    createNewNestedElement: (table) => ({
      id: `col-${Date.now()}`,
      name: `Column ${table.columns.length + 1}`,
      dataKey: `field${table.columns.length + 1}`,
      sortable: true,
      filterable: false,
      render: 'text',
    }),
  });

  // Render header with icon and column count
  const renderTableHeader = (table: TableElementConfig) => (
    <ElementHeaderWithBadges
      element={table}
      icon={<TableOutlined />}
      extraTags={<CountTag count={table.columns.length} label="columns" />}
    />
  );

  // Render form for each table element
  const renderTableForm = (table: TableElementConfig) => (
    <Form layout="vertical">
      <TextField
        label="Table Name"
        value={table.name}
        onChange={(name) => handleUpdate(table.id, { name })}
        placeholder="e.g., Device List"
      />

      <DataBindingForm
        value={table.dataBinding}
        onChange={(binding) => handleUpdate(table.id, { dataBinding: binding })}
        dataSourceTypes={['static-data', 'alert-stream']}
      />

      {/* Columns Configuration using NestedTableEditor */}
      <NestedTableEditor<TableColumnConfig>
        title="Columns"
        items={table.columns}
        columns={COLUMN_DEFINITIONS}
        onAdd={() => handleAddNested(table.id)}
        onUpdate={(columnId, updates) => handleUpdateNested(table.id, columnId, updates)}
        onDelete={(columnId) => handleDeleteNested(table.id, columnId)}
        addButtonText="Add Column"
        deleteConfirmText="Delete column?"
      />

      {/* Table Settings */}
      <div style={{ marginTop: 16 }}>
        <NumberField
          label="Page Size"
          value={table.pageSize}
          onChange={(pageSize) => handleUpdate(table.id, { pageSize: pageSize || 10 })}
          min={5}
          max={100}
        />

        <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 16 }}>
          <SwitchField
            label="Show Pagination"
            checked={table.showPagination}
            onChange={(showPagination) => handleUpdate(table.id, { showPagination })}
          />
          <SwitchField
            label="Show Search"
            checked={table.showSearch}
            onChange={(showSearch) => handleUpdate(table.id, { showSearch })}
          />
          <SwitchField
            label="Exportable"
            checked={table.exportable}
            onChange={(exportable) => handleUpdate(table.id, { exportable })}
          />
          <SwitchField
            label="Enabled"
            checked={table.enabled}
            onChange={(enabled) => handleUpdate(table.id, { enabled })}
          />
        </Space>
      </div>
    </Form>
  );

  return (
    <ConfigPanelLayout onCancel={onClose}>
      <ConfigSection title="Global Settings" Icon={TableOutlined}>
        <Form layout="vertical">
          <SelectField
            label="Default View"
            value={safeConfig.defaultView}
            onChange={(defaultView) => handleUpdateGlobal({ defaultView: defaultView as string })}
            options={safeConfig.elements.map(table => ({
              label: table.name,
              value: table.id,
            }))}
            placeholder="Select default table"
            allowClear
          />
        </Form>
      </ConfigSection>

      <ElementListManager
        elements={safeConfig.elements}
        onAdd={handleAdd}
        onDelete={handleDelete}
        renderElement={renderTableForm}
        renderHeader={renderTableHeader}
        emptyText="No tables configured"
        addButtonText="Add Table"
        title="Tables"
        titleIcon={<TableOutlined className="config-section-title-icon" />}
        className="config-section"
      />
    </ConfigPanelLayout>
  );
}
