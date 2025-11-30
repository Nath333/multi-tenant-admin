/**
 * Element Header Components - Reusable Components for Config Panel Headers
 *
 * These components provide consistent styling for element headers and badges
 * across all config panels, eliminating ~15-20 lines per panel.
 */

import type { ReactNode } from 'react';
import { Space, Tag } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import type { BaseElementConfig, DataBinding } from '../types/ConfigurableWidget.types';

// ============================================================================
// Element Header
// ============================================================================

interface ElementHeaderProps {
  /** Icon to display before name */
  icon?: ReactNode;
  /** Element name */
  name: string;
  /** Optional tags to display after name */
  tags?: ReactNode;
  /** Additional content after tags */
  children?: ReactNode;
}

/**
 * Standard Element Header
 * Displays: [Icon] [Name] [Tags] [Children]
 */
export function ElementHeader({ icon, name, tags, children }: ElementHeaderProps) {
  return (
    <Space>
      {icon}
      <span style={{ fontWeight: 500 }}>{name}</span>
      {tags}
      {children}
    </Space>
  );
}

// ============================================================================
// Status Badges
// ============================================================================

interface StatusBadgesProps {
  /** Whether element is enabled */
  enabled?: boolean;
  /** Data binding info (shows "Bound" tag if present) */
  dataBinding?: DataBinding;
  /** Additional custom badges */
  children?: ReactNode;
}

/**
 * Standard Status Badges
 * Displays disabled/bound status consistently
 */
export function StatusBadges({ enabled = true, dataBinding, children }: StatusBadgesProps) {
  return (
    <>
      {!enabled && <Tag color="red">Disabled</Tag>}
      {dataBinding && (
        <Tag color="green" icon={<LinkOutlined />}>
          Bound
        </Tag>
      )}
      {children}
    </>
  );
}

// ============================================================================
// Combined Element Header with Badges
// ============================================================================

interface ElementHeaderWithBadgesProps<T extends BaseElementConfig> {
  /** The element to render header for */
  element: T;
  /** Icon component */
  icon: ReactNode;
  /** Optional additional tags after name */
  extraTags?: ReactNode;
  /** Custom name field (defaults to element.name) */
  nameField?: keyof T;
}

/**
 * Complete Element Header with Status Badges
 * Combines ElementHeader + StatusBadges into a single component
 */
export function ElementHeaderWithBadges<T extends BaseElementConfig>({
  element,
  icon,
  extraTags,
  nameField = 'name' as keyof T,
}: ElementHeaderWithBadgesProps<T>) {
  const name = (element[nameField] as unknown as string) || element.name;

  return (
    <Space>
      {icon}
      <span style={{ fontWeight: 500 }}>{name}</span>
      {extraTags}
      <StatusBadges enabled={element.enabled} dataBinding={element.dataBinding} />
    </Space>
  );
}

// ============================================================================
// Info Tags
// ============================================================================

interface InfoTagProps {
  /** Tag color */
  color?: string;
  /** Tag content */
  children: ReactNode;
}

/**
 * Info Tag - for displaying counts, types, etc.
 */
export function InfoTag({ color = 'blue', children }: InfoTagProps) {
  return <Tag color={color}>{children}</Tag>;
}

/**
 * Count Tag - specifically for element counts
 */
export function CountTag({ count, label }: { count: number; label: string }) {
  return <Tag color="blue">{count} {label}</Tag>;
}

/**
 * Type Tag - for displaying element types
 */
export function TypeTag({ type }: { type: string }) {
  return <Tag color="purple">{type}</Tag>;
}

export default ElementHeader;
