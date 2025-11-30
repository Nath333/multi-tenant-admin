/**
 * HVAC Control Widget Configuration Panel - ULTRA-REFACTORED VERSION
 * Uses reusable hooks and components for maximum code reduction.
 */

import { Form, Space } from 'antd';
import { CloudOutlined } from '@ant-design/icons';
import type { HVACControlWidgetConfig, HVACUnitConfig } from '../../types/ConfigurableWidget.types';

// Import reusable components
import {
  ConfigPanelLayout,
  ConfigSection,
  ElementListManager,
  ElementHeaderWithBadges,
  InfoTag,
  TextField,
  NumberField,
  SwitchField,
  SelectField,
  LayoutSelector,
  DataBindingForm,
  type SelectOption,
} from '../../base';

// Import reusable hooks
import { useElementManager } from '../../hooks';

interface HVACControlConfigPanelProps {
  config: HVACControlWidgetConfig;
  onChange: (newConfig: HVACControlWidgetConfig) => void;
  onClose: () => void;
}

const UNIT_TYPES: SelectOption[] = [
  { label: 'Split System', value: 'split' },
  { label: 'Central Air', value: 'central' },
  { label: 'Rooftop Unit', value: 'rooftop' },
  { label: 'VRF System', value: 'vrf' },
];

const HVAC_DEFAULTS: Partial<HVACControlWidgetConfig> = {
  showAirQuality: true,
  showEnergyUsage: true,
  showSchedules: true,
  showDiagnostics: false,
  layout: 'grid',
};

export default function HVACControlConfigPanel({ config, onChange, onClose }: HVACControlConfigPanelProps) {
  // Use element manager hook for all CRUD operations
  const { safeConfig, handleAdd, handleDelete, handleUpdate, handleUpdateGlobal } = useElementManager<
    HVACControlWidgetConfig,
    HVACUnitConfig
  >({
    config,
    onChange,
    defaults: HVAC_DEFAULTS,
    createNewElement: (elements) => ({
      id: `unit-${Date.now()}`,
      name: `HVAC Unit ${elements.length + 1}`,
      enabled: true,
      displayOrder: elements.length,
      type: 'hvac-unit',
      location: '',
      unitType: 'split',
      capacity: 24000,
      defaultTemp: 22,
      minTemp: 16,
      maxTemp: 30,
      supportsHeating: true,
      supportsCooling: true,
      supportsVentilation: true,
      supportsHumidity: false,
      modes: ['auto', 'cool', 'heat', 'fan'],
      fanSpeeds: ['low', 'medium', 'high', 'auto'],
    }),
  });

  // Render header with icon and type tag
  const renderUnitHeader = (unit: HVACUnitConfig) => (
    <ElementHeaderWithBadges
      element={unit}
      icon={<CloudOutlined />}
      extraTags={<InfoTag>{unit.unitType}</InfoTag>}
    />
  );

  // Render form for each unit element
  const renderUnitForm = (unit: HVACUnitConfig) => (
    <Form layout="vertical">
      <TextField
        label="Unit Name"
        value={unit.name}
        onChange={(name) => handleUpdate(unit.id, { name })}
        placeholder="e.g., Main Floor HVAC"
      />

      <TextField
        label="Location"
        value={unit.location}
        onChange={(location) => handleUpdate(unit.id, { location })}
        placeholder="e.g., Building A, Mechanical Room"
      />

      <SelectField
        label="Unit Type"
        value={unit.unitType}
        onChange={(unitType) => handleUpdate(unit.id, { unitType: unitType as HVACUnitConfig['unitType'] })}
        options={UNIT_TYPES}
      />

      <DataBindingForm
        value={unit.dataBinding}
        onChange={(binding) => handleUpdate(unit.id, { dataBinding: binding })}
        dataSourceTypes={['device-status', 'realtime-sensor']}
      />

      <NumberField
        label="Capacity (BTU/h)"
        value={unit.capacity}
        onChange={(value) => handleUpdate(unit.id, { capacity: value || 24000 })}
        min={1000}
        step={1000}
      />

      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <NumberField
          label="Default Temp"
          value={unit.defaultTemp}
          onChange={(value) => handleUpdate(unit.id, { defaultTemp: value || 22 })}
          min={unit.minTemp}
          max={unit.maxTemp}
          unit="°C"
        />
        <NumberField
          label="Min Temp"
          value={unit.minTemp}
          onChange={(value) => handleUpdate(unit.id, { minTemp: value || 16 })}
          min={10}
          max={30}
          unit="°C"
        />
        <NumberField
          label="Max Temp"
          value={unit.maxTemp}
          onChange={(value) => handleUpdate(unit.id, { maxTemp: value || 30 })}
          min={16}
          max={35}
          unit="°C"
        />
      </Space>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Capabilities</div>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <SwitchField
            label="Heating"
            checked={unit.supportsHeating}
            onChange={(supportsHeating) => handleUpdate(unit.id, { supportsHeating })}
          />
          <SwitchField
            label="Cooling"
            checked={unit.supportsCooling}
            onChange={(supportsCooling) => handleUpdate(unit.id, { supportsCooling })}
          />
          <SwitchField
            label="Ventilation"
            checked={unit.supportsVentilation}
            onChange={(supportsVentilation) => handleUpdate(unit.id, { supportsVentilation })}
          />
          <SwitchField
            label="Humidity"
            checked={unit.supportsHumidity}
            onChange={(supportsHumidity) => handleUpdate(unit.id, { supportsHumidity })}
          />
        </Space>
      </div>

      <SwitchField
        label="Enabled"
        checked={unit.enabled}
        onChange={(enabled) => handleUpdate(unit.id, { enabled })}
      />
    </Form>
  );

  return (
    <ConfigPanelLayout onCancel={onClose}>
      <ConfigSection title="Global Settings" Icon={CloudOutlined}>
        <Form layout="vertical">
          <LayoutSelector<'list' | 'grid' | 'zones'>
            value={safeConfig.layout}
            onChange={(layout) => handleUpdateGlobalSettings({ layout })}
            options={['list', 'grid', 'zones']}
          />

          <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap' }}>
            <SwitchField
              label="Show Air Quality"
              checked={safeConfig.showAirQuality}
              onChange={(showAirQuality) => handleUpdateGlobal({ showAirQuality })}
            />
            <SwitchField
              label="Show Energy Usage"
              checked={safeConfig.showEnergyUsage}
              onChange={(showEnergyUsage) => handleUpdateGlobal({ showEnergyUsage })}
            />
            <SwitchField
              label="Show Schedules"
              checked={safeConfig.showSchedules}
              onChange={(showSchedules) => handleUpdateGlobal({ showSchedules })}
            />
            <SwitchField
              label="Show Diagnostics"
              checked={safeConfig.showDiagnostics}
              onChange={(showDiagnostics) => handleUpdateGlobal({ showDiagnostics })}
            />
          </Space>
        </Form>
      </ConfigSection>

      <ElementListManager
        elements={safeConfig.elements}
        onAdd={handleAdd}
        onDelete={handleDelete}
        renderElement={renderUnitForm}
        renderHeader={renderUnitHeader}
        emptyText="No HVAC units configured"
        addButtonText="Add Unit"
        title="HVAC Units"
        titleIcon={<CloudOutlined className="config-section-title-icon" />}
        className="config-section"
      />
    </ConfigPanelLayout>
  );
}
