/**
 * useAutoResize Hook
 * Automatically resize widget when configuration changes
 */

import { useEffect, useRef } from 'react';
import { calculateOptimalSize, shouldResizeWidget, type WidgetSize } from '../utils/dynamicSizing';

export interface UseAutoResizeOptions {
  widgetId?: string;
  widgetType: string;
  config: any;
  currentSize?: WidgetSize;
  enabled?: boolean;
  onResize?: (newSize: WidgetSize) => void;
}

export function useAutoResize({
  widgetId,
  widgetType,
  config,
  currentSize,
  enabled = true,
  onResize,
}: UseAutoResizeOptions) {
  const previousConfigRef = useRef<any>(config);
  const resizeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !onResize || !currentSize) {
      return;
    }

    // Check if configuration has changed
    const configChanged = JSON.stringify(previousConfigRef.current) !== JSON.stringify(config);

    if (configChanged) {
      // Clear any pending resize
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Debounce resize to avoid rapid updates
      resizeTimeoutRef.current = setTimeout(() => {
        const optimalSize = calculateOptimalSize(widgetType, config);

        // Only resize if the difference is significant
        if (shouldResizeWidget(currentSize, optimalSize)) {
          onResize(optimalSize);
        }

        previousConfigRef.current = config;
      }, 300); // 300ms debounce
    }

    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [config, currentSize, enabled, onResize, widgetType, widgetId]);
}
