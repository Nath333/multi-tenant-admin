import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PageWidget {
  id: string;
  type: string;
  title: string;
  config: Record<string, any>;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  disabled?: boolean; // Whether widget is disabled (visible but non-interactive)
}

export type PageMode = 'custom' | 'hybrid' | 'template';

export interface CustomPage {
  id: string;
  name: string;
  icon: string;
  path: string;
  description?: string;
  mode: PageMode; // NEW: Determines rendering mode
  templateId?: string; // NEW: Reference to template component
  widgets: PageWidget[];
  order: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PagesState {
  pages: CustomPage[];
  createPage: (page: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePage: (id: string, updates: Partial<CustomPage>) => void;
  deletePage: (id: string) => void;
  togglePage: (id: string) => void;
  addWidgetToPage: (pageId: string, widget: PageWidget) => void;
  updateWidgetInPage: (pageId: string, widgetId: string, updates: Partial<PageWidget>) => void;
  removeWidgetFromPage: (pageId: string, widgetId: string) => void;
  updateWidgetLayout: (pageId: string, layout: any[]) => void;
  getPage: (id: string) => CustomPage | undefined;
  getEnabledPages: () => CustomPage[];
}

export const usePagesStore = create<PagesState>()(
  persist(
    (set, get) => ({
      pages: [],

      createPage: (pageData) => {
        const newPage: CustomPage = {
          ...pageData,
          id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          pages: [...state.pages, newPage],
        }));
      },

      updatePage: (id, updates) => {
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === id
              ? { ...page, ...updates, updatedAt: new Date().toISOString() }
              : page
          ),
        }));
      },

      deletePage: (id) => {
        set((state) => ({
          pages: state.pages.filter((page) => page.id !== id),
        }));
      },

      togglePage: (id) => {
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === id ? { ...page, enabled: !page.enabled } : page
          ),
        }));
      },

      addWidgetToPage: (pageId, widget) => {
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === pageId
              ? {
                  ...page,
                  widgets: [...page.widgets, widget],
                  updatedAt: new Date().toISOString(),
                }
              : page
          ),
        }));
      },

      updateWidgetInPage: (pageId, widgetId, updates) => {
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === pageId
              ? {
                  ...page,
                  widgets: page.widgets.map((widget) =>
                    widget.id === widgetId ? { ...widget, ...updates } : widget
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : page
          ),
        }));
      },

      removeWidgetFromPage: (pageId, widgetId) => {
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === pageId
              ? {
                  ...page,
                  widgets: page.widgets.filter((widget) => widget.id !== widgetId),
                  updatedAt: new Date().toISOString(),
                }
              : page
          ),
        }));
      },

      updateWidgetLayout: (pageId, layout) => {
        set((state) => ({
          pages: state.pages.map((page) => {
            if (page.id !== pageId) return page;

            const updatedWidgets = page.widgets.map((widget) => {
              const layoutItem = layout.find((item) => item.i === widget.id);
              if (layoutItem) {
                return {
                  ...widget,
                  layout: {
                    x: layoutItem.x,
                    y: layoutItem.y,
                    w: layoutItem.w,
                    h: layoutItem.h,
                  },
                };
              }
              return widget;
            });

            return {
              ...page,
              widgets: updatedWidgets,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      getPage: (id) => {
        return get().pages.find((page) => page.id === id);
      },

      getEnabledPages: () => {
        return get()
          .pages.filter((page) => page.enabled)
          .sort((a, b) => a.order - b.order);
      },
    }),
    {
      name: 'pages-storage',
    }
  )
);
