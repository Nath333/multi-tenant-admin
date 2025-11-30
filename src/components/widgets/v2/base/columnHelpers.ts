/**
 * Column Definition Helpers
 * Helper functions to create column definitions for NestedTableEditor
 */

import type { ColumnDefinition, NestedItem } from './NestedTableEditor';

/**
 * Standard text column definition
 */
export function textColumn<T extends NestedItem>(
  dataKey: keyof T,
  title: string,
  options?: { width?: number; placeholder?: string }
): ColumnDefinition<T> {
  return {
    dataKey,
    title,
    type: 'text',
    ...options,
  };
}

/**
 * Standard number column definition
 */
export function numberColumn<T extends NestedItem>(
  dataKey: keyof T,
  title: string,
  options?: { width?: number; min?: number; max?: number }
): ColumnDefinition<T> {
  return {
    dataKey,
    title,
    type: 'number',
    ...options,
  };
}

/**
 * Standard switch column definition
 */
export function switchColumn<T extends NestedItem>(
  dataKey: keyof T,
  title: string,
  options?: { width?: number }
): ColumnDefinition<T> {
  return {
    dataKey,
    title,
    type: 'switch',
    width: options?.width || 60,
  };
}

/**
 * Standard select column definition
 */
export function selectColumn<T extends NestedItem>(
  dataKey: keyof T,
  title: string,
  selectOptions: { label: string; value: string | number }[],
  options?: { width?: number }
): ColumnDefinition<T> {
  return {
    dataKey,
    title,
    type: 'select',
    options: selectOptions,
    ...options,
  };
}
