import { Button, Space, Tooltip } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import styles from './WidgetLayout.module.css';

interface DashboardHeaderProps {
  title?: string;
  description?: string;
  editMode: boolean;
  onToggleEdit: () => void;
  onAddWidget: () => void;
  onShowShortcuts: () => void;
}

export default function DashboardHeader({
  title,
  description,
  editMode,
  onToggleEdit,
  onAddWidget,
  onShowShortcuts,
}: DashboardHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerAccent} />

      <div className={styles.headerContent}>
        <h2 className={styles.title}>{title || 'Dashboard'}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>

      <Space size={8}>
        <Tooltip title="Shortcuts (Ctrl+/)">
          <Button
            icon={<QuestionCircleOutlined style={{ fontSize: 14 }} />}
            onClick={onShowShortcuts}
            className={styles.iconButton}
          />
        </Tooltip>

        {!editMode ? (
          <Button
            type="primary"
            icon={<EditOutlined style={{ fontSize: 14 }} />}
            onClick={onToggleEdit}
            className={styles.primaryButton}
          >
            Customize
          </Button>
        ) : (
          <>
            <Button
              icon={<PlusOutlined style={{ fontSize: 14 }} />}
              onClick={onAddWidget}
              className={styles.secondaryButton}
            >
              Add Widget
            </Button>
            <Button
              type="primary"
              icon={<CheckOutlined style={{ fontSize: 14 }} />}
              onClick={onToggleEdit}
              className={styles.successButton}
            >
              Done
            </Button>
          </>
        )}
      </Space>
    </div>
  );
}
