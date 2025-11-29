/**
 * Nested Table Editor - Reusable Component for Managing Nested Items
 *
 * Used for editing columns in DataTable and circuits in ElectricalPanel widgets.
 * Eliminates ~80-100 lines of duplicate table code per config panel.
 */

import type { ReactNode } from 'react';
import { Table, Button, Popconfirm, Input, Switch, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

// ============================================================================
// Types
// ============================================================================

export interface NestedItem {
  id: string;
  [key: string]: unknown;
}

export interface ColumnDefinition<T extends NestedItem> {
  /** Column title */
  title: string;
  /** Data key to access */
  dataKey: keyof T;
  /** Column width */
  width?: number | string;
  /** Render type */
  type: 'text' | 'number' | 'switch' | 'select';
  /** Options for select type */
  options?: { label: string; value: string | number }[];
  /** Placeholder for inputs */
  placeholder?: string;
  /** Min value for number type */
  min?: number;
  /** Max value for number type */
  max?: number;
}

interface NestedTableEditorProps<T extends NestedItem> {
  /** Title displayed above table */
  title: string;
  /** Items to display */
  items: T[];
  /** Column definitions */
  columns: ColumnDefinition<T>[];
  /** Called when an item is added */
  onAdd: () => void;
  /** Called when an item is updated */
  onUpdate: (itemId: string, updates: Partial<T>) => void;
  /** Called when an item is deleted */
  onDelete: (itemId: string) => void;
  /** Add button text */
  addButtonText?: string;
  /** Delete confirmation message */
  deleteConfirmText?: string;
  /** Show row numbers */
  showRowNumbers?: boolean;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Generic Nested Table Editor
 * Provides inline editing for nested items like table columns or circuits
 */
export default function NestedTableEditor<T extends NestedItem>({
  title,
  items,
  columns,
  onAdd,
  onUpdate,
  onDelete,
  addButtonText = 'Add Item',
  deleteConfirmText = 'Delete this item?',
  showRowNumbers = false,
}: NestedTableEditorProps<T>) {

  // Build table columns from definitions
  const tableColumns: ColumnsType<T> = [
    // Optional row number column
    ...(showRowNumbers ? [{
      title: '#',
      width: 40,
      render: (_: unknown, __: T, index: number) => index + 1,
    }] : []),

    // Configured columns
    ...columns.map(col => ({
      title: col.title,
      dataIndex: col.dataKey as string,
      width: col.width,
      render: (value: unknown, record: T) => {
        switch (col.type) {
          case 'text':
            return (
              <Input
                value={value as string}
                size="small"
                placeholder={col.placeholder}
                onChange={(e) => onUpdate(record.id, { [col.dataKey]: e.target.value } as Partial<T>)}
              />
            );

          case 'number':
            return (
              <Input
                type="number"
                value={value as number}
                size="small"
                min={col.min}
                max={col.max}
                onChange={(e) => onUpdate(record.id, { [col.dataKey]: Number(e.target.value) } as Partial<T>)}
              />
            );

          case 'switch':
            return (
              <Switch
                size="small"
                checked={value as boolean}
                onChange={(checked) => onUpdate(record.id, { [col.dataKey]: checked } as Partial<T>)}
              />
            );

          case 'select':
            return (
              <Select
                value={value as string}
                size="small"
                style={{ width: '100%' }}
                onChange={(selected) => onUpdate(record.id, { [col.dataKey]: selected } as Partial<T>)}
              >
                {col.options?.map(opt => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            );

          default:
            return value as ReactNode;
        }
      },
    })),

    // Delete action column
    {
      title: 'Action',
      width: 60,
      render: (_: unknown, record: T) => (
        <Popconfirm
          title={deleteConfirmText}
          onConfirm={() => onDelete(record.id)}
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
  ];

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{
        marginBottom: 12,
        fontWeight: 600,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>{title} ({items.length})</span>
        <Button size="small" icon={<PlusOutlined />} onClick={onAdd}>
          {addButtonText}
        </Button>
      </div>

      <Table
        dataSource={items}
        rowKey="id"
        columns={tableColumns}
        pagination={false}
        size="small"
      />
    </div>
  );
}

