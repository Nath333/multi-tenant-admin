import { Modal } from 'antd';
import { WidgetCatalog } from '../widgets/registry/WidgetCatalog';
import { widgetRegistry } from '../widgets/registry/WidgetRegistry';
import type { WidgetRegistration } from '../widgets/registry/widgetRegistry.types';
import styles from './WidgetCatalogModal.module.css';

interface WidgetCatalogModalProps {
  visible: boolean;
  onClose: () => void;
  onAddWidget: (type: string, title: string, config?: Record<string, unknown>) => void;
  onPreviewWidget?: (widget: WidgetRegistration, e: React.MouseEvent) => void;
  activeWidgetsCount?: number;
  enableDragAndDrop?: boolean;
}

export default function WidgetCatalogModal({
  visible,
  onClose,
  onAddWidget,
  enableDragAndDrop = true,
}: WidgetCatalogModalProps) {

  const handleWidgetSelect = (widgetId: string) => {
    const registration = widgetRegistry.get(widgetId);
    if (registration) {
      onAddWidget(
        widgetId,
        registration.metadata.name,
        registration.defaultConfig
      );
      onClose();
    }
  };

  return (
    <Modal
      title={
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            📦
          </div>
          <div>
            <div className={styles.headerTitle}>
              Add Widget
            </div>
            <div className={styles.headerSubtitle}>
              Choose a widget to add to your dashboard
            </div>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1300}
      style={{ top: 20 }}
      styles={{
        body: {
          padding: '0 24px 24px 24px',
          maxHeight: '82vh',
          overflow: 'auto',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%)',
        },
        header: {
          padding: '18px 24px',
          borderBottom: '2px solid transparent',
          borderImage: 'linear-gradient(90deg, transparent 0%, #e5e7eb 50%, transparent 100%) 1',
          background: 'linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
        },
      }}
    >
      <WidgetCatalog
        onSelect={handleWidgetSelect}
        enableDragAndDrop={enableDragAndDrop}
      />
    </Modal>
  );
}
