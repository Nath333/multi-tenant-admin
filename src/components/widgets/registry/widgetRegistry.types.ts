import type { ComponentType } from 'react';
import type { BaseWidgetProps } from '../types/widget.types';

/**
 * Widget category for organization
 */
export type WidgetCategory =
  | 'analytics'
  | 'monitoring'
  | 'iot'
  | 'charts'
  | 'tables'
  | 'maps'
  | 'controls'
  | 'alerts'
  | 'bms'
  | 'custom';

/**
 * Widget size presets for grid layout
 */
export interface WidgetSize {
  minW: number; // minimum width in grid units
  minH: number; // minimum height in grid units
  defaultW: number; // default width in grid units
  defaultH: number; // default height in grid units
  maxW?: number; // optional maximum width
  maxH?: number; // optional maximum height
}

/**
 * Widget metadata for registry
 */
export interface WidgetMetadata {
  id: string;
  name: string;
  description: string;
  category: WidgetCategory;
  icon: string; // Ant Design icon name
  tags?: string[];
  version?: string;
  author?: string;
  size: WidgetSize;
  preview?: string; // preview image URL
}

/**
 * Widget configuration field for dynamic forms
 */
export interface ConfigField {
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'color' | 'slider' | 'range' | 'time' | 'date' | 'textarea' | 'json';
  label: string;
  description?: string;
  defaultValue?: unknown;
  options?: Array<{ label: string; value: unknown }>;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  multiple?: boolean;
  marks?: Record<number, string>;
  format?: string;
  rows?: number;
  validation?: (value: unknown) => string | undefined;
}

/**
 * Widget configuration schema (collection of fields)
 */
export type ConfigSchema = Record<string, ConfigField>;

/**
 * Widget configuration schema for dynamic forms (legacy)
 */
export interface WidgetConfigSchema {
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'color' | 'range';
  label: string;
  description?: string;
  defaultValue?: unknown;
  options?: Array<{ label: string; value: unknown }>;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  validation?: (value: unknown) => string | undefined;
}

/**
 * Complete widget registration
 */
export interface WidgetRegistration<P extends BaseWidgetProps = BaseWidgetProps> {
  metadata: WidgetMetadata;
  component: ComponentType<P>;
  configSchema?: ConfigSchema;
  defaultConfig?: Partial<P['config']>;
  dependencies?: string[]; // other widgets or modules this depends on
  permissions?: string[]; // required permissions to use this widget
}

/**
 * Widget instance in a dashboard
 */
export interface WidgetInstance {
  id: string; // unique instance ID
  widgetId: string; // reference to widget registry
  title: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  config?: Record<string, unknown>;
  visible?: boolean;
  locked?: boolean;
  disabled?: boolean; // whether widget is disabled (visible but non-interactive)
}

/**
 * Widget registry map
 */
export type WidgetRegistryMap = Map<string, WidgetRegistration>;

/**
 * Widget filter options
 */
export interface WidgetFilter {
  category?: WidgetCategory;
  tags?: string[];
  search?: string;
}
