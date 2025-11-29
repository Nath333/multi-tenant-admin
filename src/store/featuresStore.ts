import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FeatureModule {
  id: string;
  name: string;
  icon: string;
  path: string;
  enabled: boolean;
  description: string;
  order?: number;
}

interface FeaturesState {
  enabledModules: Set<string>;
  toggleFeature: (id: string) => void;
  getEnabledFeatures: () => FeatureModule[];
  isFeatureEnabled: (id: string) => boolean;
}

interface PersistedFeaturesState {
  enabledModules: string[];
}

// No modules by default (dynamic pages are managed by pagesStore)
const defaultEnabledModules = new Set<string>();

export const useFeaturesStore = create<FeaturesState>()(
  persist(
    (set, get) => ({
      enabledModules: defaultEnabledModules,

      toggleFeature: (id: string) => {
        set((state) => {
          const newEnabled = new Set(state.enabledModules);
          if (newEnabled.has(id)) {
            newEnabled.delete(id);
          } else {
            newEnabled.add(id);
          }
          return { enabledModules: newEnabled };
        });
      },

      getEnabledFeatures: () => {
        // Return empty array - features are now managed through pagesStore
        return [];
      },

      isFeatureEnabled: (id: string) => {
        return get().enabledModules.has(id);
      },
    }),
    {
      name: 'features-storage',
      partialize: (state): PersistedFeaturesState => ({
        enabledModules: Array.from(state.enabledModules)
      }),
      merge: (persisted: unknown, current: FeaturesState): FeaturesState => {
        const persistedState = persisted as PersistedFeaturesState | null;
        return {
          ...current,
          enabledModules: new Set(persistedState?.enabledModules ?? []),
        };
      },
    }
  )
);
