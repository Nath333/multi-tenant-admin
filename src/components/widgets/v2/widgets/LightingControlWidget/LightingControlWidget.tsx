/**
 * Lighting Control Widget V2 - Smart Multi-Zone Lighting Control
 * Users can add unlimited lighting zones with independent controls
 */

import { useState, useEffect, useMemo, memo } from 'react';
import { Card, Row, Col, Slider, Switch, Empty, Spin, Space, Tag, Button } from 'antd';
import { BulbOutlined, BulbFilled, ThunderboltOutlined, PoweroffOutlined } from '@ant-design/icons';
import ConfigurableWidgetBase from '../../base/ConfigurableWidget';
import LightingControlConfigPanel from './LightingControlConfigPanel';
import { generateMockData } from '../../data/mockDataSources';
import { WeeklyCalendar } from '../../shared';
import type { LightingControlWidgetConfig, LightingZoneConfig, ConfigurableWidgetProps } from '../../types/ConfigurableWidget.types';
import type { WeeklySchedule } from '../../shared';

interface LightingControlWidgetProps extends ConfigurableWidgetProps<LightingControlWidgetConfig> {}

interface ZoneState {
  brightness: number;
  powerState: boolean;
  occupancyDetected: boolean;
  daylightLevel: number;
  powerConsumption: number;
  controlMode: 'off' | 'on' | 'auto';
}

function LightingControlWidget({ title, config, onConfigChange, onRemove, editMode, className, style }: LightingControlWidgetProps) {
  const [zoneStates, setZoneStates] = useState<Record<string, ZoneState>>({});
  const [loading, setLoading] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({});

  useEffect(() => {
    if (!config?.elements) return;

    let mounted = true;
    const intervals: number[] = [];

    const fetchData = () => {
      const newStates: Record<string, ZoneState> = {};

      config.elements.forEach((zone) => {
        if (zone.enabled) {
          if (zone.dataBinding) {
            // Zone has data binding - fetch real data
            try {
              const data = generateMockData(zone.dataBinding.mockDataKey);
              newStates[zone.id] = {
                brightness: data.brightness || zone.defaultBrightness,
                powerState: data.powerState ?? true,
                occupancyDetected: data.occupancyDetected ?? false,
                daylightLevel: data.daylightLevel || 0,
                powerConsumption: data.powerConsumption || 0,
                controlMode: data.controlMode || 'auto',
              };
            } catch {
              // Fallback to defaults if data fetch fails
              newStates[zone.id] = {
                brightness: zone.defaultBrightness,
                powerState: true,
                occupancyDetected: false,
                daylightLevel: 0,
                powerConsumption: zone.fixtureCount * zone.powerRating * (zone.defaultBrightness / 100),
                controlMode: 'auto',
              };
            }
          } else {
            // Zone has no data binding - use default values
            newStates[zone.id] = {
              brightness: zone.defaultBrightness,
              powerState: true,
              occupancyDetected: false,
              daylightLevel: 0,
              powerConsumption: zone.fixtureCount * zone.powerRating * (zone.defaultBrightness / 100),
              controlMode: 'auto',
            };
          }
        }
      });

      if (mounted) {
        setZoneStates(newStates);
        setLoading(false);
      }
    };

    setLoading(true);
    fetchData();

    config.elements.forEach((zone) => {
      if (zone.enabled && zone.dataBinding?.refreshInterval) {
        const interval = setInterval(() => {
          if (!mounted) return;
          try {
            const data = generateMockData(zone.dataBinding!.mockDataKey);
            setZoneStates(prev => ({
              ...prev,
              [zone.id]: {
                brightness: data.brightness || prev[zone.id]?.brightness || zone.defaultBrightness,
                powerState: data.powerState ?? prev[zone.id]?.powerState ?? true,
                occupancyDetected: data.occupancyDetected ?? false,
                daylightLevel: data.daylightLevel || 0,
                powerConsumption: data.powerConsumption || 0,
                controlMode: data.controlMode || prev[zone.id]?.controlMode || 'auto',
              },
            }));
          } catch (error) {
            console.error(`Error refreshing zone ${zone.id}:`, error);
          }
        }, zone.dataBinding.refreshInterval);
        intervals.push(interval);
      }
    });

    return () => {
      mounted = false;
      intervals.forEach(clearInterval);
    };
  }, [config?.elements]);

  const handleBrightnessChange = (zoneId: string, brightness: number) => {
    const zone = config?.elements?.find(z => z.id === zoneId);
    if (!zone) return;

    const power = zone.fixtureCount * zone.powerRating * (brightness / 100);
    setZoneStates(prev => ({
      ...prev,
      [zoneId]: {
        ...prev[zoneId],
        brightness,
        powerConsumption: power,
      },
    }));
  };

  const handlePowerToggle = (zoneId: string, powerState: boolean) => {
    setZoneStates(prev => ({
      ...prev,
      [zoneId]: {
        ...prev[zoneId],
        powerState,
        brightness: powerState ? (prev[zoneId]?.brightness || 50) : 0,
      },
    }));
  };

  const handleControlModeChange = (zoneId: string, mode: 'off' | 'on' | 'auto') => {
    setZoneStates(prev => ({
      ...prev,
      [zoneId]: {
        ...prev[zoneId],
        controlMode: mode,
        powerState: mode === 'off' ? false : mode === 'on' ? true : prev[zoneId].powerState,
      },
    }));
  };

  const handleRefresh = () => {
    if (!config?.elements) return;

    setLoading(true);
    const newStates: Record<string, ZoneState> = {};

    config.elements.forEach((zone) => {
      if (zone.enabled) {
        if (zone.dataBinding) {
          try {
            const data = generateMockData(zone.dataBinding.mockDataKey);
            newStates[zone.id] = {
              brightness: data.brightness || zone.defaultBrightness,
              powerState: data.powerState ?? true,
              occupancyDetected: data.occupancyDetected ?? false,
              daylightLevel: data.daylightLevel || 0,
              powerConsumption: data.powerConsumption || 0,
              controlMode: data.controlMode || 'auto',
            };
          } catch (error) {
            newStates[zone.id] = {
              brightness: zone.defaultBrightness,
              powerState: true,
              occupancyDetected: false,
              daylightLevel: 0,
              powerConsumption: zone.fixtureCount * zone.powerRating * (zone.defaultBrightness / 100),
              controlMode: 'auto',
            };
          }
        } else {
          // Zone has no data binding - use default values
          newStates[zone.id] = {
            brightness: zone.defaultBrightness,
            powerState: true,
            occupancyDetected: false,
            daylightLevel: 0,
            powerConsumption: zone.fixtureCount * zone.powerRating * (zone.defaultBrightness / 100),
            controlMode: 'auto',
          };
        }
      }
    });

    setZoneStates(newStates);
    setLoading(false);
  };

  const totalPower = useMemo(() =>
    Object.values(zoneStates).reduce((sum, state) => sum + (state.powerConsumption || 0), 0),
    [zoneStates]
  );

  const totalZones = useMemo(() =>
    config?.elements?.filter(z => z.enabled).length || 0,
    [config?.elements]
  );

  const activeZones = useMemo(() =>
    Object.values(zoneStates).filter(s => s.powerState).length,
    [zoneStates]
  );

  const enabledZones = useMemo(() =>
    config?.elements?.filter(z => z.enabled) || [],
    [config?.elements]
  );

  const renderZone = (zone: LightingZoneConfig) => {
    if (!zone.enabled) return null;

    const state = zoneStates[zone.id] || {
      brightness: zone.defaultBrightness,
      powerState: true,
      occupancyDetected: false,
      daylightLevel: 0,
      powerConsumption: 0,
      controlMode: 'auto' as const,
    };

    return (
      <Col key={zone.id} xs={24} sm={12} md={config.layout === 'compact' ? 8 : 12} lg={config.layout === 'grid' ? 8 : 12}>
        <Card
          size="small"
          title={
            <Space>
              {state.powerState ? <BulbFilled style={{ color: '#faad14' }} /> : <BulbOutlined />}
              {zone.name}
              {config.showOccupancy && state.occupancyDetected && (
                <Tag color="green" style={{ fontSize: 11 }}>Occupied</Tag>
              )}
            </Space>
          }
          extra={
            <Switch
              checked={state.powerState}
              onChange={(checked) => handlePowerToggle(zone.id, checked)}
              size="small"
            />
          }
          style={{ height: '100%' }}
        >
          {zone.location && (
            <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 12 }}>
              {zone.location}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 8 }}>Control Mode</div>
            <Space.Compact style={{ width: '100%' }}>
              <Button
                type={state.controlMode === 'off' ? 'primary' : 'default'}
                danger={state.controlMode === 'off'}
                onClick={() => handleControlModeChange(zone.id, 'off')}
                style={{ flex: 1 }}
                icon={<PoweroffOutlined />}
              >
                OFF
              </Button>
              <Button
                type={state.controlMode === 'on' ? 'primary' : 'default'}
                onClick={() => handleControlModeChange(zone.id, 'on')}
                style={{ flex: 1 }}
              >
                ON
              </Button>
              <Button
                type={state.controlMode === 'auto' ? 'primary' : 'default'}
                onClick={() => handleControlModeChange(zone.id, 'auto')}
                style={{ flex: 1 }}
              >
                AUTO
              </Button>
            </Space.Compact>
          </div>

          {zone.supportsDimming && state.powerState && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                <span>Brightness</span>
                <span style={{ fontWeight: 600 }}>{state.brightness}%</span>
              </div>
              <Slider
                min={zone.minBrightness}
                max={zone.maxBrightness}
                value={state.brightness}
                onChange={(value) => handleBrightnessChange(zone.id, value)}
                tooltip={{ formatter: (value) => `${value}%` }}
              />
            </div>
          )}

          <Row gutter={[8, 8]}>
            <Col span={12}>
              <div style={{ fontSize: 11, color: '#8c8c8c' }}>Fixtures</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{zone.fixtureCount}</div>
            </Col>
            {config.showEnergyMetrics && (
              <Col span={12}>
                <div style={{ fontSize: 11, color: '#8c8c8c' }}>Power</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {state.powerConsumption.toFixed(0)}W
                </div>
              </Col>
            )}
          </Row>
        </Card>
      </Col>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Spin size="large" tip="Loading zones..." />
        </div>
      );
    }

    if (enabledZones.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No lighting zones configured"
          style={{ padding: '48px 0' }}
        >
          <p style={{ color: '#8c8c8c', fontSize: 13 }}>
            Click the <strong>Configure</strong> button to add lighting zones
          </p>
        </Empty>
      );
    }

    return (
      <>
        <WeeklyCalendar
          schedule={weeklySchedule}
          onChange={setWeeklySchedule}
          title="Lighting Weekly Schedule"
        />

        {config.showEnergyMetrics && (
          <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#8c8c8c' }}>Total Zones</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#1890ff' }}>{totalZones}</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#8c8c8c' }}>Active</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#52c41a' }}>{activeZones}</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#8c8c8c' }}>Total Power</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#faad14' }}>
                    <ThunderboltOutlined /> {totalPower.toFixed(0)}W
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        )}

        <Row gutter={[16, 16]}>
          {enabledZones.map(renderZone)}
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
        <LightingControlConfigPanel
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

export default memo(LightingControlWidget);
