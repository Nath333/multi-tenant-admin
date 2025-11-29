import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getDashboardStats } from '../services/mockData';
import type { WidgetConfig } from '../types';
import { WIDGET_CONFIG } from '../constants';

export interface Widget {
  id: string;
  type: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  config?: WidgetConfig;
  pageId?: string;
  disabled?: boolean;
}

interface PageWidgets {
  [pageId: string]: Widget[];
}

interface WidgetState {
  widgets: Widget[];
  pageWidgets: PageWidgets;
  addWidget: (widget: Omit<Widget, 'id'>, pageId?: string) => void;
  removeWidget: (id: string, pageId?: string) => void;
  updateWidget: (id: string, updates: Partial<Widget>, pageId?: string) => void;
  updateLayout: (widgets: Widget[], pageId?: string) => void;
  resetToDefault: (pageId?: string) => void;
  refreshWidgetData: (tenantId?: string) => void;
  getPageWidgets: (pageId: string) => Widget[];
}

let widgetIdCounter = 0;

const generateWidgetId = (): string => `widget-${Date.now()}-${widgetIdCounter++}`;

const STATS_TITLE_MAP: Record<string, keyof ReturnType<typeof getDashboardStats>> = {
  'Total Devices': 'totalDevices',
  'Active Users': 'activeUsers',
  'Alerts': 'alerts',
  'Revenue': 'revenue',
};

const refreshStatsWidget = (
  widget: Widget,
  stats: ReturnType<typeof getDashboardStats>
): Widget => {
  if (widget.type !== 'stats') {
    return widget;
  }

  const statsKey = STATS_TITLE_MAP[widget.title];
  if (!statsKey) {
    return widget;
  }

  return {
    ...widget,
    config: { ...widget.config, ...stats[statsKey] },
  };
};

export const useWidgetStore = create<WidgetState>()(
  persist(
    (set, get) => ({
      widgets: [],
      pageWidgets: {},

      addWidget: (widget, pageId) => {
        const newWidget: Widget = {
          ...widget,
          id: generateWidgetId(),
          pageId,
        };

        if (pageId) {
          set((state) => ({
            pageWidgets: {
              ...state.pageWidgets,
              [pageId]: [...(state.pageWidgets[pageId] || []), newWidget],
            },
          }));
        } else {
          set((state) => ({
            widgets: [...state.widgets, newWidget],
          }));
        }
      },

      removeWidget: (id, pageId) => {
        if (pageId) {
          set((state) => ({
            pageWidgets: {
              ...state.pageWidgets,
              [pageId]: (state.pageWidgets[pageId] || []).filter((w) => w.id !== id),
            },
          }));
        } else {
          set((state) => ({
            widgets: state.widgets.filter((w) => w.id !== id),
          }));
        }
      },

      updateWidget: (id, updates, pageId) => {
        if (pageId) {
          set((state) => ({
            pageWidgets: {
              ...state.pageWidgets,
              [pageId]: (state.pageWidgets[pageId] || []).map((w) =>
                w.id === id ? { ...w, ...updates } : w
              ),
            },
          }));
        } else {
          set((state) => ({
            widgets: state.widgets.map((w) =>
              w.id === id ? { ...w, ...updates } : w
            ),
          }));
        }
      },

      updateLayout: (widgets, pageId) => {
        if (pageId) {
          set((state) => ({
            pageWidgets: {
              ...state.pageWidgets,
              [pageId]: widgets,
            },
          }));
        } else {
          set({ widgets });
        }
      },

      resetToDefault: (pageId?: string) => {
        if (pageId) {
          set((state) => ({
            pageWidgets: {
              ...state.pageWidgets,
              [pageId]: [],
            },
          }));
        } else {
          set({ widgets: [] });
        }
      },

      refreshWidgetData: (tenantId?: string) => {
        const stats = getDashboardStats(tenantId);

        set((state) => ({
          widgets: state.widgets.map((widget) => refreshStatsWidget(widget, stats)),
          pageWidgets: Object.keys(state.pageWidgets).reduce((acc, pageId) => {
            acc[pageId] = state.pageWidgets[pageId].map((widget) =>
              refreshStatsWidget(widget, stats)
            );
            return acc;
          }, {} as PageWidgets),
        }));
      },

      getPageWidgets: (pageId: string) => {
        return get().pageWidgets[pageId] || [];
      },
    }),
    {
      name: WIDGET_CONFIG.STORAGE_KEY,
    }
  )
);
