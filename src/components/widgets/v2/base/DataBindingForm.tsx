import { Form, Select } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { getCompatibleDataSources, type MockDataSource } from '../data/mockDataSources';
import type { DataBinding } from '../types/ConfigurableWidget.types';

interface DataBindingFormProps {
  value?: DataBinding;
  onChange: (binding: DataBinding | undefined) => void;
  dataSourceTypes?: string[];
  label?: string;
  showRefreshInterval?: boolean;
}

/**
 * Reusable Data Binding Form Component
 * Used across all widget config panels to eliminate 285+ lines of duplication
 */
export default function DataBindingForm({
  value,
  onChange,
  dataSourceTypes = [],
  label = 'Data Binding',
}: DataBindingFormProps) {
  const compatibleDataSources = getCompatibleDataSources(dataSourceTypes);

  const handleDataSourceChange = (mockDataKey: string) => {
    const source = compatibleDataSources.find((s: MockDataSource) => s.key === mockDataKey);
    /* eslint-disable react-hooks/purity -- ID generation in event handler is intentional */
    onChange({
      id: `binding-${Date.now()}`,
      name: source?.name || 'Data Source',
      sourceType: source?.type || 'device-status',
      mockDataKey,
      refreshInterval: value?.refreshInterval || 5000,
    });
    /* eslint-enable react-hooks/purity */
  };

  const handleClear = () => {
    onChange(undefined);
  };

  return (
    <div className="data-binding-section">
      <div className="data-binding-title">
        <LinkOutlined />
        {label}
      </div>

      <Form.Item label="Data Source">
        <Select
          placeholder="Select a data source"
          value={value?.mockDataKey}
          onChange={handleDataSourceChange}
          onClear={handleClear}
          allowClear
          showSearch
        >
          {compatibleDataSources.map((source: MockDataSource) => (
            <Select.Option key={source.key} value={source.key}>
              <div>
                <div style={{ fontWeight: 500 }}>{source.name}</div>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                  {source.description}
                </div>
              </div>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  );
}
