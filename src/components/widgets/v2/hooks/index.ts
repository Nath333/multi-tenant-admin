/**
 * Widget Hooks Barrel Export
 * Provides convenient import path for widget hooks
 *
 * Usage:
 *   import { useElementManager, useAutoResize } from '../hooks';
 */

// Element Management Hook
export {
  useElementManager,
  useNestedElementManager,
} from './useElementManager';

// Auto Resize Hook
export { useAutoResize, type UseAutoResizeOptions } from './useAutoResize';
