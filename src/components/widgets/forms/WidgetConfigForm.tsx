import type { ReactElement } from 'react';
import { Form, InputNumber, Switch, Select, Input, Button, Divider, Card, Typography } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

// ============================================================================
// Types
// ============================================================================

interface WidgetConfigFormProps {
  widgetType: string;
  config?: any;
}

type ConfigFormComponent = () => ReactElement;

// ============================================================================
// Widget Type Registry
// ============================================================================

const WIDGET_CONFIG_REGISTRY: Record<string, ConfigFormComponent> = {
  'chart': ChartWidgetConfigForm,
  'chart-v2': ChartWidgetConfigForm,
  'lighting-control': LightingControlWidgetConfigForm,
  'lighting-control-v2': LightingControlWidgetConfigForm,
  'hvac-control': HVACControlWidgetConfigForm,
  'hvac-control-v2': HVACControlWidgetConfigForm,
  'advanced-lighting': AdvancedLightingWidgetConfigForm,
  'electrical-panel': ElectricalPanelWidgetConfigForm,
  'electrical-panel-v2': ElectricalPanelWidgetConfigForm,
  'data-table-v2': GenericWidgetConfigForm, // Add data table support
  'water-management': WaterManagementWidgetConfigForm,
  'fire-safety': FireSafetyWidgetConfigForm,
  'security-control': SecurityControlWidgetConfigForm,
  'energy-control': EnergyControlWidgetConfigForm,
  'climate-control': ClimateControlWidgetConfigForm,
  'stats': StatsWidgetConfigForm,
  'analytics': AnalyticsWidgetConfigForm,
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * Dynamic widget configuration form that renders different fields based on widget type
 */
export default function WidgetConfigForm({ widgetType }: WidgetConfigFormProps) {
  const ConfigForm = WIDGET_CONFIG_REGISTRY[widgetType] || GenericWidgetConfigForm;
  return <ConfigForm />;
}

// ============================================================================
// Reusable Form Field Components
// ============================================================================

interface FormFieldProps {
  label: string;
  name: string[];
  initialValue?: any;
  placeholder?: string;
}

const ConfigInput = ({ label, name, placeholder }: FormFieldProps) => (
  <Form.Item label={label} name={name}>
    <Input placeholder={placeholder} />
  </Form.Item>
);

const ConfigSwitch = ({ label, name, initialValue = true }: FormFieldProps) => (
  <Form.Item
    label={label}
    name={name}
    valuePropName="checked"
    initialValue={initialValue}
  >
    <Switch />
  </Form.Item>
);

const ConfigSelect = ({ label, name, initialValue, children }: FormFieldProps & { children: React.ReactNode }) => (
  <Form.Item label={label} name={name} initialValue={initialValue}>
    <Select>{children}</Select>
  </Form.Item>
);

const ConfigNumber = ({
  label,
  name,
  initialValue,
  min,
  max
}: FormFieldProps & { min?: number; max?: number }) => (
  <Form.Item label={label} name={name} initialValue={initialValue}>
    <InputNumber min={min} max={max} style={{ width: '100%' }} />
  </Form.Item>
);

const ConfigSection = ({ title }: { title: string }) => (
  <Divider titlePlacement="left">{title}</Divider>
);

// ============================================================================
// Chart Widget Configuration
// ============================================================================
function ChartWidgetConfigForm() {
  return (
    <>
      <ConfigSection title="Chart Configuration" />

      <ConfigSelect
        label="Chart Type"
        name={['config', 'chartType']}
        initialValue="line"
      >
        <Select.Option value="line">Line Chart</Select.Option>
        <Select.Option value="bar">Bar Chart</Select.Option>
        <Select.Option value="area">Area Chart</Select.Option>
        <Select.Option value="composed">Composed Chart</Select.Option>
      </ConfigSelect>

      <ConfigSelect
        label="Time Range"
        name={['config', 'timeRange']}
        initialValue="7d"
      >
        <Select.Option value="7d">Last 7 days</Select.Option>
        <Select.Option value="14d">Last 14 days</Select.Option>
        <Select.Option value="30d">Last 30 days</Select.Option>
        <Select.Option value="90d">Last 90 days</Select.Option>
      </ConfigSelect>

      <ConfigSwitch label="Show Legend" name={['config', 'showLegend']} />
      <ConfigSwitch label="Show Grid" name={['config', 'showGrid']} />

      <ConfigInput
        label="Y-Axis Label"
        name={['config', 'yAxisLabel']}
        placeholder="e.g., Value"
      />

      <ConfigInput
        label="X-Axis Label"
        name={['config', 'xAxisLabel']}
        placeholder="e.g., Date"
      />
    </>
  );
}

// ============================================================================
// Lighting Control Widget Configuration
// ============================================================================
function LightingControlWidgetConfigForm() {
  return (
    <>
      <ConfigSection title="Lighting Control Configuration" />

      <ConfigInput
        label="Zone Name"
        name={['config', 'zoneName']}
        placeholder="e.g., Main Lights"
      />

      <ConfigInput
        label="Location"
        name={['config', 'location']}
        placeholder="e.g., Living Room"
      />

      <ConfigNumber
        label="Default Brightness (%)"
        name={['config', 'defaultBrightness']}
        initialValue={70}
        min={0}
        max={100}
      />

      <ConfigSwitch label="Show Quick Actions" name={['config', 'showQuickActions']} />
      <ConfigSwitch label="Show Schedule" name={['config', 'showSchedule']} />
      <ConfigSwitch label="Show Energy Usage" name={['config', 'showEnergyUsage']} />

      <Divider titlePlacement="left">Lighting Zones</Divider>
      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 16 }}>
        Configure individual lighting zones. Each zone can be controlled independently.
      </Text>

      <Form.List name={['config', 'zones']}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card
                key={key}
                size="small"
                style={{ marginBottom: 16, background: '#fafafa' }}
                extra={
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                  >
                    Remove
                  </Button>
                }
              >
                <Form.Item
                  {...restField}
                  label="Zone Name"
                  name={[name, 'name']}
                  rules={[{ required: true, message: 'Zone name is required' }]}
                >
                  <Input placeholder="e.g., Living Room" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Initial Status"
                  name={[name, 'status']}
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Switch checkedChildren="ON" unCheckedChildren="OFF" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Initial Brightness (%)"
                  name={[name, 'brightness']}
                  initialValue={70}
                >
                  <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Light Color"
                  name={[name, 'color']}
                  initialValue="#ffffff"
                >
                  <Input type="color" style={{ width: 80 }} />
                </Form.Item>
              </Card>
            ))}
            <Button
              type="dashed"
              onClick={() => add({
                id: `zone-${Date.now()}`,
                name: 'New Zone',
                status: false,
                brightness: 70,
                color: '#ffffff'
              })}
              block
              icon={<PlusOutlined />}
            >
              Add Lighting Zone
            </Button>
          </>
        )}
      </Form.List>
    </>
  );
}

// ============================================================================
// HVAC Control Widget Configuration
// ============================================================================
function HVACControlWidgetConfigForm() {
  return (
    <>
      <ConfigSection title="HVAC Configuration" />

      <ConfigInput
        label="Room Name"
        name={['config', 'roomName']}
        placeholder="e.g., Master Bedroom"
      />

      <ConfigInput
        label="Location"
        name={['config', 'location']}
        placeholder="e.g., 2nd Floor"
      />

      <ConfigSelect
        label="Default Mode"
        name={['config', 'defaultMode']}
        initialValue="auto"
      >
        <Select.Option value="cool">Cool</Select.Option>
        <Select.Option value="heat">Heat</Select.Option>
        <Select.Option value="auto">Auto</Select.Option>
        <Select.Option value="fan">Fan Only</Select.Option>
      </ConfigSelect>

      <ConfigSelect
        label="Temperature Unit"
        name={['config', 'tempUnit']}
        initialValue="celsius"
      >
        <Select.Option value="celsius">Celsius (°C)</Select.Option>
        <Select.Option value="fahrenheit">Fahrenheit (°F)</Select.Option>
      </ConfigSelect>

      <ConfigNumber
        label="Minimum Temperature"
        name={['config', 'minTemp']}
        initialValue={16}
      />

      <ConfigNumber
        label="Maximum Temperature"
        name={['config', 'maxTemp']}
        initialValue={30}
      />

      <ConfigSwitch label="Show Schedule" name={['config', 'showSchedule']} />
    </>
  );
}

// ============================================================================
// Advanced Lighting Widget Configuration
// ============================================================================
function AdvancedLightingWidgetConfigForm() {
  return (
    <>
      <ConfigSection title="Advanced Lighting Configuration" />

      <ConfigInput
        label="Building Name"
        name={['config', 'buildingName']}
        placeholder="e.g., Main Building"
      />

      <ConfigSwitch label="Show Floor Controls" name={['config', 'showFloorControls']} />
      <ConfigSwitch label="Show Energy Monitoring" name={['config', 'showEnergyMonitoring']} />
      <ConfigSwitch label="Show Automation" name={['config', 'showAutomation']} />

      <ConfigNumber
        label="Number of Floors"
        name={['config', 'numberOfFloors']}
        initialValue={3}
        min={1}
        max={20}
      />
    </>
  );
}

// ============================================================================
// Stats Widget Configuration
// ============================================================================
function StatsWidgetConfigForm() {
  return (
    <>
      <ConfigSection title="Stats Configuration" />

      <ConfigInput
        label="Metric Name"
        name={['config', 'metricName']}
        placeholder="e.g., Total Users"
      />

      <ConfigInput
        label="Unit"
        name={['config', 'unit']}
        placeholder="e.g., users, devices, %"
      />

      <ConfigInput
        label="Prefix"
        name={['config', 'prefix']}
        placeholder="e.g., $, #"
      />

      <ConfigInput
        label="Suffix"
        name={['config', 'suffix']}
        placeholder="e.g., %K, M"
      />

      <ConfigSwitch label="Show Trend" name={['config', 'showTrend']} />

      <ConfigSelect
        label="Color Theme"
        name={['config', 'colorTheme']}
        initialValue="blue"
      >
        <Select.Option value="blue">Blue</Select.Option>
        <Select.Option value="green">Green</Select.Option>
        <Select.Option value="purple">Purple</Select.Option>
        <Select.Option value="orange">Orange</Select.Option>
        <Select.Option value="red">Red</Select.Option>
        <Select.Option value="gradient">Gradient</Select.Option>
      </ConfigSelect>
    </>
  );
}

// ============================================================================
// Analytics Widget Configuration
// ============================================================================
function AnalyticsWidgetConfigForm() {
  return (
    <>
      <ConfigSection title="Analytics Configuration" />

      <ConfigSelect
        label="Comparison Period"
        name={['config', 'comparisonPeriod']}
        initialValue="previous"
      >
        <Select.Option value="previous">Previous Period</Select.Option>
        <Select.Option value="lastYear">Last Year</Select.Option>
        <Select.Option value="target">Target</Select.Option>
      </ConfigSelect>

      <ConfigSwitch
        label="Show Predictions"
        name={['config', 'showPredictions']}
        initialValue={false}
      />
    </>
  );
}

// ============================================================================
// Electrical Panel Widget Configuration
// ============================================================================
function ElectricalPanelWidgetConfigForm() {
  return (
    <>
      <ConfigSection title="Electrical Panel Configuration" />

      <ConfigInput
        label="Panel Name"
        name={['config', 'panelName']}
        placeholder="e.g., Main Panel A"
      />

      <ConfigNumber
        label="Total Capacity (Amps)"
        name={['config', 'totalCapacity']}
        initialValue={400}
        min={100}
        max={5000}
      />

      <ConfigNumber
        label="Voltage (V)"
        name={['config', 'voltage']}
        initialValue={480}
        min={120}
        max={1000}
      />

      <ConfigNumber
        label="Frequency (Hz)"
        name={['config', 'frequency']}
        initialValue={60}
        min={50}
        max={60}
      />

      <ConfigSwitch label="Show Alerts" name={['config', 'showAlerts']} initialValue={true} />
      <ConfigSwitch label="Show Power Factor" name={['config', 'showPowerFactor']} initialValue={true} />

      <Divider titlePlacement="left">Circuit Breakers</Divider>
      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 16 }}>
        Configure individual circuit breakers for this electrical panel. Each circuit can be monitored independently.
      </Text>

      <Form.List name={['config', 'circuits']}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card
                key={key}
                size="small"
                style={{ marginBottom: 16, background: '#fafafa' }}
                extra={
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                  >
                    Remove
                  </Button>
                }
              >
                <Form.Item
                  {...restField}
                  label="Circuit Name"
                  name={[name, 'name']}
                  rules={[{ required: true, message: 'Circuit name is required' }]}
                >
                  <Input placeholder="e.g., HVAC Main" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Capacity (Amps)"
                  name={[name, 'capacity']}
                  initialValue={100}
                  rules={[{ required: true, message: 'Capacity is required' }]}
                >
                  <InputNumber min={10} max={1000} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Voltage (V)"
                  name={[name, 'voltage']}
                  initialValue={480}
                  rules={[{ required: true, message: 'Voltage is required' }]}
                >
                  <InputNumber min={120} max={1000} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Phase"
                  name={[name, 'phase']}
                  initialValue="A"
                  rules={[{ required: true, message: 'Phase is required' }]}
                >
                  <Select>
                    <Select.Option value="A">Phase A</Select.Option>
                    <Select.Option value="B">Phase B</Select.Option>
                    <Select.Option value="C">Phase C</Select.Option>
                  </Select>
                </Form.Item>
              </Card>
            ))}
            <Button
              type="dashed"
              onClick={() => add({
                id: `circuit-${Date.now()}`,
                name: 'New Circuit',
                capacity: 100,
                voltage: 480,
                phase: 'A'
              })}
              block
              icon={<PlusOutlined />}
            >
              Add Circuit Breaker
            </Button>
          </>
        )}
      </Form.List>
    </>
  );
}

// ============================================================================
// Water Management Widget Configuration
// ============================================================================
function WaterManagementWidgetConfigForm() {
  return (
    <>
      <ConfigSection title="Water Management Configuration" />

      <ConfigInput
        label="Building Name"
        name={['config', 'buildingName']}
        placeholder="e.g., Main Building"
      />

      <ConfigSwitch label="Show Consumption Data" name={['config', 'showConsumption']} initialValue={true} />
      <ConfigSwitch label="Show Water Quality" name={['config', 'showQuality']} initialValue={true} />

      <Divider titlePlacement="left">Water Tanks</Divider>
      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 16 }}>
        Configure water storage tanks. Monitor levels, flow rates, and quality.
      </Text>

      <Form.List name={['config', 'tanks']}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card
                key={key}
                size="small"
                style={{ marginBottom: 16, background: '#fafafa' }}
                extra={
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                  >
                    Remove
                  </Button>
                }
              >
                <Form.Item
                  {...restField}
                  label="Tank Name"
                  name={[name, 'name']}
                  rules={[{ required: true, message: 'Tank name is required' }]}
                >
                  <Input placeholder="e.g., Potable Water Tank 1" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Capacity (Liters)"
                  name={[name, 'capacity']}
                  initialValue={50000}
                  rules={[{ required: true, message: 'Capacity is required' }]}
                >
                  <InputNumber min={1000} max={1000000} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Target Level (%)"
                  name={[name, 'targetLevel']}
                  initialValue={80}
                >
                  <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>
              </Card>
            ))}
            <Button
              type="dashed"
              onClick={() => add({
                id: `tank-${Date.now()}`,
                name: 'New Tank',
                capacity: 50000,
                targetLevel: 80
              })}
              block
              icon={<PlusOutlined />}
            >
              Add Water Tank
            </Button>
          </>
        )}
      </Form.List>

      <Divider titlePlacement="left">Water Pumps</Divider>
      <Form.List name={['config', 'pumps']}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card
                key={key}
                size="small"
                style={{ marginBottom: 16, background: '#fafafa' }}
                extra={
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                  >
                    Remove
                  </Button>
                }
              >
                <Form.Item
                  {...restField}
                  label="Pump Name"
                  name={[name, 'name']}
                  rules={[{ required: true, message: 'Pump name is required' }]}
                >
                  <Input placeholder="e.g., Main Supply Pump 1" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Max Power (kW)"
                  name={[name, 'maxPower']}
                  initialValue={15}
                >
                  <InputNumber min={1} max={500} style={{ width: '100%' }} />
                </Form.Item>
              </Card>
            ))}
            <Button
              type="dashed"
              onClick={() => add({
                id: `pump-${Date.now()}`,
                name: 'New Pump',
                maxPower: 15
              })}
              block
              icon={<PlusOutlined />}
            >
              Add Water Pump
            </Button>
          </>
        )}
      </Form.List>
    </>
  );
}

// ============================================================================
// Fire Safety Widget Configuration
// ============================================================================
function FireSafetyWidgetConfigForm() {
  return (
    <>
      <ConfigSection title="Fire Safety Configuration" />

      <ConfigInput
        label="Building Name"
        name={['config', 'buildingName']}
        placeholder="e.g., Main Building Complex"
      />

      <ConfigSwitch label="Show Emergency Systems" name={['config', 'showEmergencySystems']} initialValue={true} />
      <ConfigSwitch label="Show Recent Events" name={['config', 'showRecentEvents']} initialValue={true} />

      <Divider titlePlacement="left">Fire Safety Zones</Divider>
      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 16 }}>
        Configure fire safety zones with detectors, sprinklers, and pull stations.
      </Text>

      <Form.List name={['config', 'zones']}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card
                key={key}
                size="small"
                style={{ marginBottom: 16, background: '#fafafa' }}
                extra={
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                  >
                    Remove
                  </Button>
                }
              >
                <Form.Item
                  {...restField}
                  label="Zone Name"
                  name={[name, 'name']}
                  rules={[{ required: true, message: 'Zone name is required' }]}
                >
                  <Input placeholder="e.g., Floor 1-5 Office" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Number of Detectors"
                  name={[name, 'detectorCount']}
                  initialValue={48}
                >
                  <InputNumber min={0} max={500} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Number of Sprinklers"
                  name={[name, 'sprinklerCount']}
                  initialValue={72}
                >
                  <InputNumber min={0} max={500} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Number of Pull Stations"
                  name={[name, 'pullStationCount']}
                  initialValue={10}
                >
                  <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Special System (Optional)"
                  name={[name, 'specialSystem']}
                >
                  <Input placeholder="e.g., FM-200 Gas Suppression" />
                </Form.Item>
              </Card>
            ))}
            <Button
              type="dashed"
              onClick={() => add({
                id: `zone-${Date.now()}`,
                name: 'New Zone',
                detectorCount: 48,
                sprinklerCount: 72,
                pullStationCount: 10
              })}
              block
              icon={<PlusOutlined />}
            >
              Add Fire Safety Zone
            </Button>
          </>
        )}
      </Form.List>
    </>
  );
}

// ============================================================================
// Security Control Widget Configuration
// ============================================================================
function SecurityControlWidgetConfigForm() {
  return (
    <>
      <ConfigSection title="Security Control Configuration" />

      <ConfigInput
        label="System Name"
        name={['config', 'systemName']}
        placeholder="e.g., Home Security"
      />

      <ConfigInput
        label="Location"
        name={['config', 'location']}
        placeholder="e.g., Main Building"
      />

      <ConfigSwitch label="Show Cameras" name={['config', 'showCameras']} initialValue={true} />
      <ConfigSwitch label="Show Alerts" name={['config', 'showAlerts']} initialValue={true} />
      <ConfigSwitch label="Show Sensor Status" name={['config', 'showSensorStatus']} initialValue={true} />

      <Divider titlePlacement="left">Security Zones</Divider>
      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 16 }}>
        Configure security zones with sensors and cameras.
      </Text>

      <Form.List name={['config', 'zones']}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card
                key={key}
                size="small"
                style={{ marginBottom: 16, background: '#fafafa' }}
                extra={
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                  >
                    Remove
                  </Button>
                }
              >
                <Form.Item
                  {...restField}
                  label="Zone Name"
                  name={[name, 'name']}
                  rules={[{ required: true, message: 'Zone name is required' }]}
                >
                  <Input placeholder="e.g., Front Door" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Number of Sensors"
                  name={[name, 'sensorCount']}
                  initialValue={2}
                >
                  <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Number of Cameras"
                  name={[name, 'cameraCount']}
                  initialValue={1}
                >
                  <InputNumber min={0} max={50} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Initially Armed"
                  name={[name, 'initialArmedState']}
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch checkedChildren="Armed" unCheckedChildren="Disarmed" />
                </Form.Item>
              </Card>
            ))}
            <Button
              type="dashed"
              onClick={() => add({
                id: `zone-${Date.now()}`,
                name: 'New Zone',
                sensorCount: 2,
                cameraCount: 1,
                initialArmedState: true
              })}
              block
              icon={<PlusOutlined />}
            >
              Add Security Zone
            </Button>
          </>
        )}
      </Form.List>
    </>
  );
}

// ============================================================================
// Energy Control Widget Configuration
// ============================================================================
function EnergyControlWidgetConfigForm() {
  return (
    <>
      <ConfigSection title="Energy Control Configuration" />

      <ConfigInput
        label="Facility Name"
        name={['config', 'facilityName']}
        placeholder="e.g., Smart Energy Hub"
      />

      <ConfigNumber
        label="Peak Demand Limit (kW)"
        name={['config', 'peakDemandLimit']}
        initialValue={500}
        min={100}
        max={10000}
      />

      <ConfigSwitch label="Show Solar Panel" name={['config', 'showSolarPanel']} initialValue={true} />
      <ConfigSwitch label="Show Battery Storage" name={['config', 'showBattery']} initialValue={true} />
      <ConfigSwitch label="Show Grid Status" name={['config', 'showGridStatus']} initialValue={true} />
    </>
  );
}

// ============================================================================
// Climate Control Widget Configuration
// ============================================================================
function ClimateControlWidgetConfigForm() {
  return (
    <>
      <ConfigSection title="Climate Control Configuration" />

      <ConfigInput
        label="Building Name"
        name={['config', 'buildingName']}
        placeholder="e.g., Office Complex"
      />

      <ConfigNumber
        label="Number of Zones"
        name={['config', 'numberOfZones']}
        initialValue={4}
        min={1}
        max={20}
      />

      <ConfigSelect
        label="Temperature Unit"
        name={['config', 'defaultTempUnit']}
        initialValue="celsius"
      >
        <Select.Option value="celsius">Celsius (°C)</Select.Option>
        <Select.Option value="fahrenheit">Fahrenheit (°F)</Select.Option>
      </ConfigSelect>

      <ConfigSwitch label="Show Humidity" name={['config', 'showHumidity']} initialValue={true} />
      <ConfigSwitch label="Show Air Quality" name={['config', 'showAirQuality']} initialValue={true} />
      <ConfigSwitch label="Show Energy Usage" name={['config', 'showEnergyUsage']} initialValue={true} />
    </>
  );
}

// ============================================================================
// Generic Widget Configuration (fallback)
// ============================================================================
function GenericWidgetConfigForm() {
  return (
    <>
      <ConfigSection title="General Configuration" />

      <ConfigSelect
        label="Color Theme"
        name={['config', 'colorTheme']}
        initialValue="blue"
      >
        <Select.Option value="blue">Blue</Select.Option>
        <Select.Option value="green">Green</Select.Option>
        <Select.Option value="purple">Purple</Select.Option>
        <Select.Option value="orange">Orange</Select.Option>
        <Select.Option value="red">Red</Select.Option>
      </ConfigSelect>

      <ConfigSwitch label="Show Border" name={['config', 'showBorder']} />
    </>
  );
}
