import { Empty, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface EmptyStateWithAddProps {
  description: string;
  buttonText: string;
  onAdd: () => void;
}

/**
 * Reusable Empty State Component
 * Shows empty state with "Add First Item" button
 */
export default function EmptyStateWithAdd({
  description,
  buttonText,
  onAdd,
}: EmptyStateWithAddProps) {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={description}
      className="empty-state"
    >
      <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
        {buttonText}
      </Button>
    </Empty>
  );
}
