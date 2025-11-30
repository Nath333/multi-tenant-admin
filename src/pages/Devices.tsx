import { ProTable } from '@ant-design/pro-components';
import { Tag, Badge, Progress, Button, Space, Tooltip } from 'antd';
import type { PresetStatusColorType } from 'antd/es/_util/colors';
import { PlusOutlined, ReloadOutlined, SignalFilled, AppstoreOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getDevicesByTenant } from '../services/mockData';
import { useAuthStore } from '../store/authStore';
import { useMemo } from 'react';
import type { Device } from '../types';
import {
  PAGE_CONTAINER_STYLE,
  PRIMARY_BUTTON_STYLE,
  SECONDARY_BUTTON_STYLE,
  PRO_TABLE_STYLE,
  PRO_TABLE_TABLE_STYLE,
  TABLE_HEADER_TITLE_STYLE,
  TABLE_HEADER_SUBTITLE_STYLE,
  TOTAL_COUNT_STYLE,
  COLORS,
  createIconStyle,
} from '../styles/themeConstants';

// ============================================================================
// CONSTANTS
// ============================================================================

const DEVICE_TYPE_COLORS: Record<string, string> = {
  sensor: 'blue',
  gateway: 'purple',
  actuator: 'green',
  camera: 'orange',
} as const;

const STATUS_CONFIG: Record<string, { color: PresetStatusColorType }> = {
  online: { color: 'success' },
  offline: { color: 'default' },
  warning: { color: 'warning' },
} as const;

export default function DevicesPage() {
  const { t } = useTranslation();
  const { currentTenant } = useAuthStore();

  // Get tenant-specific devices
  const tenantDevices = useMemo(() => {
    return currentTenant?.id ? getDevicesByTenant(currentTenant.id) : [];
  }, [currentTenant?.id]);

  const deviceTypeFilters = useMemo(() => [
    { text: t('devices.sensor'), value: 'sensor' },
    { text: t('devices.gateway'), value: 'gateway' },
    { text: t('devices.actuator'), value: 'actuator' },
    { text: t('devices.camera'), value: 'camera' },
  ], [t]);

  const statusFilters = useMemo(() => [
    { text: t('common.online'), value: 'online' },
    { text: t('common.offline'), value: 'offline' },
    { text: t('common.warning'), value: 'warning' },
  ], [t]);

  const columns = useMemo(() => [
    {
      title: t('devices.deviceName'),
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (_: unknown, record: Device) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.name}</div>
          <div style={{ fontSize: 12, color: '#999' }}>
            {record.model} • {record.serialNumber}
          </div>
        </div>
      ),
    },
    {
      title: t('devices.type'),
      dataIndex: 'type',
      key: 'type',
      filters: deviceTypeFilters,
      onFilter: (value: React.Key | boolean, record: Device) => record.type === value,
      render: (_: unknown, record: Device) => {
        return <Tag color={DEVICE_TYPE_COLORS[record.type]}>{t(`devices.${record.type}`)}</Tag>;
      },
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      filters: statusFilters,
      onFilter: (value: React.Key | boolean, record: Device) => record.status === value,
      render: (_: unknown, record: Device) => {
        return (
          <Badge status={STATUS_CONFIG[record.status].color} text={t(`common.${record.status}`)} />
        );
      },
    },
    {
      title: t('devices.location'),
      dataIndex: 'location',
      key: 'location',
      ellipsis: true,
    },
    {
      title: 'Signal',
      dataIndex: 'signal',
      key: 'signal',
      sorter: (a: Device, b: Device) => (a.signal ?? 0) - (b.signal ?? 0),
      render: (_: unknown, record: Device) => (
        <Tooltip title={`Signal strength: ${record.signal}%`}>
          <Space>
            <SignalFilled
              style={{
                color:
                  (record.signal ?? 0) >= 80 ? '#52c41a' : (record.signal ?? 0) >= 50 ? '#faad14' : '#ff4d4f',
              }}
            />
            <span>{record.signal}%</span>
          </Space>
        </Tooltip>
      ),
    },
    {
      title: t('devices.battery'),
      dataIndex: 'battery',
      key: 'battery',
      sorter: (a: Device, b: Device) => (a.battery ?? 0) - (b.battery ?? 0),
      render: (_: unknown, record: Device) => (
        <div style={{ width: 100 }}>
          <Progress
            percent={record.battery}
            size="small"
            status={(record.battery ?? 0) < 30 ? 'exception' : (record.battery ?? 0) < 60 ? 'normal' : 'success'}
            strokeColor={
              (record.battery ?? 0) < 30
                ? '#ff4d4f'
                : (record.battery ?? 0) < 60
                ? '#faad14'
                : '#52c41a'
            }
          />
        </div>
      ),
    },
    {
      title: 'Temperature',
      dataIndex: 'temperature',
      key: 'temperature',
      render: (_: unknown, record: Device) =>
        typeof record.temperature === 'number' && !isNaN(record.temperature) ? (
          <span style={{ color: record.temperature > 25 ? '#ff4d4f' : '#52c41a' }}>
            {record.temperature.toFixed(1)}°C
          </span>
        ) : (
          <span style={{ color: '#999' }}>N/A</span>
        ),
    },
    {
      title: t('devices.lastSeen'),
      dataIndex: 'lastSeen',
      key: 'lastSeen',
    },
    {
      title: t('devices.firmware'),
      dataIndex: 'firmware',
      key: 'firmware',
      render: (_: unknown, record: Device) => <Tag>{record.firmware}</Tag>,
    },
    {
      title: t('common.actions'),
      key: 'actions',
      fixed: 'right' as const,
      width: 180,
      render: () => (
        <Space>
          <Button type="link" size="small">
            {t('common.view')}
          </Button>
          <Button type="link" size="small">
            {t('common.configure')}
          </Button>
        </Space>
      ),
    },
  ], [t, deviceTypeFilters, statusFilters]);

  return (
    <div style={PAGE_CONTAINER_STYLE}>
      <ProTable
        columns={columns}
        dataSource={tenantDevices}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => (
            <span style={TOTAL_COUNT_STYLE}>
              Total {total} devices for {currentTenant?.name || 'tenant'}
            </span>
          ),
        }}
        toolBarRender={() => [
          <Button
            key="refresh"
            icon={<ReloadOutlined />}
            size="large"
            style={SECONDARY_BUTTON_STYLE}
          >
            {t('common.refresh')}
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            style={PRIMARY_BUTTON_STYLE}
          >
            {t('devices.addDevice')}
          </Button>,
        ]}
        headerTitle={
          <div>
            <div style={TABLE_HEADER_TITLE_STYLE}>
              <AppstoreOutlined style={createIconStyle(COLORS.primary.start)} />
              {t('devices.title')}
            </div>
            <div style={TABLE_HEADER_SUBTITLE_STYLE}>
              Manage and monitor all your IoT devices
            </div>
          </div>
        }
        cardBordered
        style={PRO_TABLE_STYLE}
        tableStyle={PRO_TABLE_TABLE_STYLE}
        options={{
          setting: {
            draggable: true,
          },
        }}
      />
    </div>
  );
}
