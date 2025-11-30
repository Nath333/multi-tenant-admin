/**
 * Generic CRUD Store Factory
 *
 * Creates a Zustand store with common CRUD operations.
 * Reduces code duplication across entity stores (users, tenants, etc.)
 *
 * Usage:
 * ```typescript
 * const useExampleStore = createCrudStore<Example>({
 *   name: 'example-storage',
 *   initialData: [],
 *   idGenerator: () => `example-${Date.now()}`,
 *   defaultValues: { createdAt: new Date().toISOString() },
 * });
 * ```
 */

import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersistOptions } from 'zustand/middleware';

// Base entity interface - all entities must have an id
export interface BaseEntity {
  id: string;
}

// Configuration for the store factory
export interface CrudStoreConfig<T extends BaseEntity> {
  /** Storage name for persistence */
  name: string;
  /** Initial data for the store */
  initialData: T[];
  /** Function to generate unique IDs */
  idGenerator?: () => string;
  /** Default values to apply when creating new items */
  defaultValues?: Partial<T>;
  /** Optional status field name for toggle functionality */
  statusField?: keyof T;
  /** Optional tenant field name for filtering */
  tenantField?: keyof T;
}

// Base CRUD state interface
export interface CrudState<T extends BaseEntity> {
  items: T[];
  add: (item: Omit<T, 'id'>) => void;
  update: (id: string, item: Partial<T>) => void;
  delete: (id: string) => void;
  getById: (id: string) => T | undefined;
  getAll: () => T[];
}

// Extended state with optional operations
export interface ExtendedCrudState<T extends BaseEntity> extends CrudState<T> {
  toggleStatus?: (id: string) => void;
  getByTenant?: (tenantId: string) => T[];
}

/**
 * Default ID generator
 */
const defaultIdGenerator = (): string =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Creates a CRUD store with persistence
 */
export function createCrudStore<T extends BaseEntity>(
  config: CrudStoreConfig<T>
) {
  const {
    name,
    initialData,
    idGenerator = defaultIdGenerator,
    defaultValues = {},
    statusField,
    tenantField,
  } = config;

  type StoreState = ExtendedCrudState<T>;

  const storeCreator: StateCreator<
    StoreState,
    [],
    [['zustand/persist', unknown]]
  > = (set, get) => {
    const baseState: CrudState<T> = {
      items: initialData,

      add: (itemData) => {
        const newItem = {
          ...defaultValues,
          ...itemData,
          id: idGenerator(),
        } as T;

        set((state) => ({
          items: [...state.items, newItem],
        }));
      },

      update: (id, itemData) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...itemData } : item
          ),
        }));
      },

      delete: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      getById: (id) => {
        return get().items.find((item) => item.id === id);
      },

      getAll: () => {
        return get().items;
      },
    };

    // Add optional operations based on config
    const extendedState: Partial<ExtendedCrudState<T>> = {};

    if (statusField) {
      extendedState.toggleStatus = (id: string) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const currentStatus = item[statusField];
              const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
              return { ...item, [statusField]: newStatus };
            }
            return item;
          }),
        }));
      };
    }

    if (tenantField) {
      extendedState.getByTenant = (tenantId: string) => {
        return get().items.filter((item) => item[tenantField] === tenantId);
      };
    }

    return {
      ...baseState,
      ...extendedState,
    } as StoreState;
  };

  const persistOptions: PersistOptions<StoreState> = {
    name,
  };

  return create<StoreState>()(persist(storeCreator, persistOptions));
}

/**
 * Helper type to extract the store type from createCrudStore
 */
export type CrudStore<T extends BaseEntity> = ReturnType<typeof createCrudStore<T>>;
