import { useState, useCallback, type ReactNode } from 'react';
import { message } from 'antd';
import type { Layout } from 'react-grid-layout';
import { useWidgetStore, type Widget } from '../../../store/widgetStore';
import EnhancedWidgetConfigModal from '../../modals/EnhancedWidgetConfigModal';
import WidgetCatalogModal from '../../modals/WidgetCatalogModal';
import WidgetPreviewDrawer from '../../drawers/WidgetPreviewDrawer';
import KeyboardShortcutsModal from '../../modals/KeyboardShortcutsModal';
import WidgetGrid from './WidgetGrid';
import DashboardHeader from './DashboardHeader';
import EmptyDashboard from './EmptyDashboard';
import { getDefaultWidgetSize } from '../registry/registryHelpers';
import type { WidgetDefinition } from '../registry/registryHelpers';
import type { WidgetRegistration } from '../registry/widgetRegistry.types';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';
import styles from './WidgetLayout.module.css';

interface WidgetLayoutProps {
  pageId: string;
  title?: string;
  description?: string;
  customContent?: ReactNode;
  showHeader?: boolean;
}

export default function WidgetLayout({
  pageId,
  title,
  description,
  customContent,
  showHeader = true,
}: WidgetLayoutProps) {
  const [editMode, setEditMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [previewWidget, setPreviewWidget] = useState<WidgetDefinition | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  const { getPageWidgets, updateLayout, removeWidget, addWidget, updateWidget } = useWidgetStore();
  const widgets = getPageWidgets(pageId);

  // Keyboard shortcuts handler
  const handleEscape = useCallback(() => {
    if (modalVisible) {
      setModalVisible(false);
    } else if (previewVisible) {
      setPreviewVisible(false);
    } else if (configModalVisible) {
      setConfigModalVisible(false);
    } else if (showShortcutsModal) {
      setShowShortcutsModal(false);
    } else if (editMode) {
      setEditMode(false);
      message.info('Edit mode disabled');
    }
  }, [modalVisible, previewVisible, configModalVisible, showShortcutsModal, editMode]);

  useKeyboardShortcuts({
    onToggleEdit: () => setEditMode((prev) => !prev),
    onOpenCatalog: () => setModalVisible(true),
    onOpenShortcuts: () => setShowShortcutsModal(true),
    onEscape: handleEscape,
  });

  const handleToggleEdit = useCallback(() => {
    setEditMode((prev) => {
      const newEditMode = !prev;
      if (newEditMode) {
        message.info('Edit mode: Drag, resize, or add widgets', 2);
      } else {
        message.success('Changes saved', 1.5);
      }
      return newEditMode;
    });
  }, []);

  const handleEditWidget = useCallback((widget: Widget) => {
    setEditingWidget(widget);
    setConfigModalVisible(true);
  }, []);

  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      const currentWidgets = getPageWidgets(pageId);
      const updatedWidgets = currentWidgets.map((widget) => {
        const layoutItem = newLayout.find((l) => l.i === widget.id);
        if (layoutItem) {
          return {
            ...widget,
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          };
        }
        return widget;
      });
      updateLayout(updatedWidgets, pageId);
    },
    [getPageWidgets, updateLayout, pageId]
  );

  const handleAddWidget = useCallback(
    (type: string, widgetTitle: string, config?: Record<string, unknown>) => {
      const currentWidgets = getPageWidgets(pageId);
      const maxY = currentWidgets.reduce((max, w) => Math.max(max, w.y + w.h), 0);
      const defaultSize = getDefaultWidgetSize(type);

      const newWidget = {
        type,
        title: widgetTitle,
        x: 0,
        y: maxY,
        w: defaultSize.w,
        h: defaultSize.h,
        config,
      };

      addWidget(newWidget, pageId);
      setModalVisible(false);
      message.success(`Widget "${widgetTitle}" added`, 2);

      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    },
    [getPageWidgets, addWidget, pageId]
  );

  const handleDropWidget = useCallback(
    (widgetData: { widgetId: string; widgetName: string; defaultSize: { w: number; h: number } }) => {
      handleAddWidget(widgetData.widgetId, widgetData.widgetName);
    },
    [handleAddWidget]
  );

  const handleSaveWidgetConfig = useCallback(
    (updates: Record<string, unknown>) => {
      if (editingWidget) {
        updateWidget(editingWidget.id, updates, pageId);
        message.success('Widget configuration saved successfully');
        setConfigModalVisible(false);
        setEditingWidget(null);
      }
    },
    [editingWidget, updateWidget, pageId]
  );

  const handleCancelConfig = useCallback(() => {
    setConfigModalVisible(false);
    setEditingWidget(null);
  }, []);

  const handleConfigChange = useCallback(
    (widgetId: string, newConfig: Record<string, unknown>) => {
      updateWidget(widgetId, { config: newConfig }, pageId);
    },
    [updateWidget, pageId]
  );

  const handlePreviewWidget = useCallback((widget: WidgetRegistration, e: React.MouseEvent) => {
    e.stopPropagation();
    const widgetDef: WidgetDefinition = {
      type: widget.metadata.id,
      title: widget.metadata.name,
      icon: widget.metadata.icon,
      description: widget.metadata.description,
      tags: widget.metadata.tags ?? [],
      popular: false,
      defaultConfig: widget.defaultConfig,
    };
    setPreviewWidget(widgetDef);
    setPreviewVisible(true);
  }, []);

  return (
    <div className={styles.container}>
      {showHeader && (
        <DashboardHeader
          title={title}
          description={description}
          editMode={editMode}
          onToggleEdit={handleToggleEdit}
          onAddWidget={() => setModalVisible(true)}
          onShowShortcuts={() => setShowShortcutsModal(true)}
        />
      )}

      {customContent}

      {widgets.length === 0 && !editMode && (
        <EmptyDashboard onAddWidget={() => setModalVisible(true)} />
      )}

      <WidgetGrid
        widgets={widgets}
        editMode={editMode}
        pageId={pageId}
        onLayoutChange={handleLayoutChange}
        onRemove={removeWidget}
        onEdit={handleEditWidget}
        onConfigChange={handleConfigChange}
        onDropWidget={handleDropWidget}
      />

      <WidgetCatalogModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddWidget={handleAddWidget}
        onPreviewWidget={handlePreviewWidget}
        activeWidgetsCount={widgets.length}
        enableDragAndDrop={editMode}
      />

      <InlineWidgetConfigurator
        visible={configModalVisible}
        widget={editingWidget}
        onSave={handleSaveWidgetConfig}
        onCancel={handleCancelConfig}
      />

      <WidgetPreviewDrawer
        visible={previewVisible}
        widget={previewWidget}
        onClose={() => setPreviewVisible(false)}
        onAddWidget={handleAddWidget}
      />

      <KeyboardShortcutsModal visible={showShortcutsModal} onClose={() => setShowShortcutsModal(false)} />
    </div>
  );
}
