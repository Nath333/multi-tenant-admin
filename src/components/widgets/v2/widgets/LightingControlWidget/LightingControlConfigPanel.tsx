/**
 * Lighting Control Widget Configuration Panel - ULTRA-REFACTORED VERSION
 * Uses reusable hooks and components for maximum code reduction.
 */

import { Form, Space } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import type { LightingControlWidgetConfig, LightingZoneConfig } from '../../types/ConfigurableWidget.types';

// Import reusable components
import {
  ConfigPanelLayout,
  ConfigSection,
  ElementListManager,
  ElementHeaderWithBadges,
  TextField,
  NumberField,
  SwitchField,
  LayoutSelector,
  DataBindingForm,
} from '../../base';

// Import reusable hooks
import { useElementManager } from '../../hooks';

interface LightingControlConfigPanelProps {
  config: LightingControlWidgetConfig;
  onChange: (newConfig: LightingControlWidgetConfig) => void;
  onClose: () => void;
}

const LIGHTING_DEFAULTS: Partial<LightingControlWidgetConfig> = {
  showEnergyMetrics: true,
  showSchedules: true,
  showOccupancy: true,
  layout: 'grid',
};

export default function LightingControlConfigPanel({ config, onChange, onClose }: LightingControlConfigPanelProps) {
  // Use element manager hook for all CRUD operations
  const { safeConfig, handleAdd, handleDelete, handleUpdate, handleUpdateGlobal } = useElementManager<
    LightingControlWidgetConfig,
    LightingZoneConfig
  >({
    config,
    onChange,
    defaults: LIGHTING_DEFAULTS,
    createNewElement: (elements) => ({
      id: `zone-${Date.now()}`,
      name: `Zone ${elements.length + 1}`,
      enabled: true,
      displayOrder: elements.length,
      type: 'lighting-zone',
      location: '',
      defaultBrightness: 80,
      minBrightness: 0,
      maxBrightness: 100,
      supportsDimming: true,
      supportsColor: false,
      fixtureCount: 1,
      powerRating: 10,
    }),
  });

  // Render header with icon
  const renderZoneHeader = (zone: LightingZoneConfig) => (
    <ElementHeaderWithBadges element={zone} icon={<BulbOutlined />} />
  );

  // Render form for each zone element
  const renderZoneForm = (zone: LightingZoneConfig) => (
    <Form layout="vertical">
      <TextField
        label="Zone Name"
        value={zone.name}
        onChange={(name) => handleUpdate(zone.id, { name })}
        placeholder="e.g., Conference Room"
      />

      <TextField
        label="Location"
        value={zone.location}
        onChange={(location) => handleUpdate(zone.id, { location })}
        placeholder="e.g., Building A, Floor 2"
      />

      <DataBindingForm
        value={zone.dataBinding}
        onChange={(binding) => handleUpdate(zone.id, { dataBinding: binding })}
        dataSourceTypes={['device-status', 'realtime-sensor']}
      />

      <NumberField
        label="Default Brightness"
        value={zone.defaultBrightness}
        onChange={(value) => handleUpdate(zone.id, { defaultBrightness: value || 80 })}
        min={zone.minBrightness}
        max={zone.maxBrightness}
        unit="%"
      />

      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <NumberField
          label="Min Brightness"
          value={zone.minBrightness}
          onChange={(value) => handleUpdate(zone.id, { minBrightness: value || 0 })}
          min={0}
          max={100}
          unit="%"
        />
        <NumberField
          label="Max Brightness"
          value={zone.maxBrightness}
          onChange={(value) => handleUpdate(zone.id, { maxBrightness: value || 100 })}
          min={0}
          max={100}
          unit="%"
        />
      </Space>

      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <NumberField
          label="Fixture Count"
          value={zone.fixtureCount}
          onChange={(value) => handleUpdate(zone.id, { fixtureCount: value || 1 })}
          min={1}
        />
        <NumberField
          label="Power Rating (W)"
          value={zone.powerRating}
          onChange={(value) => handleUpdate(zone.id, { powerRating: value || 10 })}
          min={1}
          unit="W"
        />
      </Space>

      <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 16 }}>
        <SwitchField
          label="Supports Dimming"
          checked={zone.supportsDimming}
          onChange={(supportsDimming) => handleUpdate(zone.id, { supportsDimming })}
        />
        <SwitchField
          label="Supports Color"
          checked={zone.supportsColor}
          onChange={(supportsColor) => handleUpdate(zone.id, { supportsColor })}
        />
        <SwitchField
          label="Enabled"
          checked={zone.enabled}
          onChange={(enabled) => handleUpdate(zone.id, { enabled })}
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
            onChange={(layout) => handleUpdateGlobal({ layout: layout as 'list' | 'grid' | 'compact' })}
            options={['list', 'grid', 'compact']}
          />

          <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 16 }}>
            <SwitchField
              label="Show Energy Metrics"
              checked={safeConfig.showEnergyMetrics}
              onChange={(showEnergyMetrics) => handleUpdateGlobal({ showEnergyMetrics })}
            />
            <SwitchField
              label="Show Schedules"
              checked={safeConfig.showSchedules}
              onChange={(showSchedules) => handleUpdateGlobal({ showSchedules })}
            />
            <SwitchField
              label="Show Occupancy"
              checked={safeConfig.showOccupancy}
              onChange={(showOccupancy) => handleUpdateGlobal({ showOccupancy })}
            />
          </Space>
        </Form>
      </ConfigSection>

      <ElementListManager
        elements={safeConfig.elements}
        onAdd={handleAdd}
        onDelete={handleDelete}
        renderElement={renderZoneForm}
        renderHeader={renderZoneHeader}
        emptyText="No zones configured"
        addButtonText="Add Zone"
        title="Lighting Zones"
        titleIcon={<BulbOutlined className="config-section-title-icon" />}
        className="config-section"
      />
    </ConfigPanelLayout>
  );
}
