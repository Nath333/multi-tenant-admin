/**
 * Lighting Control Widget Configuration Panel - REFACTORED VERSION
 * Now uses reusable components for cleaner, more maintainable code
 */

import { Form, Space, Tag } from 'antd';
import { BulbOutlined, LinkOutlined } from '@ant-design/icons';
import type { LightingControlWidgetConfig, LightingZoneConfig } from '../../types/ConfigurableWidget.types';

// Import reusable components
import {
  ConfigPanelLayout,
  ConfigSection,
  ElementListManager,
  TextField,
  NumberField,
  SwitchField,
  LayoutSelector,
  DataBindingForm,
} from '../../base';

interface LightingControlConfigPanelProps {
  config: LightingControlWidgetConfig;
  onChange: (newConfig: LightingControlWidgetConfig) => void;
  onClose: () => void;
}

export default function LightingControlConfigPanel({ config, onChange, onClose }: LightingControlConfigPanelProps) {
  const safeConfig: LightingControlWidgetConfig = {
    elements: config?.elements || [],
    showEnergyMetrics: config?.showEnergyMetrics ?? true,
    showSchedules: config?.showSchedules ?? true,
    showOccupancy: config?.showOccupancy ?? true,
    layout: config?.layout || 'grid',
  };

  const handleAddZone = () => {
    const newZone: LightingZoneConfig = {
      id: `zone-${Date.now()}`,
      name: `Zone ${safeConfig.elements.length + 1}`,
      enabled: true,
      displayOrder: safeConfig.elements.length,
      type: 'lighting-zone',
      location: '',
      defaultBrightness: 80,
      minBrightness: 0,
      maxBrightness: 100,
      supportsDimming: true,
      supportsColor: false,
      fixtureCount: 1,
      powerRating: 10,
    };
    onChange({ ...safeConfig, elements: [...safeConfig.elements, newZone] });
  };

  const handleDeleteZone = (zoneId: string) => {
    onChange({ ...safeConfig, elements: safeConfig.elements.filter(e => e.id !== zoneId) });
  };

  const handleUpdateZone = (zoneId: string, updates: Partial<LightingZoneConfig>) => {
    onChange({
      ...safeConfig,
      elements: safeConfig.elements.map(e => e.id === zoneId ? { ...e, ...updates } : e),
    });
  };

  const handleUpdateGlobalSettings = (updates: Partial<LightingControlWidgetConfig>) => {
    onChange({ ...safeConfig, ...updates });
  };

  const renderZoneHeader = (zone: LightingZoneConfig) => (
    <>
      <BulbOutlined />
      <span style={{ fontWeight: 500 }}>{zone.name}</span>
    </>
  );

  const renderZoneBadges = (zone: LightingZoneConfig) => (
    <>
      {!zone.enabled && <Tag color="red">Disabled</Tag>}
      {zone.dataBinding && <Tag color="green" icon={<LinkOutlined />}>Bound</Tag>}
    </>
  );

  const renderZoneForm = (zone: LightingZoneConfig) => (
    <Form layout="vertical">
      <TextField
        label="Zone Name"
        value={zone.name}
        onChange={(name) => handleUpdateZone(zone.id, { name })}
        placeholder="e.g., Conference Room"
      />

      <TextField
        label="Location"
        value={zone.location}
        onChange={(location) => handleUpdateZone(zone.id, { location })}
        placeholder="e.g., Building A, Floor 2"
      />

      <DataBindingForm
        value={zone.dataBinding}
        onChange={(binding) => handleUpdateZone(zone.id, { dataBinding: binding })}
        dataSourceTypes={['device-status', 'realtime-sensor']}
      />

      <NumberField
        label="Default Brightness"
        value={zone.defaultBrightness}
        onChange={(value) => handleUpdateZone(zone.id, { defaultBrightness: value || 80 })}
        min={zone.minBrightness}
        max={zone.maxBrightness}
        unit="%"
      />

      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <NumberField
          label="Min Brightness"
          value={zone.minBrightness}
          onChange={(value) => handleUpdateZone(zone.id, { minBrightness: value || 0 })}
          min={0}
          max={100}
          unit="%"
        />
        <NumberField
          label="Max Brightness"
          value={zone.maxBrightness}
          onChange={(value) => handleUpdateZone(zone.id, { maxBrightness: value || 100 })}
          min={0}
          max={100}
          unit="%"
        />
      </Space>

      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <NumberField
          label="Fixture Count"
          value={zone.fixtureCount}
          onChange={(value) => handleUpdateZone(zone.id, { fixtureCount: value || 1 })}
          min={1}
        />
        <NumberField
          label="Power Rating (W)"
          value={zone.powerRating}
          onChange={(value) => handleUpdateZone(zone.id, { powerRating: value || 10 })}
          min={1}
          unit="W"
        />
      </Space>

      <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 16 }}>
        <SwitchField
          label="Supports Dimming"
          checked={zone.supportsDimming}
          onChange={(supportsDimming) => handleUpdateZone(zone.id, { supportsDimming })}
        />
        <SwitchField
          label="Supports Color"
          checked={zone.supportsColor}
          onChange={(supportsColor) => handleUpdateZone(zone.id, { supportsColor })}
        />
        <SwitchField
          label="Enabled"
          checked={zone.enabled}
          onChange={(enabled) => handleUpdateZone(zone.id, { enabled })}
        />
      </Space>
    </Form>
  );

  return (
    <ConfigPanelLayout onCancel={onClose}>
      <ConfigSection title="Global Settings" Icon={BulbOutlined}>
        <Form layout="vertical">
          <LayoutSelector
            value={safeConfig.layout}
            onChange={(layout) => handleUpdateGlobalSettings({ layout: layout as 'list' | 'grid' | 'compact' })}
            options={['list', 'grid', 'compact']}
          />

          <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 16 }}>
            <SwitchField
              label="Show Energy Metrics"
              checked={safeConfig.showEnergyMetrics}
              onChange={(showEnergyMetrics) => handleUpdateGlobalSettings({ showEnergyMetrics })}
            />
            <SwitchField
              label="Show Schedules"
              checked={safeConfig.showSchedules}
              onChange={(showSchedules) => handleUpdateGlobalSettings({ showSchedules })}
            />
            <SwitchField
              label="Show Occupancy"
              checked={safeConfig.showOccupancy}
              onChange={(showOccupancy) => handleUpdateGlobalSettings({ showOccupancy })}
            />
          </Space>
        </Form>
      </ConfigSection>

      <ElementListManager
        elements={safeConfig.elements}
        onAdd={handleAddZone}
        onDelete={handleDeleteZone}
        renderElement={renderZoneForm}
        renderHeader={renderZoneHeader}
        renderHeaderBadges={renderZoneBadges}
        emptyText="No zones configured"
        addButtonText="Add Zone"
        title="Lighting Zones"
        titleIcon={<BulbOutlined className="config-section-title-icon" />}
        className="config-section"
      />
    </ConfigPanelLayout>
  );
}
