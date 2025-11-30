/**
 * Electrical Panel Widget V2 - Smart Multi-Panel Monitoring
 * Users can add unlimited electrical panels with circuit monitoring
 */

import { useState, useEffect, useMemo, memo } from 'react';
import { Card, Row, Col, Progress, Badge, Empty, Spin, Tag, Space, Statistic } from 'antd';
import { ThunderboltOutlined, WarningOutlined } from '@ant-design/icons';
import ConfigurableWidgetBase from '../../base/ConfigurableWidget';
import ElectricalPanelConfigPanel from './ElectricalPanelConfigPanel';
import { generateMockData } from '../../data/mockDataSources';
import { WeeklyCalendar } from '../../shared';
import type { ElectricalPanelWidgetConfig, ElectricalPanelConfig, ConfigurableWidgetProps } from '../../types/ConfigurableWidget.types';
import type { WeeklySchedule } from '../../shared';

type ElectricalPanelWidgetProps = ConfigurableWidgetProps<ElectricalPanelWidgetConfig>;

interface PanelState {
  totalLoad: number;
  voltage: number;
  frequency: number;
  powerFactor: number;
  circuitData: Record<string, { current: number; voltage: number; power: number; status: string }>;
}

function ElectricalPanelWidget({ title, config, onConfigChange, onRemove, editMode, className, style }: ElectricalPanelWidgetProps) {
  const [panelStates, setPanelStates] = useState<Record<string, PanelState>>({});
  const [loading, setLoading] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({});

  useEffect(() => {
    if (!config?.elements) return;

    let mounted = true;
    const intervals: number[] = [];

    const fetchData = () => {
      const newStates: Record<string, PanelState> = {};

      config.elements.forEach((panel) => {
        if (panel.enabled) {
          if (panel.dataBinding) {
            try {
              const circuitData: Record<string, any> = {};
              panel.circuits.forEach((circuit) => {
                const data = generateMockData('circuit-status');
                circuitData[circuit.id] = {
                  current: data.current || 0,
                  voltage: data.voltage || panel.voltage,
                  power: data.power || 0,
                  status: data.status || 'normal',
                };
              });

              const totalLoad = Object.values(circuitData).reduce((sum: number, c: any) => sum + c.current, 0);

              newStates[panel.id] = {
                totalLoad,
                voltage: panel.voltage,
                frequency: 60,
                powerFactor: 0.95,
                circuitData,
              };
            } catch {
              newStates[panel.id] = {
                totalLoad: 0,
                voltage: panel.voltage,
                frequency: 60,
                powerFactor: 0.95,
                circuitData: {},
              };
            }
          } else {
            // Panel has no data binding - use defaults with static circuit data
            const circuitData: Record<string, any> = {};
            panel.circuits.forEach((circuit) => {
              const estimatedCurrent = circuit.breakerSize * 0.5; // 50% load
              circuitData[circuit.id] = {
                current: estimatedCurrent,
                voltage: circuit.voltage,
                power: estimatedCurrent * circuit.voltage,
                status: 'normal',
              };
            });

            const totalLoad = Object.values(circuitData).reduce((sum: number, c: any) => sum + c.current, 0);

            newStates[panel.id] = {
              totalLoad,
              voltage: panel.voltage,
              frequency: 60,
              powerFactor: 0.95,
              circuitData,
            };
          }
        }
      });

      if (mounted) {
        setPanelStates(newStates);
        setLoading(false);
      }
    };

    setLoading(true);
    fetchData();

    config.elements.forEach((panel) => {
      if (panel.enabled && panel.dataBinding?.refreshInterval) {
        const interval = setInterval(() => {
          if (!mounted) return;
          try {
            const circuitData: Record<string, any> = {};
            panel.circuits.forEach((circuit) => {
              const data = generateMockData('circuit-status');
              circuitData[circuit.id] = {
                current: data.current || 0,
                voltage: data.voltage || panel.voltage,
                power: data.power || 0,
                status: data.status || 'normal',
              };
            });

            const totalLoad = Object.values(circuitData).reduce((sum: number, c: any) => sum + c.current, 0);

            setPanelStates(prev => ({
              ...prev,
              [panel.id]: {
                ...prev[panel.id],
                totalLoad,
                circuitData,
              },
            }));
          } catch (error) {
            console.error(`Error refreshing panel ${panel.id}:`, error);
          }
        }, panel.dataBinding.refreshInterval);
        intervals.push(interval);
      }
    });

    return () => {
      mounted = false;
      intervals.forEach(clearInterval);
    };
  }, [config?.elements]);

  const handleRefresh = () => {
    if (!config?.elements) return;

    setLoading(true);
    const newStates: Record<string, PanelState> = {};

    config.elements.forEach((panel) => {
      if (panel.enabled) {
        if (panel.dataBinding) {
          try {
            const data = generateMockData(panel.dataBinding.mockDataKey);
            const circuitData: Record<string, any> = {};
            panel.circuits.forEach((circuit) => {
              circuitData[circuit.id] = {
                current: data.current || 20,
                power: data.power || 2400,
                voltage: data.voltage || panel.voltage,
                status: data.status || 'normal',
              };
            });

            newStates[panel.id] = {
              totalLoad: data.current || panel.totalCapacity * 0.6,
              voltage: data.voltage || panel.voltage,
              frequency: data.frequency || 60,
              powerFactor: data.powerFactor || 0.95,
              circuitData,
            };
          } catch {
            const circuitData: Record<string, any> = {};
            panel.circuits.forEach((circuit) => {
              circuitData[circuit.id] = {
                current: 20,
                power: 2400,
                voltage: panel.voltage,
                status: 'normal',
              };
            });

            newStates[panel.id] = {
              totalLoad: panel.totalCapacity * 0.6,
              voltage: panel.voltage,
              frequency: 60,
              powerFactor: 0.95,
              circuitData,
            };
          }
        } else {
          // Panel has no data binding - use defaults
          const circuitData: Record<string, any> = {};
          panel.circuits.forEach((circuit) => {
            const estimatedCurrent = circuit.breakerSize * 0.5;
            circuitData[circuit.id] = {
              current: estimatedCurrent,
              power: estimatedCurrent * circuit.voltage,
              voltage: circuit.voltage,
              status: 'normal',
            };
          });

          const totalLoad = Object.values(circuitData).reduce((sum: number, c: any) => sum + c.current, 0);

          newStates[panel.id] = {
            totalLoad,
            voltage: panel.voltage,
            frequency: 60,
            powerFactor: 0.95,
            circuitData,
          };
        }
      }
    });

    setPanelStates(newStates);
    setLoading(false);
  };

  const renderPanel = (panel: ElectricalPanelConfig) => {
    if (!panel.enabled) return null;

    const state = panelStates[panel.id] || {
      totalLoad: 0,
      voltage: panel.voltage,
      frequency: 60,
      powerFactor: 0.95,
      circuitData: {},
    };

    const loadPercent = (state.totalLoad / panel.totalCapacity) * 100;
    const loadColor = loadPercent < 70 ? '#52c41a' : loadPercent < 90 ? '#faad14' : '#ff4d4f';

    const warningCircuits = panel.circuits.filter(c => {
      const data = state.circuitData[c.id];
      return data && (data.current / c.breakerSize) > 0.8;
    });

    return (
      <Col key={panel.id} xs={24} sm={24} md={config.layout === 'multi' ? 12 : 24}>
        <Card
          size="small"
          title={
            <Space>
              <ThunderboltOutlined style={{ color: '#faad14' }} />
              {panel.name}
              {warningCircuits.length > 0 && (
                <Tag color="warning" icon={<WarningOutlined />}>
                  {warningCircuits.length} Warnings
                </Tag>
              )}
            </Space>
          }
          style={{ height: '100%' }}
        >
          {panel.location && (
            <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 12 }}>
              📍 {panel.location} • {panel.totalCapacity}A • {panel.voltage}V • {panel.phases}-Phase
            </div>
          )}

          {/* Panel Overview */}
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Statistic
                title="Load"
                value={state.totalLoad.toFixed(1)}
                suffix={`/ ${panel.totalCapacity}A`}
                styles={{ content: { color: loadColor, fontSize: 18 } }}
              />
              <Progress
                percent={loadPercent}
                strokeColor={loadColor}
                size="small"
                showInfo={false}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Voltage"
                value={state.voltage.toFixed(1)}
                suffix="V"
                styles={{ content: { fontSize: 18 } }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Power Factor"
                value={state.powerFactor.toFixed(2)}
                styles={{ content: { fontSize: 18 } }}
              />
            </Col>
          </Row>

          {/* Circuits */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
              Circuits ({panel.circuits.length})
            </div>
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {panel.circuits.map((circuit) => {
                const circuitData = state.circuitData[circuit.id];
                if (!circuitData) return null;

                const usage = (circuitData.current / circuit.breakerSize) * 100;
                const status = usage > 90 ? 'error' : usage > 80 ? 'warning' : 'success';

                return (
                  <Card
                    key={circuit.id}
                    size="small"
                    style={{ marginBottom: 8 }}
                    styles={{ body: { padding: '8px 12px' } }}
                  >
                    <Row align="middle" gutter={[8, 0]}>
                      <Col flex="auto">
                        <Space>
                          <Badge status={status === 'success' ? 'processing' : status === 'warning' ? 'warning' : 'error'} />
                          <span style={{ fontWeight: 500, fontSize: 12 }}>{circuit.name}</span>
                          {circuit.critical && <Tag color="red" style={{ fontSize: 10 }}>Critical</Tag>}
                        </Space>
                      </Col>
                      <Col>
                        <Space size="large">
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 10, color: '#8c8c8c' }}>Current</div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>
                              {circuitData.current.toFixed(1)}A
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 10, color: '#8c8c8c' }}>Power</div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>
                              {circuitData.power.toFixed(0)}W
                            </div>
                          </div>
                          <div style={{ width: 60 }}>
                            <Progress
                              percent={usage}
                              size="small"
                              strokeColor={status === 'success' ? '#52c41a' : status === 'warning' ? '#faad14' : '#ff4d4f'}
                              showInfo={false}
                            />
                          </div>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                );
              })}
            </div>
          </div>
        </Card>
      </Col>
    );
  };

  const enabledPanels = useMemo(() => config?.elements?.filter(p => p.enabled) || [], [config?.elements]);

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Spin size="large" tip="Loading electrical panels..." />
        </div>
      );
    }

    if (enabledPanels.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No electrical panels configured"
          style={{ padding: '48px 0' }}
        >
          <p style={{ color: '#8c8c8c', fontSize: 13 }}>
            Click the <strong>Configure</strong> button to add electrical panels
          </p>
        </Empty>
      );
    }

    return (
      <>
        <WeeklyCalendar
          schedule={weeklySchedule}
          onChange={setWeeklySchedule}
          title="Electrical Panel Weekly Schedule"
        />

        <Row gutter={[16, 16]}>
          {enabledPanels.map(renderPanel)}
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
        <ElectricalPanelConfigPanel
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

export default memo(ElectricalPanelWidget);
