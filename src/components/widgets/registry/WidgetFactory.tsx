import { createElement, memo } from 'react';
import type { ComponentType } from 'react';
import { widgetRegistry } from './WidgetRegistry';
import type { BaseWidgetProps } from '../types/widget.types';
import type { WidgetInstance } from './widgetRegistry.types';

/**
 * WidgetFactory - Factory for creating widget instances
 * Handles dynamic widget creation and configuration merging
 */

interface WidgetFactoryProps {
  instance: WidgetInstance;
  onRemove?: (id: string) => void;
  onEdit?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<WidgetInstance>) => void;
}

/**
 * Create a widget component from a widget instance
 */
export const WidgetFactory = memo<WidgetFactoryProps>(
  ({ instance, onRemove, onEdit }) => {
    // Get widget registration from registry
    const registration = widgetRegistry.get(instance.widgetId);

    if (!registration) {
      return (
        <div
          style={{
            padding: 24,
            border: '2px dashed #ff4d4f',
            borderRadius: 8,
            textAlign: 'center',
            color: '#ff4d4f',
          }}
        >
          <h3>Widget Not Found</h3>
          <p>Widget type "{instance.widgetId}" is not registered.</p>
        </div>
      );
    }

    const { component: Component, defaultConfig } = registration;

    // Merge default config with instance config
    const mergedConfig = {
      ...defaultConfig,
      ...instance.config,
    };

    // Create widget props
    const widgetProps: BaseWidgetProps = {
      title: instance.title,
      config: mergedConfig,
      onRemove: onRemove ? () => onRemove(instance.id) : undefined,
      onEdit: onEdit ? () => onEdit(instance.id) : undefined,
      disabled: instance.disabled || false,
    };

    // Create and return the widget component
    return createElement(Component as ComponentType<BaseWidgetProps>, widgetProps);
  }
);

WidgetFactory.displayName = 'WidgetFactory';

/**
 * Create a new widget instance with defaults
 */
// eslint-disable-next-line react-refresh/only-export-components
export function createWidgetInstance(
  widgetId: string,
  overrides?: Partial<WidgetInstance>
): WidgetInstance | null {
  const registration = widgetRegistry.get(widgetId);

  if (!registration) {
    console.error(`Cannot create instance: widget "${widgetId}" not found in registry`);
    return null;
  }

  const { metadata, defaultConfig } = registration;

  return {
    id: overrides?.id || `${widgetId}-${Date.now()}`,
    widgetId,
    title: overrides?.title || metadata.name,
    position: overrides?.position || {
      x: 0,
      y: 0,
      w: metadata.size.defaultW,
      h: metadata.size.defaultH,
    },
    config: {
      ...defaultConfig,
      ...overrides?.config,
    },
    visible: overrides?.visible !== undefined ? overrides.visible : true,
    locked: overrides?.locked || false,
    disabled: overrides?.disabled || false,
  };
}

/**
 * Validate widget instance
 */
// eslint-disable-next-line react-refresh/only-export-components
export function validateWidgetInstance(instance: WidgetInstance): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!instance.id) {
    errors.push('Instance ID is required');
  }

  if (!instance.widgetId) {
    errors.push('Widget ID is required');
  }

  if (!widgetRegistry.has(instance.widgetId)) {
    errors.push(`Widget type "${instance.widgetId}" is not registered`);
  }

  if (!instance.title || instance.title.trim() === '') {
    errors.push('Widget title is required');
  }

  if (!instance.position) {
    errors.push('Widget position is required');
  } else {
    if (instance.position.w < 1) {
      errors.push('Widget width must be at least 1');
    }
    if (instance.position.h < 1) {
      errors.push('Widget height must be at least 1');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Clone a widget instance
 */
// eslint-disable-next-line react-refresh/only-export-components
export function cloneWidgetInstance(instance: WidgetInstance): WidgetInstance {
  return {
    ...instance,
    id: `${instance.widgetId}-${Date.now()}`,
    title: `${instance.title} (Copy)`,
    position: {
      ...instance.position,
      x: instance.position.x + 1,
      y: instance.position.y + 1,
    },
  };
}

/**
 * Batch create widget instances
 */
// eslint-disable-next-line react-refresh/only-export-components
export function createWidgetInstances(
  configs: Array<{ widgetId: string; overrides?: Partial<WidgetInstance> }>
): WidgetInstance[] {
  return configs
    .map(({ widgetId, overrides }) => createWidgetInstance(widgetId, overrides))
    .filter((instance): instance is WidgetInstance => instance !== null);
}
