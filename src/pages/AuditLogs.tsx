import React, { useState } from 'react';
import { Card, Table, Tag, Typography, Input, Select, DatePicker, Space, Button, Row, Col, Statistic } from 'antd';
import { AuditOutlined, SearchOutlined, DownloadOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import { mockAuditLogs } from '../services/mockSaasData';
import type { ColumnsType } from 'antd/es/table';

const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  status: string;
  details: string;
}

const AuditLogs: React.FC = () => {
  const [logs] = useState<AuditLog[]>(mockAuditLogs);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchText, setSearchText] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const handleSearch = (value: string) => {
    setSearchText(value);
    filterLogs(value, actionFilter);
  };

  const handleActionFilter = (value: string) => {
    setActionFilter(value);
    filterLogs(searchText, value);
  };

  const filterLogs = (search: string, action: string) => {
    let filtered = logs;

    if (search) {
      filtered = filtered.filter(log =>
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.resource.toLowerCase().includes(search.toLowerCase()) ||
        log.details.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (action !== 'all') {
      filtered = filtered.filter(log => log.action.startsWith(action));
    }

    setFilteredLogs(filtered);
  };

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Resource', 'IP Address', 'Status', 'Details'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.user,
        log.action,
        log.resource,
        log.ip,
        log.status,
        log.details,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString()}.csv`;
    a.click();
  };

  const columns: ColumnsType<AuditLog> = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
      sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user: string) => (
        <Space>
          <UserOutlined />
          <Text>{user}</Text>
        </Space>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => {
        const [, actionType] = action.split('.');
        const colorMap: Record<string, string> = {
          created: 'green',
          updated: 'blue',
          deleted: 'red',
          accessed: 'purple',
        };
        return <Tag color={colorMap[actionType] || 'default'}>{action}</Tag>;
      },
    },
    {
      title: 'Resource',
      dataIndex: 'resource',
      key: 'resource',
    },
    {
      title: 'IP Address',
      dataIndex: 'ip',
      key: 'ip',
      render: (ip: string) => <Text code>{ip}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          color={status === 'success' ? 'success' : 'error'}
          icon={status === 'success' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      ellipsis: true,
    },
  ];

  const actionTypes = ['all', 'device', 'user', 'dashboard', 'apikey', 'webhook'];
  const successfulLogs = logs.filter(log => log.status === 'success').length;
  const failedLogs = logs.filter(log => log.status === 'failure').length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <AuditOutlined /> Audit Logs
        </Title>
        <Paragraph type="secondary">
          Track all user actions and system events for security and compliance. Logs are retained for 90 days.
        </Paragraph>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Events"
              value={logs.length}
              prefix={<AuditOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Successful"
              value={successfulLogs}
              styles={{ content: { color: '#3f8600' } }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Failed"
              value={failedLogs}
              styles={{ content: { color: '#cf1322' } }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Unique Users"
              value={new Set(logs.map(log => log.user)).size}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Space orientation="vertical" style={{ width: '100%' }} size="large">
          <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space wrap>
              <Input
                placeholder="Search logs..."
                prefix={<SearchOutlined />}
                style={{ width: 250 }}
                onChange={e => handleSearch(e.target.value)}
                allowClear
              />
              <Select
                style={{ width: 150 }}
                placeholder="Filter by action"
                value={actionFilter}
                onChange={handleActionFilter}
              >
                {actionTypes.map(type => (
                  <Select.Option key={type} value={type}>
                    {type === 'all' ? 'All Actions' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </Select.Option>
                ))}
              </Select>
              <RangePicker />
            </Space>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              Export CSV
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={filteredLogs}
            rowKey="id"
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} logs`,
            }}
          />
        </Space>
      </Card>

      <Card title="Audit Log Information" style={{ marginTop: 16 }}>
        <Paragraph>
          <Text strong>What is logged:</Text>
          <ul>
            <li>All user actions (create, update, delete operations)</li>
            <li>API key generation and usage</li>
            <li>Webhook configuration changes</li>
            <li>Dashboard modifications</li>
            <li>User authentication events</li>
            <li>Permission changes</li>
          </ul>
        </Paragraph>
        <Paragraph>
          <Text strong>Retention Policy:</Text> Audit logs are retained for 90 days. Enterprise plans can request extended retention.
        </Paragraph>
        <Paragraph>
          <Text strong>Compliance:</Text> Audit logs comply with SOC 2, ISO 27001, and GDPR requirements.
        </Paragraph>
      </Card>
    </div>
  );
};

export default AuditLogs;
