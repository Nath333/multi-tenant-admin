/**
 * HVAC Control Widget V2 - Smart Multi-Unit Climate Control
 * Users can add unlimited HVAC units with independent controls
 */

import { useState, useEffect, useMemo, memo } from 'react';
import { Card, Row, Col, Slider, Select, Badge, Empty, Spin, Space, Button } from 'antd';
import { CloudOutlined, PoweroffOutlined } from '@ant-design/icons';
import ConfigurableWidgetBase from '../../base/ConfigurableWidget';
import HVACControlConfigPanel from './HVACControlConfigPanel';
import { generateMockData } from '../../data/mockDataSources';
import { WeeklyCalendar } from '../../shared';
import type { HVACControlWidgetConfig, HVACUnitConfig, ConfigurableWidgetProps } from '../../types/ConfigurableWidget.types';
import type { WeeklySchedule } from '../../shared';

type HVACControlWidgetProps = ConfigurableWidgetProps<HVACControlWidgetConfig>;

interface UnitState {
  mode: string;
  fanSpeed: string;
  temperature: number;
  targetTemp: number;
  humidity: number;
  powerState: boolean;
  efficiency: number;
  controlMode: 'off' | 'on' | 'auto';
}

function HVACControlWidget({ title, config, onConfigChange, onRemove, editMode, className, style }: HVACControlWidgetProps) {
  const [unitStates, setUnitStates] = useState<Record<string, UnitState>>({});
  const [loading, setLoading] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({});

  useEffect(() => {
    if (!config?.elements) return;

    let mounted = true;
    const intervals: number[] = [];

    const fetchData = () => {
      const newStates: Record<string, UnitState> = {};

      config.elements.forEach((unit) => {
        if (unit.enabled) {
          if (unit.dataBinding) {
            try {
              const data = generateMockData(unit.dataBinding.mockDataKey);
              newStates[unit.id] = {
                mode: data.mode || 'auto',
                fanSpeed: data.fanSpeed || 'auto',
                temperature: data.temperature || unit.defaultTemp,
                targetTemp: data.targetTemp || unit.defaultTemp,
                humidity: data.humidity || 50,
                powerState: data.powerState ?? true,
                efficiency: data.efficiency || 0.9,
                controlMode: data.controlMode || 'auto',
              };
            } catch {
              newStates[unit.id] = {
                mode: 'auto',
                fanSpeed: 'auto',
                temperature: unit.defaultTemp,
                targetTemp: unit.defaultTemp,
                humidity: 50,
                powerState: true,
                efficiency: 0.9,
                controlMode: 'auto',
              };
            }
          } else {
            // Unit has no data binding - use defaults
            newStates[unit.id] = {
              mode: 'auto',
              fanSpeed: 'auto',
              temperature: unit.defaultTemp,
              targetTemp: unit.defaultTemp,
              humidity: 50,
              powerState: true,
              efficiency: 0.9,
              controlMode: 'auto',
            };
          }
        }
      });

      if (mounted) {
        setUnitStates(newStates);
        setLoading(false);
      }
    };

    setLoading(true);
    fetchData();

    config.elements.forEach((unit) => {
      if (unit.enabled && unit.dataBinding?.refreshInterval) {
        const interval = setInterval(() => {
          if (!mounted) return;
          try {
            const data = generateMockData(unit.dataBinding!.mockDataKey);
            setUnitStates(prev => ({
              ...prev,
              [unit.id]: {
                mode: data.mode || prev[unit.id]?.mode || 'auto',
                fanSpeed: data.fanSpeed || prev[unit.id]?.fanSpeed || 'auto',
                temperature: data.temperature || prev[unit.id]?.temperature || unit.defaultTemp,
                targetTemp: prev[unit.id]?.targetTemp || unit.defaultTemp,
                humidity: data.humidity || 50,
                powerState: data.powerState ?? prev[unit.id]?.powerState ?? true,
                efficiency: data.efficiency || 0.9,
                controlMode: data.controlMode || prev[unit.id]?.controlMode || 'auto',
              },
            }));
          } catch (error) {
            console.error(`Error refreshing unit ${unit.id}:`, error);
          }
        }, unit.dataBinding.refreshInterval);
        intervals.push(interval);
      }
    });

    return () => {
      mounted = false;
      intervals.forEach(clearInterval);
    };
  }, [config?.elements]);

  const handleTempChange = (unitId: string, temp: number) => {
    setUnitStates(prev => ({
      ...prev,
      [unitId]: { ...prev[unitId], targetTemp: temp },
    }));
  };

  const handleModeChange = (unitId: string, mode: string) => {
    setUnitStates(prev => ({
      ...prev,
      [unitId]: { ...prev[unitId], mode },
    }));
  };

  const handleFanSpeedChange = (unitId: string, speed: string) => {
    setUnitStates(prev => ({
      ...prev,
      [unitId]: { ...prev[unitId], fanSpeed: speed },
    }));
  };

  const handleControlModeChange = (unitId: string, mode: 'off' | 'on' | 'auto') => {
    setUnitStates(prev => ({
      ...prev,
      [unitId]: {
        ...prev[unitId],
        controlMode: mode,
        powerState: mode === 'off' ? false : mode === 'on' ? true : prev[unitId].powerState,
      },
    }));
  };

  const handleRefresh = () => {
    if (!config?.elements) return;

    setLoading(true);
    const newStates: Record<string, UnitState> = {};

    config.elements.forEach((unit) => {
      if (unit.enabled) {
        if (unit.dataBinding) {
          try {
            const data = generateMockData(unit.dataBinding.mockDataKey);
            newStates[unit.id] = {
              temperature: data.temperature || 22,
              targetTemp: data.targetTemp || unit.defaultTemp,
              humidity: data.humidity || 50,
              mode: data.mode || 'auto',
              fanSpeed: data.fanSpeed || 'auto',
              powerState: data.powerState ?? true,
              efficiency: data.efficiency || 0.9,
              controlMode: data.controlMode || 'auto',
            };
          } catch (error) {
            newStates[unit.id] = {
              temperature: 22,
              targetTemp: unit.defaultTemp,
              humidity: 50,
              mode: 'auto',
              fanSpeed: 'auto',
              powerState: true,
              efficiency: 0.9,
              controlMode: 'auto',
            };
          }
        } else {
          // Unit has no data binding - use defaults
          newStates[unit.id] = {
            temperature: unit.defaultTemp,
            targetTemp: unit.defaultTemp,
            humidity: 50,
            mode: 'auto',
            fanSpeed: 'auto',
            powerState: true,
            efficiency: 0.9,
            controlMode: 'auto',
          };
        }
      }
    });

    setUnitStates(newStates);
    setLoading(false);
  };

  const renderUnit = (unit: HVACUnitConfig) => {
    if (!unit.enabled) return null;

    const state = unitStates[unit.id] || {
      mode: 'auto',
      fanSpeed: 'auto',
      temperature: unit.defaultTemp || 22,
      targetTemp: unit.defaultTemp || 22,
      humidity: 50,
      powerState: true,
      efficiency: 0.9,
      controlMode: 'auto' as const,
    };

    // Ensure all numeric values are valid
    const currentTemp = typeof state.temperature === 'number' ? state.temperature : (unit.defaultTemp || 22);
    const targetTemp = typeof state.targetTemp === 'number' ? state.targetTemp : (unit.defaultTemp || 22);
    const efficiency = typeof state.efficiency === 'number' ? state.efficiency : 0.9;

    const tempDiff = Math.abs(currentTemp - targetTemp);
    const statusColor = tempDiff < 1 ? '#52c41a' : tempDiff < 3 ? '#fa8c16' : '#ff4d4f';

    return (
      <Col key={unit.id} xs={24} sm={12} md={config.layout === 'zones' ? 8 : 12}>
        <Card
          size="small"
          title={
            <Space>
              <CloudOutlined style={{ color: '#1890ff' }} />
              {unit.name}
              <Badge status={state.powerState ? 'processing' : 'default'} />
            </Space>
          }
          style={{ height: '100%' }}
        >
          {unit.location && (
            <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 12 }}>
              📍 {unit.location} • {unit.unitType.toUpperCase()} • {unit.capacity} BTU
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 8 }}>Control Mode</div>
            <Space.Compact style={{ width: '100%' }}>
              <Button
                type={state.controlMode === 'off' ? 'primary' : 'default'}
                danger={state.controlMode === 'off'}
                onClick={() => handleControlModeChange(unit.id, 'off')}
                style={{ flex: 1 }}
                icon={<PoweroffOutlined />}
              >
                OFF
              </Button>
              <Button
                type={state.controlMode === 'on' ? 'primary' : 'default'}
                onClick={() => handleControlModeChange(unit.id, 'on')}
                style={{ flex: 1 }}
              >
                ON
              </Button>
              <Button
                type={state.controlMode === 'auto' ? 'primary' : 'default'}
                onClick={() => handleControlModeChange(unit.id, 'auto')}
                style={{ flex: 1 }}
              >
                AUTO
              </Button>
            </Space.Compact>
          </div>

          <Row gutter={[8, 16]}>
            <Col span={12}>
              <div style={{ textAlign: 'center', padding: 16, background: '#fafafa', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: '#8c8c8c' }}>Current</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: statusColor }}>
                  {currentTemp.toFixed(1)}°C
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ textAlign: 'center', padding: 16, background: '#fafafa', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: '#8c8c8c' }}>Target</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#1890ff' }}>
                  {targetTemp.toFixed(1)}°C
                </div>
              </div>
            </Col>
          </Row>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, marginBottom: 8 }}>Temperature Control</div>
            <Slider
              min={unit.minTemp || 16}
              max={unit.maxTemp || 30}
              value={targetTemp}
              onChange={(value) => handleTempChange(unit.id, value)}
              step={0.5}
              marks={{
                [unit.minTemp]: `${unit.minTemp}°C`,
                [unit.maxTemp]: `${unit.maxTemp}°C`,
              }}
              tooltip={{ formatter: (value) => `${value}°C` }}
            />
          </div>

          <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
            <Col span={12}>
              <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 4 }}>Mode</div>
              <Select
                value={state.mode}
                onChange={(value) => handleModeChange(unit.id, value)}
                style={{ width: '100%' }}
                size="small"
              >
                {(unit.modes || ['auto', 'cool', 'heat', 'fan']).map((mode) => (
                  <Select.Option key={mode} value={mode}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={12}>
              <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 4 }}>Fan Speed</div>
              <Select
                value={state.fanSpeed}
                onChange={(value) => handleFanSpeedChange(unit.id, value)}
                style={{ width: '100%' }}
                size="small"
              >
                {(unit.fanSpeeds || ['low', 'medium', 'high', 'auto']).map((speed) => (
                  <Select.Option key={speed} value={speed}>
                    {speed.charAt(0).toUpperCase() + speed.slice(1)}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>

          {config.showAirQuality && (
            <Row gutter={[8, 8]} style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
              <Col span={12}>
                <div style={{ fontSize: 11, color: '#8c8c8c' }}>Humidity</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{state.humidity}%</div>
              </Col>
              <Col span={12}>
                <div style={{ fontSize: 11, color: '#8c8c8c' }}>Efficiency</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{(efficiency * 100).toFixed(0)}%</div>
              </Col>
            </Row>
          )}
        </Card>
      </Col>
    );
  };

  const enabledUnits = useMemo(() => config?.elements?.filter(u => u.enabled) || [], [config?.elements]);

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Spin size="large" tip="Loading HVAC units..." />
        </div>
      );
    }

    if (enabledUnits.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No HVAC units configured"
          style={{ padding: '48px 0' }}
        >
          <p style={{ color: '#8c8c8c', fontSize: 13 }}>
            Click the <strong>Configure</strong> button to add HVAC units
          </p>
        </Empty>
      );
    }

    return (
      <>
        <WeeklyCalendar
          schedule={weeklySchedule}
          onChange={setWeeklySchedule}
          title="HVAC Weekly Schedule"
        />

        <Row gutter={[16, 16]}>
          {enabledUnits.map(renderUnit)}
        </Row>
      </>
    );
  };

  return (
    <ConfigurableWidgetBase
      title={title}
      config={config}
      onConfigChange={onConfigChange}
      onRemove={onRemove}
      editMode={editMode}
      className={className}
      style={style}
      renderConfigPanel={({ config, onChange, onClose }) => (
        <HVACControlConfigPanel
          config={config}
          onChange={onChange}
          onClose={onClose}
        />
      )}
      onRefresh={handleRefresh}
      loading={loading}
    >
      {renderContent()}
    </ConfigurableWidgetBase>
  );
}

export default memo(HVACControlWidget);
