/**
 * useElementManager - Reusable Hook for Element CRUD Operations
 *
 * This hook eliminates ~30-40 lines of duplicate handler code per config panel.
 * Provides standardized add, delete, update, and global settings operations.
 *
 * Usage:
 *   const { handleAdd, handleDelete, handleUpdate, handleUpdateGlobal } = useElementManager({
 *     config,
 *     onChange,
 *     createNewElement: () => ({ id: `item-${Date.now()}`, name: 'New Item', ... }),
 *   });
 */

import { useCallback, useMemo } from 'react';
import type { BaseElementConfig } from '../types/ConfigurableWidget.types';

interface BaseConfig<T extends BaseElementConfig> {
  elements: T[];
  [key: string]: unknown;
}

interface UseElementManagerOptions<TConfig extends BaseConfig<TElement>, TElement extends BaseElementConfig> {
  /** Current configuration object */
  config: TConfig;
  /** Callback when configuration changes */
  onChange: (newConfig: TConfig) => void;
  /** Factory function to create a new element with defaults */
  createNewElement: (currentElements: TElement[]) => TElement;
  /** Default values for the config (used to ensure safe defaults) */
  defaults?: Partial<TConfig>;
}

interface UseElementManagerReturn<TConfig extends BaseConfig<TElement>, TElement extends BaseElementConfig> {
  /** Safe config with defaults applied */
  safeConfig: TConfig;
  /** Add a new element */
  handleAdd: () => void;
  /** Delete an element by ID */
  handleDelete: (elementId: string) => void;
  /** Update an element by ID with partial updates */
  handleUpdate: (elementId: string, updates: Partial<TElement>) => void;
  /** Update global settings (non-elements config) */
  handleUpdateGlobal: (updates: Partial<TConfig>) => void;
  /** Get an element by ID */
  getElement: (elementId: string) => TElement | undefined;
}

/**
 * Generic Element Manager Hook
 * Handles all CRUD operations for config panel elements
 */
export function useElementManager<
  TConfig extends BaseConfig<TElement>,
  TElement extends BaseElementConfig
>({
  config,
  onChange,
  createNewElement,
  defaults = {} as Partial<TConfig>,
}: UseElementManagerOptions<TConfig, TElement>): UseElementManagerReturn<TConfig, TElement> {

  // Create safe config with defaults
  const safeConfig = useMemo(() => ({
    ...defaults,
    ...config,
    elements: config?.elements || [],
  } as TConfig), [config, defaults]);

  // Add new element
  const handleAdd = useCallback(() => {
    const newElement = createNewElement(safeConfig.elements);
    onChange({
      ...safeConfig,
      elements: [...safeConfig.elements, newElement],
    });
  }, [safeConfig, onChange, createNewElement]);

  // Delete element by ID
  const handleDelete = useCallback((elementId: string) => {
    onChange({
      ...safeConfig,
      elements: safeConfig.elements.filter(e => e.id !== elementId),
    });
  }, [safeConfig, onChange]);

  // Update element by ID
  const handleUpdate = useCallback((elementId: string, updates: Partial<TElement>) => {
    onChange({
      ...safeConfig,
      elements: safeConfig.elements.map(e =>
        e.id === elementId ? { ...e, ...updates } : e
      ),
    });
  }, [safeConfig, onChange]);

  // Update global settings
  const handleUpdateGlobal = useCallback((updates: Partial<TConfig>) => {
    onChange({ ...safeConfig, ...updates });
  }, [safeConfig, onChange]);

  // Get element by ID
  const getElement = useCallback((elementId: string) => {
    return safeConfig.elements.find(e => e.id === elementId);
  }, [safeConfig]);

  return {
    safeConfig,
    handleAdd,
    handleDelete,
    handleUpdate,
    handleUpdateGlobal,
    getElement,
  };
}

/**
 * Helper for nested element management (e.g., columns in tables, circuits in panels)
 */
interface UseNestedElementManagerOptions<
  TConfig extends BaseConfig<TElement>,
  TElement extends BaseElementConfig,
  TNestedElement extends { id: string }
> {
  config: TConfig;
  onChange: (newConfig: TConfig) => void;
  /** Key in parent element that contains nested elements */
  nestedKey: keyof TElement;
  /** Factory function to create a new nested element */
  createNewNestedElement: (parentElement: TElement) => TNestedElement;
}

interface UseNestedElementManagerReturn<TNestedElement extends { id: string }> {
  /** Add a nested element to a parent */
  handleAddNested: (parentId: string) => void;
  /** Delete a nested element from a parent */
  handleDeleteNested: (parentId: string, nestedId: string) => void;
  /** Update a nested element in a parent */
  handleUpdateNested: (parentId: string, nestedId: string, updates: Partial<TNestedElement>) => void;
}

/**
 * Hook for managing nested elements (e.g., table columns, circuit configs)
 */
export function useNestedElementManager<
  TConfig extends BaseConfig<TElement>,
  TElement extends BaseElementConfig,
  TNestedElement extends { id: string }
>({
  config,
  onChange,
  nestedKey,
  createNewNestedElement,
}: UseNestedElementManagerOptions<TConfig, TElement, TNestedElement>): UseNestedElementManagerReturn<TNestedElement> {

  const handleAddNested = useCallback((parentId: string) => {
    const parent = config.elements.find(e => e.id === parentId);
    if (!parent) return;

    const nestedArray = (parent[nestedKey] as unknown as TNestedElement[]) || [];
    const newNested = createNewNestedElement(parent);

    onChange({
      ...config,
      elements: config.elements.map(e =>
        e.id === parentId
          ? { ...e, [nestedKey]: [...nestedArray, newNested] }
          : e
      ),
    });
  }, [config, onChange, nestedKey, createNewNestedElement]);

  const handleDeleteNested = useCallback((parentId: string, nestedId: string) => {
    const parent = config.elements.find(e => e.id === parentId);
    if (!parent) return;

    const nestedArray = (parent[nestedKey] as unknown as TNestedElement[]) || [];

    onChange({
      ...config,
      elements: config.elements.map(e =>
        e.id === parentId
          ? { ...e, [nestedKey]: nestedArray.filter(n => n.id !== nestedId) }
          : e
      ),
    });
  }, [config, onChange, nestedKey]);

  const handleUpdateNested = useCallback((parentId: string, nestedId: string, updates: Partial<TNestedElement>) => {
    const parent = config.elements.find(e => e.id === parentId);
    if (!parent) return;

    const nestedArray = (parent[nestedKey] as unknown as TNestedElement[]) || [];

    onChange({
      ...config,
      elements: config.elements.map(e =>
        e.id === parentId
          ? {
              ...e,
              [nestedKey]: nestedArray.map(n =>
                n.id === nestedId ? { ...n, ...updates } : n
              ),
            }
          : e
      ),
    });
  }, [config, onChange, nestedKey]);

  return {
    handleAddNested,
    handleDeleteNested,
    handleUpdateNested,
  };
}

export default useElementManager;
