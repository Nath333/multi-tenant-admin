/**
 * Element List Manager - Reusable Component
 * Manages add/delete/update for any list of configurable elements
 *
 * This component eliminates ~120 lines of duplicate code per config panel
 * Used by all widget configuration panels to manage their elements
 */

import { useState, type ReactNode } from 'react';
import { Collapse, Button, Popconfirm, Space, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import EmptyStateWithAdd from './EmptyStateWithAdd';
import type { BaseElementConfig } from '../types/ConfigurableWidget.types';

const { Panel } = Collapse;

interface ElementListManagerProps<T extends BaseElementConfig> {
  /** List of elements to manage */
  elements: T[];
  /** Called when add button is clicked */
  onAdd: () => void;
  /** Called when delete button is clicked */
  onDelete: (elementId: string) => void;
  /** Render function for each element's content */
  renderElement: (element: T, index: number) => ReactNode;
  /** Render function for panel header (optional, defaults to element name) */
  renderHeader?: (element: T, index: number) => ReactNode;
  /** Render function for header badges/tags (optional) */
  renderHeaderBadges?: (element: T) => ReactNode;
  /** Empty state description */
  emptyText: string;
  /** Add button text */
  addButtonText: string;
  /** Add button icon (optional, defaults to PlusOutlined) */
  addButtonIcon?: ReactNode;
  /** Section title icon (optional) */
  titleIcon?: ReactNode;
  /** Section title text (optional) */
  title?: string;
  /** CSS class name */
  className?: string;
}

/**
 * Generic Element List Manager
 * Handles the common pattern of:
 * - Empty state when no elements
 * - Collapsible panels for each element
 * - Add/delete actions
 * - Active key state management
 */
export default function ElementListManager<T extends BaseElementConfig>({
  elements,
  onAdd,
  onDelete,
  renderElement,
  renderHeader,
  renderHeaderBadges,
  emptyText,
  addButtonText,
  addButtonIcon = <PlusOutlined />,
  titleIcon,
  title,
  className = '',
}: ElementListManagerProps<T>) {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  // Handle panel expand/collapse
  const handlePanelChange = (keys: string | string[]) => {
    setActiveKeys(Array.isArray(keys) ? keys : [keys]);
  };

  // Default header renderer
  const defaultHeaderRenderer = (element: T, index: number) => (
    <Space>
      <span style={{ fontWeight: 500 }}>{element.name || `Element ${index + 1}`}</span>
      {!element.enabled && <Tag color="red">Disabled</Tag>}
    </Space>
  );

  // If no elements, show empty state
  if (elements.length === 0) {
    return (
      <div className={className}>
        {title && (
          <div className="config-section-title">
            {titleIcon}
            {title} (0)
          </div>
        )}
        <EmptyStateWithAdd
          description={emptyText}
          buttonText={addButtonText}
          onAdd={onAdd}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <div className="config-section-title">
          {titleIcon}
          {title} ({elements.length})
        </div>
      )}

      <Collapse
        activeKey={activeKeys}
        onChange={handlePanelChange}
        style={{ marginBottom: 16 }}
      >
        {elements.map((element, index) => (
          <Panel
            key={element.id}
            header={
              <Space>
                {renderHeader ? renderHeader(element, index) : defaultHeaderRenderer(element, index)}
                {renderHeaderBadges && renderHeaderBadges(element)}
              </Space>
            }
            extra={
              <Popconfirm
                title={`Delete ${element.name || 'this element'}?`}
                onConfirm={(e) => {
                  e?.stopPropagation();
                  onDelete(element.id);
                }}
                onCancel={(e) => e?.stopPropagation()}
              >
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => e.stopPropagation()}
                />
              </Popconfirm>
            }
          >
            {renderElement(element, index)}
          </Panel>
        ))}
      </Collapse>

      <div className="add-element-button" onClick={onAdd}>
        {addButtonIcon}
        {addButtonText}
      </div>
    </div>
  );
}
