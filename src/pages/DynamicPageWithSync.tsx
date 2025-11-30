import { useParams, Navigate } from 'react-router-dom';
import { useEffect, useRef, useCallback } from 'react';
import { usePagesStore } from '../store/pagesStore';
import { useWidgetStore } from '../store/widgetStore';
import type { Widget } from '../store/widgetStore';
import { WidgetLayout } from '../components/widgets/core';

/**
 * Dynamic page renderer with automatic bidirectional synchronization
 *
 * Problem Solved:
 * - WidgetLayout uses widgetStore for widget operations
 * - Page Manager uses pagesStore for page widgets
 * - These two stores were not synced, causing data loss
 *
 * Solution:
 * 1. Load widgets from pagesStore into widgetStore on mount
 * 2. Subscribe to widgetStore changes
 * 3. Automatically sync changes back to pagesStore in real-time
 *
 * Critical Fixes Applied:
 * - Prevents infinite render loops with proper dependency management
 * - Avoids circular sync with initialization flag
 * - Debounces sync operations to prevent rapid updates
 * - Memory leak prevention with cleanup
 */
export default function DynamicPageWithSync() {
  const { pagePath } = useParams<{ pagePath: string }>();
  const { pages, updatePage } = usePagesStore();
  const { getPageWidgets, updateLayout } = useWidgetStore();

  const syncInProgressRef = useRef(false);
  const lastSyncedDataRef = useRef<string>('');
  const initializedPageRef = useRef<string>('');
  const isInitializingRef = useRef(false);
  const syncTimeoutRef = useRef<number | null>(null);

  // Find the page by path
  const page = pages.find((p) => p.path === `/${pagePath}` && p.enabled);
  const pageId = page?.id || '';

  // Get widget data directly (zustand hooks are already optimized)
  const widgetStoreData = getPageWidgets(pageId);

  // Initialize: Load widgets from pagesStore into widgetStore (ONCE per page)
  useEffect(() => {
    if (!page || initializedPageRef.current === page.id) return;

    isInitializingRef.current = true;

    // Store timeout ID for cleanup
    let initTimeoutId: number;

    try {
      // Convert pagesStore widgets to widgetStore format
      const pageWidgetsFromStore = page.widgets.map((widget) => ({
        id: widget.id,
        type: widget.type,
        title: widget.title,
        x: widget.layout.x,
        y: widget.layout.y,
        w: widget.layout.w,
        h: widget.layout.h,
        config: widget.config,
        disabled: widget.disabled,
        pageId: page.id,
      }));

      // Initialize widgetStore with pagesStore data
      updateLayout(pageWidgetsFromStore, page.id);
      lastSyncedDataRef.current = JSON.stringify(pageWidgetsFromStore);
      initializedPageRef.current = page.id;
    } finally {
      // Delay clearing initialization flag to prevent immediate sync
      initTimeoutId = setTimeout(() => {
        isInitializingRef.current = false;
      }, 100);
    }

    // Cleanup on unmount or page change
    return () => {
      // Clear initialization timeout
      if (initTimeoutId) {
        clearTimeout(initTimeoutId);
      }
      // Clear sync timeout
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = null;
      }
      // Reset initialization when leaving page
      if (initializedPageRef.current === page.id) {
        initializedPageRef.current = '';
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when page ID changes
  }, [page?.id, updateLayout]);

  // Bidirectional Sync: Watch widgetStore and sync to pagesStore
  const syncToPagesStore = useCallback(() => {
    // Skip sync if:
    // - No page
    // - Currently syncing
    // - Currently initializing (prevent circular sync)
    // - No actual changes
    if (!page || syncInProgressRef.current || isInitializingRef.current) return;

    const currentData = JSON.stringify(widgetStoreData);

    // Only sync if data actually changed
    if (currentData === lastSyncedDataRef.current) return;

    syncInProgressRef.current = true;

    try {
      // Convert widgetStore format to pagesStore format
      const updatedPageWidgets = widgetStoreData.map((widget: Widget) => ({
        id: widget.id,
        type: widget.type,
        title: widget.title,
        config: widget.config || {},
        layout: {
          x: widget.x,
          y: widget.y,
          w: widget.w,
          h: widget.h,
        },
        disabled: widget.disabled,
      }));

      // Update pagesStore
      updatePage(page.id, { widgets: updatedPageWidgets });
      lastSyncedDataRef.current = currentData;
    } catch (error) {
      console.error('Error syncing widgets to pagesStore:', error);
    } finally {
      syncInProgressRef.current = false;
    }
  }, [page, widgetStoreData, updatePage]);

  // Debounced sync to prevent rapid updates
  useEffect(() => {
    // Clear existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Skip if initializing
    if (isInitializingRef.current) return;

    // Debounce sync by 200ms
    syncTimeoutRef.current = setTimeout(() => {
      syncToPagesStore();
    }, 200);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [widgetStoreData, syncToPagesStore]);

  // If page not found, redirect to devices
  if (!page) {
    return <Navigate to="/devices" replace />;
  }

  return (
    <WidgetLayout
      pageId={page.id}
      title={page.name}
      description={page.description}
    />
  );
}
