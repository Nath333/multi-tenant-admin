import { Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './WidgetLayout.module.css';

interface EmptyDashboardProps {
  onAddWidget: () => void;
}

export default function EmptyDashboard({ onAddWidget }: EmptyDashboardProps) {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <div className={styles.emptyContent}>
          <h3 className={styles.emptyTitle}>No widgets yet</h3>
          <p className={styles.emptyDescription}>
            Get started by adding your first widget
          </p>
          <Button
            type="primary"
            icon={<PlusOutlined style={{ fontSize: 14 }} />}
            onClick={onAddWidget}
            className={`${styles.primaryButton} ${styles.emptyButton}`}
          >
            Add Widget
          </Button>
        </div>
      }
      className={styles.emptyContainer}
    />
  );
}
