/**
 * HVAC Control Widget Configuration Panel - REFACTORED VERSION
 * Now uses reusable components for cleaner, more maintainable code
 */

import { Form, Space, Tag } from 'antd';
import { CloudOutlined, LinkOutlined } from '@ant-design/icons';
import type { HVACControlWidgetConfig, HVACUnitConfig } from '../../types/ConfigurableWidget.types';

// Import reusable components
import {
  ConfigPanelLayout,
  ConfigSection,
  ElementListManager,
  TextField,
  NumberField,
  SwitchField,
  SelectField,
  LayoutSelector,
  DataBindingForm,
  type SelectOption,
} from '../../base';

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

export default function HVACControlConfigPanel({ config, onChange, onClose }: HVACControlConfigPanelProps) {
  const safeConfig: HVACControlWidgetConfig = {
    elements: config?.elements || [],
    showAirQuality: config?.showAirQuality ?? true,
    showEnergyUsage: config?.showEnergyUsage ?? true,
    showSchedules: config?.showSchedules ?? true,
    showDiagnostics: config?.showDiagnostics ?? false,
    layout: config?.layout || 'grid',
  };

  const handleAddUnit = () => {
    const newUnit: HVACUnitConfig = {
      id: `unit-${Date.now()}`,
      name: `HVAC Unit ${safeConfig.elements.length + 1}`,
      enabled: true,
      displayOrder: safeConfig.elements.length,
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
    };
    onChange({ ...safeConfig, elements: [...safeConfig.elements, newUnit] });
  };

  const handleDeleteUnit = (unitId: string) => {
    onChange({ ...safeConfig, elements: safeConfig.elements.filter(e => e.id !== unitId) });
  };

  const handleUpdateUnit = (unitId: string, updates: Partial<HVACUnitConfig>) => {
    onChange({
      ...safeConfig,
      elements: safeConfig.elements.map(e => e.id === unitId ? { ...e, ...updates } : e),
    });
  };

  const handleUpdateGlobalSettings = (updates: Partial<HVACControlWidgetConfig>) => {
    onChange({ ...safeConfig, ...updates });
  };

  const renderUnitHeader = (unit: HVACUnitConfig) => (
    <>
      <CloudOutlined />
      <span style={{ fontWeight: 500 }}>{unit.name}</span>
      <Tag color="blue">{unit.unitType}</Tag>
    </>
  );

  const renderUnitBadges = (unit: HVACUnitConfig) => (
    <>
      {!unit.enabled && <Tag color="red">Disabled</Tag>}
      {unit.dataBinding && <Tag color="green" icon={<LinkOutlined />}>Bound</Tag>}
    </>
  );

  const renderUnitForm = (unit: HVACUnitConfig) => (
    <Form layout="vertical">
      <TextField
        label="Unit Name"
        value={unit.name}
        onChange={(name) => handleUpdateUnit(unit.id, { name })}
        placeholder="e.g., Main Floor HVAC"
      />

      <TextField
        label="Location"
        value={unit.location}
        onChange={(location) => handleUpdateUnit(unit.id, { location })}
        placeholder="e.g., Building A, Mechanical Room"
      />

      <SelectField
        label="Unit Type"
        value={unit.unitType}
        onChange={(unitType) => handleUpdateUnit(unit.id, { unitType: unitType as any })}
        options={UNIT_TYPES}
      />

      <DataBindingForm
        value={unit.dataBinding}
        onChange={(binding) => handleUpdateUnit(unit.id, { dataBinding: binding })}
        dataSourceTypes={['device-status', 'realtime-sensor']}
      />

      <NumberField
        label="Capacity (BTU/h)"
        value={unit.capacity}
        onChange={(value) => handleUpdateUnit(unit.id, { capacity: value || 24000 })}
        min={1000}
        step={1000}
      />

      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <NumberField
          label="Default Temp"
          value={unit.defaultTemp}
          onChange={(value) => handleUpdateUnit(unit.id, { defaultTemp: value || 22 })}
          min={unit.minTemp}
          max={unit.maxTemp}
          unit="°C"
        />
        <NumberField
          label="Min Temp"
          value={unit.minTemp}
          onChange={(value) => handleUpdateUnit(unit.id, { minTemp: value || 16 })}
          min={10}
          max={30}
          unit="°C"
        />
        <NumberField
          label="Max Temp"
          value={unit.maxTemp}
          onChange={(value) => handleUpdateUnit(unit.id, { maxTemp: value || 30 })}
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
            onChange={(supportsHeating) => handleUpdateUnit(unit.id, { supportsHeating })}
          />
          <SwitchField
            label="Cooling"
            checked={unit.supportsCooling}
            onChange={(supportsCooling) => handleUpdateUnit(unit.id, { supportsCooling })}
          />
          <SwitchField
            label="Ventilation"
            checked={unit.supportsVentilation}
            onChange={(supportsVentilation) => handleUpdateUnit(unit.id, { supportsVentilation })}
          />
          <SwitchField
            label="Humidity"
            checked={unit.supportsHumidity}
            onChange={(supportsHumidity) => handleUpdateUnit(unit.id, { supportsHumidity })}
          />
        </Space>
      </div>

      <SwitchField
        label="Enabled"
        checked={unit.enabled}
        onChange={(enabled) => handleUpdateUnit(unit.id, { enabled })}
      />
    </Form>
  );

  return (
    <ConfigPanelLayout onCancel={onClose}>
      <ConfigSection title="Global Settings" Icon={CloudOutlined}>
        <Form layout="vertical">
          <LayoutSelector
            value={safeConfig.layout}
            onChange={(layout) => handleUpdateGlobalSettings({ layout: layout as 'list' | 'grid' | 'zones' })}
            options={['list', 'grid', 'zones']}
          />

          <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap' }}>
            <SwitchField
              label="Show Air Quality"
              checked={safeConfig.showAirQuality}
              onChange={(showAirQuality) => handleUpdateGlobalSettings({ showAirQuality })}
            />
            <SwitchField
              label="Show Energy Usage"
              checked={safeConfig.showEnergyUsage}
              onChange={(showEnergyUsage) => handleUpdateGlobalSettings({ showEnergyUsage })}
            />
            <SwitchField
              label="Show Schedules"
              checked={safeConfig.showSchedules}
              onChange={(showSchedules) => handleUpdateGlobalSettings({ showSchedules })}
            />
            <SwitchField
              label="Show Diagnostics"
              checked={safeConfig.showDiagnostics}
              onChange={(showDiagnostics) => handleUpdateGlobalSettings({ showDiagnostics })}
            />
          </Space>
        </Form>
      </ConfigSection>

      <ElementListManager
        elements={safeConfig.elements}
        onAdd={handleAddUnit}
        onDelete={handleDeleteUnit}
        renderElement={renderUnitForm}
        renderHeader={renderUnitHeader}
        renderHeaderBadges={renderUnitBadges}
        emptyText="No HVAC units configured"
        addButtonText="Add Unit"
        title="HVAC Units"
        titleIcon={<CloudOutlined className="config-section-title-icon" />}
        className="config-section"
      />
    </ConfigPanelLayout>
  );
}
