/**
 * Electrical Panel Widget Configuration Panel - REFACTORED VERSION
 * Now uses reusable components while maintaining circuit table functionality
 */

import { Form, Space, Tag, Button, Table, Switch, Input, Select, Popconfirm } from 'antd';
import { ThunderboltOutlined, LinkOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ElectricalPanelWidgetConfig, ElectricalPanelConfig, CircuitConfig } from '../../types/ConfigurableWidget.types';

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

interface ElectricalPanelConfigPanelProps {
  config: ElectricalPanelWidgetConfig;
  onChange: (newConfig: ElectricalPanelWidgetConfig) => void;
  onClose: () => void;
}

const PHASE_OPTIONS: SelectOption[] = [
  { label: 'Phase A', value: 'A' },
  { label: 'Phase B', value: 'B' },
  { label: 'Phase C', value: 'C' },
  { label: '3-Phase', value: '3-phase' },
];

export default function ElectricalPanelConfigPanel({ config, onChange, onClose }: ElectricalPanelConfigPanelProps) {
  const safeConfig: ElectricalPanelWidgetConfig = {
    elements: config?.elements || [],
    showPowerQuality: config?.showPowerQuality ?? true,
    showAlerts: config?.showAlerts ?? true,
    showEnergyMetrics: config?.showEnergyMetrics ?? true,
    layout: config?.layout || 'multi',
  };

  const handleAddPanel = () => {
    const newPanel: ElectricalPanelConfig = {
      id: `panel-${Date.now()}`,
      name: `Panel ${safeConfig.elements.length + 1}`,
      enabled: true,
      displayOrder: safeConfig.elements.length,
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
    };
    onChange({ ...safeConfig, elements: [...safeConfig.elements, newPanel] });
  };

  const handleDeletePanel = (panelId: string) => {
    onChange({ ...safeConfig, elements: safeConfig.elements.filter(e => e.id !== panelId) });
  };

  const handleUpdatePanel = (panelId: string, updates: Partial<ElectricalPanelConfig>) => {
    onChange({
      ...safeConfig,
      elements: safeConfig.elements.map(e => e.id === panelId ? { ...e, ...updates } : e),
    });
  };

  const handleUpdateGlobalSettings = (updates: Partial<ElectricalPanelWidgetConfig>) => {
    onChange({ ...safeConfig, ...updates });
  };

  const handleAddCircuit = (panelId: string) => {
    const panel = safeConfig.elements.find(e => e.id === panelId);
    if (!panel) return;
    const newCircuit: CircuitConfig = {
      id: `c${Date.now()}`,
      name: `Circuit ${panel.circuits.length + 1}`,
      breakerSize: 20,
      voltage: panel.voltage,
      phase: 'A',
      enabled: true,
      critical: false,
    };
    handleUpdatePanel(panelId, { circuits: [...panel.circuits, newCircuit] });
  };

  const handleUpdateCircuit = (panelId: string, circuitId: string, updates: Partial<CircuitConfig>) => {
    const panel = safeConfig.elements.find(e => e.id === panelId);
    if (!panel) return;
    handleUpdatePanel(panelId, {
      circuits: panel.circuits.map(c => c.id === circuitId ? { ...c, ...updates } : c),
    });
  };

  const handleDeleteCircuit = (panelId: string, circuitId: string) => {
    const panel = safeConfig.elements.find(e => e.id === panelId);
    if (!panel) return;
    handleUpdatePanel(panelId, { circuits: panel.circuits.filter(c => c.id !== circuitId) });
  };

  const renderPanelHeader = (panel: ElectricalPanelConfig) => (
    <>
      <ThunderboltOutlined />
      <span style={{ fontWeight: 500 }}>{panel.name}</span>
      <Tag color="blue">{panel.totalCapacity}A</Tag>
      <Tag color="purple">{panel.circuits.length} circuits</Tag>
    </>
  );

  const renderPanelBadges = (panel: ElectricalPanelConfig) => (
    <>
      {!panel.enabled && <Tag color="red">Disabled</Tag>}
      {panel.dataBinding && <Tag color="green" icon={<LinkOutlined />}>Bound</Tag>}
    </>
  );

  const renderPanelForm = (panel: ElectricalPanelConfig) => (
    <Form layout="vertical">
      <TextField
        label="Panel Name"
        value={panel.name}
        onChange={(name) => handleUpdatePanel(panel.id, { name })}
        placeholder="e.g., Main Distribution Panel"
      />

      <TextField
        label="Location"
        value={panel.location}
        onChange={(location) => handleUpdatePanel(panel.id, { location })}
        placeholder="e.g., Electrical Room, Floor 1"
      />

      <DataBindingForm
        value={panel.dataBinding}
        onChange={(binding) => handleUpdatePanel(panel.id, { dataBinding: binding })}
        dataSourceTypes={['device-status', 'realtime-sensor']}
      />

      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <NumberField
          label="Total Capacity (A)"
          value={panel.totalCapacity}
          onChange={(value) => handleUpdatePanel(panel.id, { totalCapacity: value || 200 })}
          min={50}
          max={2000}
          step={50}
        />
        <NumberField
          label="Voltage (V)"
          value={panel.voltage}
          onChange={(value) => handleUpdatePanel(panel.id, { voltage: value || 120 })}
          min={120}
          max={480}
          step={120}
        />
        <SelectField
          label="Phases"
          value={panel.phases}
          onChange={(value) => handleUpdatePanel(panel.id, { phases: value as 1 | 3 })}
          options={[
            { label: 'Single Phase (1)', value: 1 },
            { label: 'Three Phase (3)', value: 3 },
          ]}
        />
      </Space>

      {/* Circuits Table */}
      <div style={{ marginTop: 24 }}>
        <div style={{ marginBottom: 12, fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
          <span>Circuits ({panel.circuits.length})</span>
          <Button size="small" icon={<PlusOutlined />} onClick={() => handleAddCircuit(panel.id)}>
            Add Circuit
          </Button>
        </div>

        <Table
          dataSource={panel.circuits}
          rowKey="id"
          pagination={false}
          size="small"
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              render: (text, record) => (
                <Input
                  value={text}
                  size="small"
                  onChange={(e) => handleUpdateCircuit(panel.id, record.id, { name: e.target.value })}
                />
              ),
            },
            {
              title: 'Breaker (A)',
              dataIndex: 'breakerSize',
              width: 100,
              render: (value, record) => (
                <Input
                  type="number"
                  value={value}
                  size="small"
                  onChange={(e) => handleUpdateCircuit(panel.id, record.id, { breakerSize: Number(e.target.value) })}
                />
              ),
            },
            {
              title: 'Phase',
              dataIndex: 'phase',
              width: 100,
              render: (value, record) => (
                <Select
                  value={value}
                  size="small"
                  style={{ width: '100%' }}
                  onChange={(phase) => handleUpdateCircuit(panel.id, record.id, { phase: phase as any })}
                >
                  {PHASE_OPTIONS.map(opt => (
                    <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
                  ))}
                </Select>
              ),
            },
            {
              title: 'Critical',
              dataIndex: 'critical',
              width: 70,
              render: (checked, record) => (
                <Switch
                  size="small"
                  checked={checked}
                  onChange={(critical) => handleUpdateCircuit(panel.id, record.id, { critical })}
                />
              ),
            },
            {
              title: 'Action',
              width: 60,
              render: (_, record) => (
                <Popconfirm
                  title="Delete circuit?"
                  onConfirm={() => handleDeleteCircuit(panel.id, record.id)}
                >
                  <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                </Popconfirm>
              ),
            },
          ]}
        />
      </div>

      <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 16 }}>
        <SwitchField
          label="Show Power Factor"
          checked={panel.showPowerFactor}
          onChange={(showPowerFactor) => handleUpdatePanel(panel.id, { showPowerFactor })}
        />
        <SwitchField
          label="Show Frequency"
          checked={panel.showFrequency}
          onChange={(showFrequency) => handleUpdatePanel(panel.id, { showFrequency })}
        />
        <SwitchField
          label="Show Harmonics"
          checked={panel.showHarmonics}
          onChange={(showHarmonics) => handleUpdatePanel(panel.id, { showHarmonics })}
        />
        <SwitchField
          label="Enabled"
          checked={panel.enabled}
          onChange={(enabled) => handleUpdatePanel(panel.id, { enabled })}
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
            onChange={(layout) => handleUpdateGlobalSettings({ layout: layout as 'single' | 'multi' })}
            options={['list', 'grid']}
          />

          <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 16 }}>
            <SwitchField
              label="Show Power Quality"
              checked={safeConfig.showPowerQuality}
              onChange={(showPowerQuality) => handleUpdateGlobalSettings({ showPowerQuality })}
            />
            <SwitchField
              label="Show Alerts"
              checked={safeConfig.showAlerts}
              onChange={(showAlerts) => handleUpdateGlobalSettings({ showAlerts })}
            />
            <SwitchField
              label="Show Energy Metrics"
              checked={safeConfig.showEnergyMetrics}
              onChange={(showEnergyMetrics) => handleUpdateGlobalSettings({ showEnergyMetrics })}
            />
          </Space>
        </Form>
      </ConfigSection>

      <ElementListManager
        elements={safeConfig.elements}
        onAdd={handleAddPanel}
        onDelete={handleDeletePanel}
        renderElement={renderPanelForm}
        renderHeader={renderPanelHeader}
        renderHeaderBadges={renderPanelBadges}
        emptyText="No electrical panels configured"
        addButtonText="Add Panel"
        title="Electrical Panels"
        titleIcon={<ThunderboltOutlined className="config-section-title-icon" />}
        className="config-section"
      />
    </ConfigPanelLayout>
  );
}
