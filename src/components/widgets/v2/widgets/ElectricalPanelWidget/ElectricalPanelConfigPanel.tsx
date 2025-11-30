/**
 * Electrical Panel Widget Configuration Panel - ULTRA-REFACTORED VERSION
 * Uses reusable hooks and components including NestedTableEditor for circuits.
 */

import { Form, Space } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import type { ElectricalPanelWidgetConfig, ElectricalPanelConfig, CircuitConfig } from '../../types/ConfigurableWidget.types';

// Import reusable components
import {
  ConfigPanelLayout,
  ConfigSection,
  ElementListManager,
  ElementHeaderWithBadges,
  InfoTag,
  CountTag,
  TextField,
  NumberField,
  SwitchField,
  SelectField,
  LayoutSelector,
  DataBindingForm,
  NestedTableEditor,
  textColumn,
  numberColumn,
  switchColumn,
  selectColumn,
  type ColumnDefinition,
} from '../../base';

// Import reusable hooks
import { useElementManager, useNestedElementManager } from '../../hooks';

interface ElectricalPanelConfigPanelProps {
  config: ElectricalPanelWidgetConfig;
  onChange: (newConfig: ElectricalPanelWidgetConfig) => void;
  onClose: () => void;
}

const PHASE_OPTIONS = [
  { label: 'Phase A', value: 'A' },
  { label: 'Phase B', value: 'B' },
  { label: 'Phase C', value: 'C' },
  { label: '3-Phase', value: '3-phase' },
];

// Column definitions for the circuits table editor
const CIRCUIT_COLUMNS: ColumnDefinition<CircuitConfig>[] = [
  textColumn('name', 'Name'),
  numberColumn('breakerSize', 'Breaker (A)', { width: 100 }),
  selectColumn('phase', 'Phase', PHASE_OPTIONS, { width: 100 }),
  switchColumn('critical', 'Critical', { width: 70 }),
];

const ELECTRICAL_DEFAULTS: Partial<ElectricalPanelWidgetConfig> = {
  showPowerQuality: true,
  showAlerts: true,
  showEnergyMetrics: true,
  layout: 'multi',
};

export default function ElectricalPanelConfigPanel({ config, onChange, onClose }: ElectricalPanelConfigPanelProps) {
  // Use element manager hook for panel CRUD operations
  const { safeConfig, handleAdd, handleDelete, handleUpdate, handleUpdateGlobal } = useElementManager<
    ElectricalPanelWidgetConfig,
    ElectricalPanelConfig
  >({
    config,
    onChange,
    defaults: ELECTRICAL_DEFAULTS,
    createNewElement: (elements) => ({
      id: `panel-${Date.now()}`,
      name: `Panel ${elements.length + 1}`,
      enabled: true,
      displayOrder: elements.length,
      type: 'electrical-panel',
      location: '',
      totalCapacity: 200,
      voltage: 120,
      phases: 1,
      circuits: [
        { id: 'c1', name: 'Main', breakerSize: 20, voltage: 120, phase: 'A', enabled: true, critical: false },
      ],
      showPowerFactor: true,
      showFrequency: false,
      showHarmonics: false,
    }),
  });

  // Use nested element manager for circuit operations
  const { handleAddNested, handleDeleteNested, handleUpdateNested } = useNestedElementManager<
    ElectricalPanelWidgetConfig,
    ElectricalPanelConfig,
    CircuitConfig
  >({
    config: safeConfig,
    onChange,
    nestedKey: 'circuits',
    createNewNestedElement: (panel) => ({
      id: `c${Date.now()}`,
      name: `Circuit ${panel.circuits.length + 1}`,
      breakerSize: 20,
      voltage: panel.voltage,
      phase: 'A',
      enabled: true,
      critical: false,
    }),
  });

  // Render header with icon, capacity, and circuit count
  const renderPanelHeader = (panel: ElectricalPanelConfig) => (
    <ElementHeaderWithBadges
      element={panel}
      icon={<ThunderboltOutlined />}
      extraTags={
        <>
          <InfoTag>{panel.totalCapacity}A</InfoTag>
          <CountTag count={panel.circuits.length} label="circuits" />
        </>
      }
    />
  );

  // Render form for each panel element
  const renderPanelForm = (panel: ElectricalPanelConfig) => (
    <Form layout="vertical">
      <TextField
        label="Panel Name"
        value={panel.name}
        onChange={(name) => handleUpdate(panel.id, { name })}
        placeholder="e.g., Main Distribution Panel"
      />

      <TextField
        label="Location"
        value={panel.location}
        onChange={(location) => handleUpdate(panel.id, { location })}
        placeholder="e.g., Electrical Room, Floor 1"
      />

      <DataBindingForm
        value={panel.dataBinding}
        onChange={(binding) => handleUpdate(panel.id, { dataBinding: binding })}
        dataSourceTypes={['device-status', 'realtime-sensor']}
      />

      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <NumberField
          label="Total Capacity (A)"
          value={panel.totalCapacity}
          onChange={(value) => handleUpdate(panel.id, { totalCapacity: value || 200 })}
          min={50}
          max={2000}
          step={50}
        />
        <NumberField
          label="Voltage (V)"
          value={panel.voltage}
          onChange={(value) => handleUpdate(panel.id, { voltage: value || 120 })}
          min={120}
          max={480}
          step={120}
        />
        <SelectField
          label="Phases"
          value={panel.phases}
          onChange={(value) => handleUpdate(panel.id, { phases: value as 1 | 3 })}
          options={[
            { label: 'Single Phase (1)', value: 1 },
            { label: 'Three Phase (3)', value: 3 },
          ]}
        />
      </Space>

      {/* Circuits Configuration using NestedTableEditor */}
      <NestedTableEditor<CircuitConfig>
        title="Circuits"
        items={panel.circuits}
        columns={CIRCUIT_COLUMNS}
        onAdd={() => handleAddNested(panel.id)}
        onUpdate={(circuitId, updates) => handleUpdateNested(panel.id, circuitId, updates)}
        onDelete={(circuitId) => handleDeleteNested(panel.id, circuitId)}
        addButtonText="Add Circuit"
        deleteConfirmText="Delete circuit?"
      />

      <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 16 }}>
        <SwitchField
          label="Show Power Factor"
          checked={panel.showPowerFactor}
          onChange={(showPowerFactor) => handleUpdate(panel.id, { showPowerFactor })}
        />
        <SwitchField
          label="Show Frequency"
          checked={panel.showFrequency}
          onChange={(showFrequency) => handleUpdate(panel.id, { showFrequency })}
        />
        <SwitchField
          label="Show Harmonics"
          checked={panel.showHarmonics}
          onChange={(showHarmonics) => handleUpdate(panel.id, { showHarmonics })}
        />
        <SwitchField
          label="Enabled"
          checked={panel.enabled}
          onChange={(enabled) => handleUpdate(panel.id, { enabled })}
        />
      </Space>
    </Form>
  );

  return (
    <ConfigPanelLayout onCancel={onClose}>
      <ConfigSection title="Global Settings" Icon={ThunderboltOutlined}>
        <Form layout="vertical">
          <LayoutSelector
            value={safeConfig.layout}
            onChange={(layout) => handleUpdateGlobal({ layout: layout as 'single' | 'multi' })}
            options={['list', 'grid']}
          />

          <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 16 }}>
            <SwitchField
              label="Show Power Quality"
              checked={safeConfig.showPowerQuality}
              onChange={(showPowerQuality) => handleUpdateGlobal({ showPowerQuality })}
            />
            <SwitchField
              label="Show Alerts"
              checked={safeConfig.showAlerts}
              onChange={(showAlerts) => handleUpdateGlobal({ showAlerts })}
            />
            <SwitchField
              label="Show Energy Metrics"
              checked={safeConfig.showEnergyMetrics}
              onChange={(showEnergyMetrics) => handleUpdateGlobal({ showEnergyMetrics })}
            />
          </Space>
        </Form>
      </ConfigSection>

      <ElementListManager
        elements={safeConfig.elements}
        onAdd={handleAdd}
        onDelete={handleDelete}
        renderElement={renderPanelForm}
        renderHeader={renderPanelHeader}
        emptyText="No electrical panels configured"
        addButtonText="Add Panel"
        title="Electrical Panels"
        titleIcon={<ThunderboltOutlined className="config-section-title-icon" />}
        className="config-section"
      />
    </ConfigPanelLayout>
  );
}
