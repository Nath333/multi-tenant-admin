/**
 * Config Panel Layout - Reusable Component
 * Provides standard layout for all widget configuration panels
 *
 * This component eliminates ~50 lines of duplicate code per config panel
 * Ensures consistent structure: header + content + sticky footer with actions
 */

import type { ReactNode } from 'react';
import { Button } from 'antd';

interface ConfigPanelLayoutProps {
  /** Panel content */
  children: ReactNode;
  /** Called when Cancel button is clicked */
  onCancel: () => void;
  /** Called when Save button is clicked (optional, defaults to onCancel) */
  onSave?: () => void;
  /** Cancel button text (optional) */
  cancelText?: string;
  /** Save button text (optional) */
  saveText?: string;
  /** Show save button (default: true) */
  showSaveButton?: boolean;
  /** CSS class name */
  className?: string;
}

/**
 * Standard Configuration Panel Layout
 * Provides:
 * - Scrollable content area
 * - Sticky action buttons at bottom
 * - Consistent spacing and styling
 */
export default function ConfigPanelLayout({
  children,
  onCancel,
  onSave,
  cancelText = 'Cancel',
  saveText = 'Save Configuration',
  showSaveButton = true,
  className = '',
}: ConfigPanelLayoutProps) {
  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      onCancel(); // If no save handler, just close
    }
  };

  return (
    <div className={`widget-config-panel ${className}`}>
      {/* Scrollable content area */}
      <div style={{ paddingBottom: 80 }}>
        {children}
      </div>

      {/* Sticky action buttons */}
      <div className="config-actions">
        <Button onClick={onCancel}>{cancelText}</Button>
        {showSaveButton && (
          <Button type="primary" onClick={handleSave}>
            {saveText}
          </Button>
        )}
      </div>
    </div>
  );
}
