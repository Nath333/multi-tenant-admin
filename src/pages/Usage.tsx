import React from 'react';
import { Card, Row, Col, Progress, Typography, Tag, Space, Statistic } from 'antd';
import { DashboardOutlined, ApiOutlined, DatabaseOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockUsageData, mockApiCallsHistory, mockPlans } from '../services/mockSaasData';
import {
  PAGE_CONTAINER_STYLE,
  PAGE_HEADER_STYLE,
  PAGE_TITLE_STYLE,
  PAGE_DESCRIPTION_STYLE,
  CARD_HOVERABLE_STYLE,
  CARD_STYLE,
  COLORS,
  getProgressColor,
  createIconStyle,
} from '../styles/themeConstants';

const { Title, Paragraph, Text } = Typography;

// ============================================================================
// CONSTANTS
// ============================================================================

const CARD_TITLE_STYLE = {
  fontSize: 16,
  fontWeight: 700,
  color: COLORS.text.primary,
} as const;

const CARD_HEAD_STYLE = {
  borderBottom: `1px solid ${COLORS.border.light}`,
  padding: '16px 24px',
} as const;

const CARD_BODY_STYLE = {
  padding: '24px',
} as const;

const PLAN_TAG_STYLE = {
  fontWeight: 600,
  fontSize: 13,
  padding: '4px 12px',
  borderRadius: 6,
} as const;

const Usage: React.FC = () => {
  const currentPlan = mockPlans[1]; // Pro plan

  const calculatePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // unlimited
    return Math.round((current / limit) * 100);
  };

  const usageItems = [
    {
      title: 'Devices',
      icon: <DashboardOutlined />,
      current: mockUsageData.devices.current,
      limit: mockUsageData.devices.limit,
      color: '#1890ff',
    },
    {
      title: 'Team Members',
      icon: <UserOutlined />,
      current: mockUsageData.users.current,
      limit: mockUsageData.users.limit,
      color: '#52c41a',
    },
    {
      title: 'API Calls',
      icon: <ApiOutlined />,
      current: mockUsageData.apiCalls.current,
      limit: mockUsageData.apiCalls.limit,
      color: '#722ed1',
    },
    {
      title: 'Storage (GB)',
      icon: <DatabaseOutlined />,
      current: mockUsageData.storage.current,
      limit: mockUsageData.storage.limit,
      color: '#fa8c16',
    },
  ];

  return (
    <div style={PAGE_CONTAINER_STYLE}>
      <div style={PAGE_HEADER_STYLE}>
        <Title level={2} style={{...PAGE_TITLE_STYLE, marginBottom: 12}}>
          <DashboardOutlined style={createIconStyle(COLORS.primary.start, 20)} />
          Usage & Quotas
        </Title>
        <Paragraph style={PAGE_DESCRIPTION_STYLE}>
          Monitor your resource usage and quotas. Current plan:{' '}
          <Tag color="blue" style={PLAN_TAG_STYLE}>{currentPlan.name}</Tag>
        </Paragraph>
      </div>

      <Row gutter={[20, 20]}>
        {usageItems.map((item) => {
          const percentage = calculatePercentage(item.current, item.limit);
          const isNearLimit = percentage >= 75;

          return (
            <Col xs={24} sm={12} lg={6} key={item.title}>
              <Card
                style={CARD_HOVERABLE_STYLE}
                hoverable
                styles={{
                  body: { padding: 24 },
                }}
              >
                <Space direction="vertical" style={{ width: '100%' }} size={16}>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space>
                      <div style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: `${item.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        color: item.color,
                      }}>
                        {item.icon}
                      </div>
                      <Text strong style={{ fontSize: 15, fontWeight: 600, color: '#1a202c' }}>
                        {item.title}
                      </Text>
                    </Space>
                    {isNearLimit && (
                      <WarningOutlined style={{ color: '#faad14', fontSize: 18 }} />
                    )}
                  </Space>
                  <Statistic
                    value={item.current}
                    suffix={`/ ${item.limit === -1 ? '∞' : item.limit}`}
                    valueStyle={{
                      color: item.color,
                      fontSize: 26,
                      fontWeight: 700,
                    }}
                  />
                  <Progress
                    percent={percentage}
                    strokeColor={getProgressColor(percentage)}
                    showInfo={false}
                    strokeWidth={8}
                    style={{ marginBottom: 4 }}
                  />
                  <Text type="secondary" style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: getProgressColor(percentage),
                  }}>
                    {percentage}% used
                  </Text>
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
        <Col xs={24} lg={16}>
          <Card
            title={<span style={CARD_TITLE_STYLE}>API Calls - Last 7 Days</span>}
            style={CARD_STYLE}
            styles={{
              body: CARD_BODY_STYLE,
              header: CARD_HEAD_STYLE,
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockApiCallsHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="calls"
                  stroke="#1890ff"
                  strokeWidth={2}
                  name="API Calls"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={<span style={CARD_TITLE_STYLE}>Plan Features</span>}
            style={CARD_STYLE}
            styles={{
              body: CARD_BODY_STYLE,
              header: CARD_HEAD_STYLE,
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Current Plan:</Text>
                <br />
                <Tag color="blue" style={{ marginTop: 8, fontSize: 16 }}>
                  {currentPlan.name}
                </Tag>
              </div>
              <div style={{ marginTop: 16 }}>
                <Text strong>Included Features:</Text>
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                  <li>
                    <Text>
                      {currentPlan.features.maxDevices === -1
                        ? 'Unlimited'
                        : currentPlan.features.maxDevices}{' '}
                      Devices
                    </Text>
                  </li>
                  <li>
                    <Text>
                      {currentPlan.features.maxUsers === -1
                        ? 'Unlimited'
                        : currentPlan.features.maxUsers}{' '}
                      Users
                    </Text>
                  </li>
                  <li>
                    <Text>
                      {currentPlan.features.maxApiCalls.toLocaleString()} API Calls/month
                    </Text>
                  </li>
                  <li>
                    <Text>{currentPlan.features.apiAccess ? '✓' : '✗'} API Access</Text>
                  </li>
                  <li>
                    <Text>{currentPlan.features.webhooks ? '✓' : '✗'} Webhooks</Text>
                  </li>
                  <li>
                    <Text>{currentPlan.features.auditLogs ? '✓' : '✗'} Audit Logs</Text>
                  </li>
                </ul>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="Resource Usage by Category">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={[
                  { category: 'Devices', usage: mockUsageData.devices.current },
                  { category: 'Users', usage: mockUsageData.users.current },
                  { category: 'API Calls (k)', usage: Math.round(mockUsageData.apiCalls.current / 1000) },
                  { category: 'Storage (GB)', usage: mockUsageData.storage.current },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="usage" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card
        title="Need More Resources?"
        style={{ marginTop: 16 }}
        extra={<Tag color="orange">Upgrade Available</Tag>}
      >
        <Paragraph>
          You're currently on the <Text strong>{currentPlan.name}</Text> plan.
          {usageItems.some(item => calculatePercentage(item.current, item.limit) >= 75) && (
            <>
              {' '}You're approaching your limits on some resources.
            </>
          )}
        </Paragraph>
        <Paragraph>
          <Text strong>Upgrade to Enterprise</Text> to get:
          <ul>
            <li>Unlimited devices and users</li>
            <li>Unlimited API calls</li>
            <li>Priority support</li>
            <li>Custom integrations</li>
            <li>SLA guarantees</li>
          </ul>
        </Paragraph>
      </Card>
    </div>
  );
};

export default Usage;
