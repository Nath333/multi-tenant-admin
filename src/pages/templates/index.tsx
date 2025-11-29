import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Space, Input, Button, Tooltip } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
  ThunderboltOutlined,
  CloudOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Editable Card Component with inline name editing
export const EditableCard: React.FC<{
  title: string;
  children: React.ReactNode;
  onTitleChange?: (newTitle: string) => void;
  extra?: React.ReactNode;
}> = ({ title, children, onTitleChange, extra }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  const handleSave = () => {
    if (onTitleChange && editValue.trim()) {
      onTitleChange(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(title);
    setIsEditing(false);
  };

  const cardTitle = isEditing ? (
    <Space.Compact style={{ width: '300px' }}>
      <Input
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onPressEnter={handleSave}
        autoFocus
        size="small"
      />
      <Button size="small" type="primary" icon={<CheckOutlined />} onClick={handleSave} />
      <Button size="small" icon={<CloseOutlined />} onClick={handleCancel} />
    </Space.Compact>
  ) : (
    <Space>
      <span>{title}</span>
      {onTitleChange && (
        <Tooltip title="Click to edit name">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => setIsEditing(true)}
          />
        </Tooltip>
      )}
    </Space>
  );

  return (
    <Card title={cardTitle} extra={extra}>
      {children}
    </Card>
  );
};

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  icon: string;
  supportsWidgets: boolean;
  starterWidgets?: Array<{
    type: string;
    title: string;
    layout: { x: number; y: number; w: number; h: number };
  }>;
}

// Dashboard Overview Template - Simplified
const DashboardTemplate: React.FC = () => {
  const [cardTitles, setCardTitles] = useState({
    users: 'Total Users',
    revenue: 'Revenue',
    orders: 'Orders',
    growth: 'Growth Rate',
  });

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <EditableCard
            title={cardTitles.users}
            onTitleChange={(newTitle) => setCardTitles({ ...cardTitles, users: newTitle })}
          >
            <Statistic
              value={11280}
              prefix={<UserOutlined />}
              styles={{ content: { color: '#3f8600' } }}
              suffix={<ArrowUpOutlined style={{ fontSize: 14 }} />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>+12.5% from last month</Text>
          </EditableCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <EditableCard
            title={cardTitles.revenue}
            onTitleChange={(newTitle) => setCardTitles({ ...cardTitles, revenue: newTitle })}
          >
            <Statistic
              value={93820}
              prefix={<DollarOutlined />}
              precision={2}
              styles={{ content: { color: '#1890ff' } }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>+8.3% from last month</Text>
          </EditableCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <EditableCard
            title={cardTitles.orders}
            onTitleChange={(newTitle) => setCardTitles({ ...cardTitles, orders: newTitle })}
          >
            <Statistic
              value={1342}
              prefix={<ShoppingCartOutlined />}
              styles={{ content: { color: '#cf1322' } }}
              suffix={<ArrowDownOutlined style={{ fontSize: 14 }} />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>-2.1% from last month</Text>
          </EditableCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <EditableCard
            title={cardTitles.growth}
            onTitleChange={(newTitle) => setCardTitles({ ...cardTitles, growth: newTitle })}
          >
            <Statistic
              value={15.8}
              prefix={<RiseOutlined />}
              suffix="%"
              styles={{ content: { color: '#722ed1' } }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Quarterly growth</Text>
          </EditableCard>
        </Col>
      </Row>
    </div>
  );
};

// Analytics Template - Simplified
const AnalyticsTemplate: React.FC = () => {
  const [cardTitles, setCardTitles] = useState({
    sessions: 'Active Sessions',
    response: 'Avg Response Time',
    uptime: 'System Uptime',
  });

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <EditableCard
            title={cardTitles.sessions}
            onTitleChange={(newTitle) => setCardTitles({ ...cardTitles, sessions: newTitle })}
          >
            <Title level={2} style={{ margin: '20px 0', color: '#1890ff' }}>2,451</Title>
            <Text type="secondary">Currently active</Text>
          </EditableCard>
        </Col>
        <Col xs={24} sm={8}>
          <EditableCard
            title={cardTitles.response}
            onTitleChange={(newTitle) => setCardTitles({ ...cardTitles, response: newTitle })}
          >
            <Title level={2} style={{ margin: '20px 0', color: '#52c41a' }}>142ms</Title>
            <Text type="secondary">Performance metric</Text>
          </EditableCard>
        </Col>
        <Col xs={24} sm={8}>
          <EditableCard
            title={cardTitles.uptime}
            onTitleChange={(newTitle) => setCardTitles({ ...cardTitles, uptime: newTitle })}
          >
            <Title level={2} style={{ margin: '20px 0', color: '#722ed1' }}>99.9%</Title>
            <Text type="secondary">Last 30 days</Text>
          </EditableCard>
        </Col>
      </Row>
    </div>
  );
};

// BMS Control Center Template - Simplified with better editing
const BMSControlCenterTemplate: React.FC = () => {
  const [cardTitles, setCardTitles] = useState({
    hvac: 'HVAC Systems',
    power: 'Power Load',
    temp: 'Building Temperature',
    energy: 'Energy Consumption',
  });

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <EditableCard
            title={cardTitles.hvac}
            onTitleChange={(newTitle) => setCardTitles({ ...cardTitles, hvac: newTitle })}
          >
            <Statistic
              value={12}
              suffix="/ 12"
              styles={{ content: { color: '#1890ff' } }}
              prefix={<CloudOutlined />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>All systems operational</Text>
          </EditableCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <EditableCard
            title={cardTitles.power}
            onTitleChange={(newTitle) => setCardTitles({ ...cardTitles, power: newTitle })}
          >
            <Statistic
              value={312}
              suffix="kW"
              styles={{ content: { color: '#52c41a' } }}
              prefix={<ThunderboltOutlined />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Current load</Text>
          </EditableCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <EditableCard
            title={cardTitles.temp}
            onTitleChange={(newTitle) => setCardTitles({ ...cardTitles, temp: newTitle })}
          >
            <Statistic
              value={22.5}
              suffix="°C"
              styles={{ content: { color: '#fa8c16' } }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Optimal range</Text>
          </EditableCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <EditableCard
            title={cardTitles.energy}
            onTitleChange={(newTitle) => setCardTitles({ ...cardTitles, energy: newTitle })}
          >
            <Statistic
              value={4250}
              suffix="kWh"
              styles={{ content: { color: '#722ed1' } }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Today: -8% vs yesterday</Text>
          </EditableCard>
        </Col>
      </Row>
    </div>
  );
};

// BMS Energy Management Template - Simplified
const BMSEnergyTemplate: React.FC = () => {
  const [cardTitles, setCardTitles] = useState({
    demand: 'Current Demand',
    consumption: "Today's Consumption",
    factor: 'Power Factor',
  });

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <EditableCard
            title={cardTitles.demand}
            onTitleChange={(newTitle) => setCardTitles({ ...cardTitles, demand: newTitle })}
          >
            <Statistic value={312} suffix="kW" styles={{ content: { color: '#1890ff' } }} />
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
              Peak capacity: 500kW
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              62% of capacity
            </Text>
          </EditableCard>
        </Col>
        <Col xs={24} md={8}>
          <EditableCard
            title={cardTitles.consumption}
            onTitleChange={(newTitle) => setCardTitles({ ...cardTitles, consumption: newTitle })}
          >
            <Statistic value={4250} suffix="kWh" styles={{ content: { color: '#52c41a' } }} />
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
              Cost: $340.00
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <ArrowDownOutlined style={{ color: '#52c41a' }} /> 8% vs yesterday
            </Text>
          </EditableCard>
        </Col>
        <Col xs={24} md={8}>
          <EditableCard
            title={cardTitles.factor}
            onTitleChange={(newTitle) => setCardTitles({ ...cardTitles, factor: newTitle })}
          >
            <Statistic value={0.92} precision={2} styles={{ content: { color: '#722ed1' } }} />
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
              Target: 0.95
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              3% below target
            </Text>
          </EditableCard>
        </Col>
      </Row>
    </div>
  );
};

// BMS HVAC Dashboard Template - Simplified
const BMSHVACTemplate: React.FC = () => {
  const [cardTitles, setCardTitles] = useState({
    avgTemp: 'Average Temperature',
    humidity: 'Humidity Level',
    airQuality: 'Air Quality Index',
    energyUse: 'HVAC Energy Usage',
  });

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <EditableCard
            title={cardTitles.avgTemp}
            onTitleChange={(newTitle) => setCardTitles({ ...cardTitles, avgTemp: newTitle })}
          >
            <Statistic
              value={22.5}
              suffix="°C"
              styles={{ content: { color: '#1890ff' } }}
              prefix={<CloudOutlined />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Comfort zone</Text>
          </EditableCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <EditableCard
            title={cardTitles.humidity}
            onTitleChange={(newTitle) => setCardTitles({ ...cardTitles, humidity: newTitle })}
          >
            <Statistic
              value={45}
              suffix="%"
              styles={{ content: { color: '#52c41a' } }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Optimal range</Text>
          </EditableCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <EditableCard
            title={cardTitles.airQuality}
            onTitleChange={(newTitle) => setCardTitles({ ...cardTitles, airQuality: newTitle })}
          >
            <Statistic
              value={98}
              suffix="/ 100"
              styles={{ content: { color: '#722ed1' } }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Excellent</Text>
          </EditableCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <EditableCard
            title={cardTitles.energyUse}
            onTitleChange={(newTitle) => setCardTitles({ ...cardTitles, energyUse: newTitle })}
          >
            <Statistic
              value={140.4}
              suffix="kW"
              styles={{ content: { color: '#fa8c16' } }}
              prefix={<ThunderboltOutlined />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>45% of total</Text>
          </EditableCard>
        </Col>
      </Row>
    </div>
  );
};

// Blank Template
const BlankTemplate: React.FC = () => null;

// Settings Template - Simplified
const SettingsTemplate: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="General Settings">
            <Space orientation="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={5}>Account Information</Title>
                <Text type="secondary">Manage your account details and preferences</Text>
              </div>
              <div>
                <Title level={5}>Security</Title>
                <Text type="secondary">Configure security settings and authentication</Text>
              </div>
              <div>
                <Title level={5}>Notifications</Title>
                <Text type="secondary">Control notification preferences</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export const pageTemplates: Record<string, PageTemplate> = {
  blank: {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Start from scratch - add your own widgets',
    component: BlankTemplate,
    icon: 'AppstoreOutlined',
    supportsWidgets: true,
  },
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard Overview',
    description: 'Key metrics dashboard with editable widget names',
    component: DashboardTemplate,
    icon: 'DashboardOutlined',
    supportsWidgets: true,
    starterWidgets: [
      { type: 'stats', title: 'Total Users', layout: { x: 0, y: 0, w: 3, h: 2 } },
      { type: 'stats', title: 'Revenue', layout: { x: 3, y: 0, w: 3, h: 2 } },
      { type: 'stats', title: 'Orders', layout: { x: 6, y: 0, w: 3, h: 2 } },
      { type: 'stats', title: 'Growth Rate', layout: { x: 9, y: 0, w: 3, h: 2 } },
    ],
  },
  analytics: {
    id: 'analytics',
    name: 'Analytics View',
    description: 'Simple analytics with editable metrics',
    component: AnalyticsTemplate,
    icon: 'BarChartOutlined',
    supportsWidgets: true,
    starterWidgets: [
      { type: 'stats', title: 'Active Sessions', layout: { x: 0, y: 0, w: 4, h: 3 } },
      { type: 'stats', title: 'Response Time', layout: { x: 4, y: 0, w: 4, h: 3 } },
      { type: 'stats', title: 'Uptime', layout: { x: 8, y: 0, w: 4, h: 3 } },
    ],
  },
  settings: {
    id: 'settings',
    name: 'Settings Layout',
    description: 'Settings and configuration page',
    component: SettingsTemplate,
    icon: 'SettingOutlined',
    supportsWidgets: false,
  },
  bmsControlCenter: {
    id: 'bmsControlCenter',
    name: 'BMS Control Center',
    description: 'Building management system dashboard',
    component: BMSControlCenterTemplate,
    icon: 'ControlOutlined',
    supportsWidgets: true,
    starterWidgets: [
      { type: 'hvac-control', title: 'HVAC Systems', layout: { x: 0, y: 0, w: 6, h: 6 } },
      { type: 'energy-control', title: 'Power Load', layout: { x: 6, y: 0, w: 6, h: 6 } },
      { type: 'stats', title: 'Temperature', layout: { x: 0, y: 6, w: 3, h: 2 } },
      { type: 'stats', title: 'Energy', layout: { x: 3, y: 6, w: 3, h: 2 } },
    ],
  },
  bmsEnergy: {
    id: 'bmsEnergy',
    name: 'Energy Management',
    description: 'Energy monitoring and optimization',
    component: BMSEnergyTemplate,
    icon: 'ThunderboltOutlined',
    supportsWidgets: true,
    starterWidgets: [
      { type: 'energy-control', title: 'Current Demand', layout: { x: 0, y: 0, w: 6, h: 6 } },
      { type: 'stats', title: 'Daily Consumption', layout: { x: 6, y: 0, w: 3, h: 2 } },
      { type: 'stats', title: 'Power Factor', layout: { x: 9, y: 0, w: 3, h: 2 } },
    ],
  },
  bmsHvac: {
    id: 'bmsHvac',
    name: 'HVAC Dashboard',
    description: 'HVAC control and climate monitoring',
    component: BMSHVACTemplate,
    icon: 'CloudOutlined',
    supportsWidgets: true,
    starterWidgets: [
      { type: 'hvac-control', title: 'Temperature', layout: { x: 0, y: 0, w: 6, h: 6 } },
      { type: 'climate-control', title: 'Humidity', layout: { x: 6, y: 0, w: 6, h: 6 } },
      { type: 'stats', title: 'Air Quality', layout: { x: 0, y: 6, w: 3, h: 2 } },
      { type: 'stats', title: 'Energy Usage', layout: { x: 3, y: 6, w: 3, h: 2 } },
    ],
  },
};

export const getTemplate = (id: string) => pageTemplates[id];
export const getAllTemplates = () => Object.values(pageTemplates);
