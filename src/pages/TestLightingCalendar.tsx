/**
 * Test Page for Lighting Control Widget - Weekly Calendar Demo
 * Direct URL: http://localhost:5174/test-lighting
 */

import { useState } from 'react';
import { Card, Space, Typography } from 'antd';
import LightingControlWidget from '../components/widgets/v2/widgets/LightingControlWidget/LightingControlWidget';
import type { LightingControlWidgetConfig } from '../components/widgets/v2/types/ConfigurableWidget.types';

const { Title, Paragraph } = Typography;

const TestLightingCalendar = () => {
  const [config, setConfig] = useState<LightingControlWidgetConfig>({
    elements: [
      {
        id: 'zone-1',
        type: 'lighting-zone',
        name: 'Main Office',
        location: 'Building A - Floor 1',
        enabled: true,
        displayOrder: 0,
        fixtureCount: 12,
        powerRating: 40,
        supportsDimming: true,
        supportsColor: false,
        defaultBrightness: 75,
        minBrightness: 10,
        maxBrightness: 100,
        dataBinding: {
          id: 'zone-1-binding',
          name: 'Main Office Data',
          sourceType: 'device-status',
          mockDataKey: 'lighting-zone',
          refreshInterval: 5000,
        },
      },
      {
        id: 'zone-2',
        type: 'lighting-zone',
        name: 'Conference Room',
        location: 'Building A - Floor 2',
        enabled: true,
        displayOrder: 1,
        fixtureCount: 8,
        powerRating: 35,
        supportsDimming: true,
        supportsColor: false,
        defaultBrightness: 60,
        minBrightness: 10,
        maxBrightness: 100,
        dataBinding: {
          id: 'zone-2-binding',
          name: 'Conference Room Data',
          sourceType: 'device-status',
          mockDataKey: 'lighting-zone',
          refreshInterval: 5000,
        },
      },
    ],
    layout: 'grid',
    showEnergyMetrics: true,
    showSchedules: true,
    showOccupancy: true,
  });

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Title level={2}>🌟 Ultra-Modern Weekly Calendar Demo</Title>
          <Paragraph>
            This is a dedicated test page for the improved Lighting Control Widget with the new
            <strong> pro ultra calendar</strong> interface.
          </Paragraph>
          <Paragraph>
            <strong>Features:</strong>
          </Paragraph>
          <ul>
            <li>✅ All hours default to OFF state</li>
            <li>✅ Click any cell to cycle: OFF → ON → AUTO → OFF</li>
            <li>✅ Gradient backgrounds with glow effects</li>
            <li>✅ Hover animations (cells scale up on hover)</li>
            <li>✅ Bulk controls: Set entire rows (hours) or columns (days)</li>
            <li>✅ Quick actions: Clear All, Set All ON, Set All AUTO</li>
            <li>✅ Tooltips show day, time, and current state</li>
          </ul>
          <Paragraph type="secondary">
            Click "Show Schedule" button below to see the calendar ⬇️
          </Paragraph>
        </Card>

        <LightingControlWidget
          title="Lighting Control - Weekly Schedule Demo"
          config={config}
          onConfigChange={setConfig}
          onRemove={() => console.log('Remove clicked')}
          editMode={false}
        />
      </Space>
    </div>
  );
};

export default TestLightingCalendar;
