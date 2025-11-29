/**
 * Mock Data Sources - Centralized mock data generation
 * All widgets bind to these data sources
 */

import type { MockDataSource, DataSourceType } from '../types/ConfigurableWidget.types';

// Re-export types for convenience
export type { MockDataSource, DataSourceType };

// ============================================================================
// Helper Functions
// ============================================================================

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min: number, max: number, decimals = 2) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

// Generate realistic wave patterns for time series data
const generateRealisticTimeSeries = (
  points: number,
  baseValue: number,
  variance: number,
  pattern: 'sine' | 'random' | 'trending-up' | 'trending-down' = 'random'
) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => {
    let value = baseValue;

    switch (pattern) {
      case 'sine':
        // Sinusoidal pattern for cyclical data (e.g., temperature)
        value = baseValue + (variance * Math.sin((i / points) * Math.PI * 4));
        break;
      case 'trending-up':
        value = baseValue + (variance * (i / points)) + randomFloat(-variance * 0.3, variance * 0.3);
        break;
      case 'trending-down':
        value = baseValue - (variance * (i / points)) + randomFloat(-variance * 0.3, variance * 0.3);
        break;
      default:
        value = randomFloat(baseValue - variance, baseValue + variance);
    }

    return {
      timestamp: now - (points - i) * 60000,  // 1 minute intervals
      value: parseFloat(value.toFixed(2)),
    };
  });
};

// ============================================================================
// Temperature & Climate Data
// ============================================================================

export const temperatureData: MockDataSource = {
  key: 'temperature-realtime',
  name: 'Temperature (Real-time)',
  description: 'Current temperature readings from sensors',
  type: 'realtime-sensor',
  generate: () => ({
    current: randomFloat(18, 26, 1),
    target: 22,
    unit: '°C',
    trend: randomFloat(-2, 2, 1),
    lastUpdated: new Date().toISOString(),
  }),
};

export const temperatureTimeSeries: MockDataSource = {
  key: 'temperature-timeseries',
  name: 'Temperature (Historical)',
  description: 'Temperature data over time with realistic daily patterns',
  type: 'historical-timeseries',
  generate: () => generateRealisticTimeSeries(50, 22, 3, 'sine'),
};

export const humidityData: MockDataSource = {
  key: 'humidity-realtime',
  name: 'Humidity (Real-time)',
  description: 'Current humidity readings',
  type: 'realtime-sensor',
  generate: () => ({
    current: randomFloat(40, 60, 1),
    target: 50,
    unit: '%',
    trend: randomFloat(-5, 5, 1),
    lastUpdated: new Date().toISOString(),
  }),
};

export const airQualityData: MockDataSource = {
  key: 'air-quality-realtime',
  name: 'Air Quality (Real-time)',
  description: 'CO2, VOC, and particulate matter readings',
  type: 'realtime-sensor',
  generate: () => ({
    co2: randomBetween(400, 1200),
    voc: randomBetween(0, 500),
    pm25: randomFloat(5, 35, 1),
    aqi: randomBetween(50, 150),
    status: randomBetween(50, 150) < 100 ? 'good' : 'moderate',
    lastUpdated: new Date().toISOString(),
  }),
};

// ============================================================================
// Lighting Data
// ============================================================================

export const lightingZoneStatus: MockDataSource = {
  key: 'lighting-zone-status',
  name: 'Lighting Zone Status',
  description: 'Current status of lighting zones',
  type: 'device-status',
  generate: () => ({
    brightness: randomBetween(0, 100),
    powerState: Math.random() > 0.3,
    occupancyDetected: Math.random() > 0.5,
    daylightLevel: randomBetween(0, 100),
    powerConsumption: randomFloat(50, 200, 1),
    controlMode: ['off', 'on', 'auto'][randomBetween(0, 2)],
    lastActivity: new Date(Date.now() - randomBetween(0, 3600000)).toISOString(),
  }),
};

// Alias for backward compatibility
export const lightingZone: MockDataSource = {
  key: 'lighting-zone',
  name: 'Lighting Zone',
  description: 'Current status of lighting zones (alias)',
  type: 'device-status',
  generate: lightingZoneStatus.generate,
};

export const lightingEnergyUsage: MockDataSource = {
  key: 'lighting-energy-timeseries',
  name: 'Lighting Energy Usage',
  description: 'Energy consumption over time with business hours pattern',
  type: 'historical-timeseries',
  generate: () => {
    const now = Date.now();
    return Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(now - (24 - i) * 3600000).getHours();
      // Higher usage during business hours (8am-6pm)
      const isBusinessHours = hour >= 8 && hour <= 18;
      const baseValue = isBusinessHours ? 180 : 60;
      const variance = isBusinessHours ? 40 : 20;
      return {
        timestamp: now - (24 - i) * 3600000,
        value: randomFloat(baseValue - variance, baseValue + variance),
      };
    });
  },
};

// ============================================================================
// Electrical Data
// ============================================================================

export const circuitStatus: MockDataSource = {
  key: 'circuit-status',
  name: 'Circuit Status',
  description: 'Current status of electrical circuits',
  type: 'device-status',
  generate: () => ({
    current: randomFloat(5, 45, 1),
    voltage: randomFloat(115, 125, 1),
    power: randomFloat(500, 5000, 0),
    powerFactor: randomFloat(0.85, 0.99, 2),
    status: Math.random() > 0.1 ? 'normal' : 'warning',
    trip: false,
    lastUpdated: new Date().toISOString(),
  }),
};

export const powerQualityData: MockDataSource = {
  key: 'power-quality',
  name: 'Power Quality Metrics',
  description: 'Voltage, frequency, and harmonics',
  type: 'realtime-sensor',
  generate: () => ({
    voltage: randomFloat(118, 122, 1),
    frequency: randomFloat(59.9, 60.1, 2),
    thd: randomFloat(1, 5, 2),  // Total Harmonic Distortion
    unbalance: randomFloat(0, 3, 2),
    status: 'good',
    lastUpdated: new Date().toISOString(),
  }),
};

export const energyConsumption: MockDataSource = {
  key: 'energy-consumption-timeseries',
  name: 'Energy Consumption',
  description: 'Power consumption over time with daily usage patterns',
  type: 'historical-timeseries',
  generate: () => {
    const now = Date.now();
    return Array.from({ length: 48 }, (_, i) => {
      const hour = new Date(now - (48 - i) * 3600000).getHours();
      // Peak usage during business hours
      const isPeak = hour >= 9 && hour <= 17;
      const baseValue = isPeak ? 4200 : 2800;
      const variance = 800;
      return {
        timestamp: now - (48 - i) * 3600000,
        value: randomFloat(baseValue - variance, baseValue + variance),
      };
    });
  },
};

// ============================================================================
// HVAC Data
// ============================================================================

export const hvacUnitStatus: MockDataSource = {
  key: 'hvac-unit-status',
  name: 'HVAC Unit Status',
  description: 'Current HVAC unit operating status',
  type: 'device-status',
  generate: () => ({
    mode: ['auto', 'cool', 'heat', 'fan'][randomBetween(0, 3)],
    fanSpeed: ['low', 'medium', 'high', 'auto'][randomBetween(0, 3)],
    temperature: randomFloat(18, 26, 1),
    targetTemp: 22,
    humidity: randomBetween(40, 60),
    powerState: Math.random() > 0.2,
    efficiency: randomFloat(0.85, 0.98, 2),
    runtime: randomBetween(0, 86400),  // seconds
    lastMaintenance: new Date(Date.now() - randomBetween(0, 30) * 86400000).toISOString(),
  }),
};

export const hvacEnergyUsage: MockDataSource = {
  key: 'hvac-energy-timeseries',
  name: 'HVAC Energy Usage',
  description: 'HVAC energy consumption over time with temperature-driven patterns',
  type: 'historical-timeseries',
  generate: () => {
    const now = Date.now();
    return Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(now - (24 - i) * 3600000).getHours();
      // Higher consumption during extreme temperatures (midday/night)
      const isMidDay = hour >= 11 && hour <= 15;
      const isNight = hour <= 5 || hour >= 22;
      const baseValue = isMidDay ? 3200 : isNight ? 2200 : 2600;
      const variance = 600;
      return {
        timestamp: now - (24 - i) * 3600000,
        value: randomFloat(baseValue - variance, baseValue + variance),
      };
    });
  },
};

// ============================================================================
// Chart/Analytics Data
// ============================================================================

export const deviceCountTimeSeries: MockDataSource = {
  key: 'device-count-timeseries',
  name: 'Device Count (Time Series)',
  description: 'Number of active devices over time with gradual growth',
  type: 'historical-timeseries',
  generate: () => generateRealisticTimeSeries(30, 150, 20, 'trending-up'),
};

export const alertCountTimeSeries: MockDataSource = {
  key: 'alert-count-timeseries',
  name: 'Alert Count (Time Series)',
  description: 'Number of alerts over time with random spikes',
  type: 'historical-timeseries',
  generate: () => {
    const now = Date.now();
    return Array.from({ length: 30 }, (_, i) => {
      // Occasional spikes in alerts
      const isSpike = Math.random() > 0.85;
      const baseValue = isSpike ? 45 : 20;
      const variance = isSpike ? 15 : 8;
      return {
        timestamp: now - (30 - i) * 86400000, // Daily data
        value: randomFloat(baseValue - variance, baseValue + variance),
      };
    });
  },
};

export const occupancyTimeSeries: MockDataSource = {
  key: 'occupancy-timeseries',
  name: 'Occupancy (Time Series)',
  description: 'Building occupancy percentage over time with business hours pattern',
  type: 'historical-timeseries',
  generate: () => {
    const now = Date.now();
    return Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(now - (24 - i) * 3600000).getHours();
      // Peak occupancy during business hours
      const isBusinessHours = hour >= 9 && hour <= 17;
      const baseValue = isBusinessHours ? 75 : 15;
      const variance = isBusinessHours ? 15 : 10;
      return {
        timestamp: now - (24 - i) * 3600000,
        value: Math.min(100, Math.max(0, randomFloat(baseValue - variance, baseValue + variance))),
      };
    });
  },
};

export const revenueTimeSeries: MockDataSource = {
  key: 'revenue-timeseries',
  name: 'Revenue (Time Series)',
  description: 'Revenue data over time with growth trend',
  type: 'historical-timeseries',
  generate: () => generateRealisticTimeSeries(30, 50000, 12000, 'trending-up'),
};

// ============================================================================
// Table Data
// ============================================================================

export const deviceListData: MockDataSource = {
  key: 'device-list',
  name: 'Device List',
  description: 'List of all devices with detailed status and metadata',
  type: 'static-data',
  generate: () => {
    const statuses = ['online', 'offline', 'warning', 'error'];
    const deviceTypes = ['Temperature Sensor', 'HVAC Controller', 'Light Actuator', 'IoT Gateway', 'Motion Sensor', 'Smart Thermostat'];
    const locations = [
      'Floor 1, Lobby',
      'Floor 2, Conference Room A',
      'Floor 2, Office 201',
      'Floor 3, Server Room',
      'Floor 3, Meeting Room B',
      'Floor 4, Executive Suite',
      'Floor 5, Break Room',
      'Basement, Mechanical',
      'Rooftop, HVAC Unit 1',
      'Parking, Level 2'
    ];
    const manufacturers = ['Siemens', 'Honeywell', 'Johnson Controls', 'Schneider Electric', 'Cisco', 'Generic IoT'];

    return Array.from({ length: 25 }, (_, i) => {
      const status = statuses[randomBetween(0, 3)];
      const deviceType = deviceTypes[i % deviceTypes.length];
      const hasBattery = deviceType.includes('Sensor') || deviceType.includes('Motion');

      return {
        id: `DEV-${String(i + 1).padStart(4, '0')}`,
        name: `${deviceType} #${i + 1}`,
        type: deviceType,
        status: status,
        location: locations[i % locations.length],
        manufacturer: manufacturers[randomBetween(0, manufacturers.length - 1)],
        firmwareVersion: `v${randomBetween(1, 3)}.${randomBetween(0, 9)}.${randomBetween(0, 9)}`,
        lastSeen: new Date(Date.now() - randomBetween(0, 7200000)).toISOString(),
        uptime: randomBetween(0, 8640000), // seconds
        battery: hasBattery ? randomBetween(20, 100) : null,
        signal: randomBetween(40, 100),
        ipAddress: `192.168.${randomBetween(1, 10)}.${randomBetween(10, 250)}`,
        macAddress: `00:1B:${randomBetween(10, 99).toString(16)}:${randomBetween(10, 99).toString(16)}:${randomBetween(10, 99).toString(16)}:${randomBetween(10, 99).toString(16)}`.toUpperCase(),
      };
    });
  },
};

export const alertListData: MockDataSource = {
  key: 'alert-list',
  name: 'Alert List',
  description: 'List of system alerts with detailed diagnostic information',
  type: 'alert-stream',
  generate: () => {
    const severities = ['info', 'warning', 'error', 'critical'];
    const alertTemplates = [
      { type: 'Temperature', messages: ['Temperature exceeded threshold', 'Cooling system malfunction', 'Rapid temperature change detected'] },
      { type: 'Power', messages: ['Power fluctuation detected', 'Circuit breaker tripped', 'Voltage irregularity'] },
      { type: 'Security', messages: ['Unauthorized access attempt', 'Door left open', 'Motion detected after hours'] },
      { type: 'Maintenance', messages: ['Scheduled maintenance due', 'Filter replacement required', 'System diagnostics failed'] },
      { type: 'Communication', messages: ['Device offline', 'Network connectivity lost', 'Sensor not responding'] },
      { type: 'HVAC', messages: ['Air quality below normal', 'Fan speed abnormal', 'Humidity control issue'] },
      { type: 'Electrical', messages: ['Power consumption spike', 'Phase imbalance detected', 'Ground fault detected'] },
    ];

    const locations = [
      'Floor 1, Lobby', 'Floor 2, Conference Room A', 'Floor 3, Server Room',
      'Floor 4, Executive Suite', 'Basement, Mechanical', 'Rooftop HVAC',
      'Parking Level 2', 'Zone A-12', 'Zone B-05', 'Main Entrance'
    ];

    return Array.from({ length: 18 }, (_, i) => {
      const template = alertTemplates[randomBetween(0, alertTemplates.length - 1)];
      const severity = severities[randomBetween(0, 3)];
      const message = template.messages[randomBetween(0, template.messages.length - 1)];
      const acknowledged = Math.random() > 0.5;

      return {
        id: `ALT-${String(i + 1).padStart(4, '0')}`,
        severity: severity,
        type: template.type,
        message: message,
        location: locations[randomBetween(0, locations.length - 1)],
        timestamp: new Date(Date.now() - randomBetween(0, 172800000)).toISOString(), // Up to 2 days ago
        acknowledged: acknowledged,
        acknowledgedBy: acknowledged ? `User ${randomBetween(1, 5)}` : null,
        resolvedAt: acknowledged && Math.random() > 0.3 ? new Date(Date.now() - randomBetween(0, 86400000)).toISOString() : null,
        affectedDevices: randomBetween(1, 5),
        priority: severity === 'critical' ? 'high' : severity === 'error' ? 'medium' : 'low',
      };
    });
  },
};

export const maintenanceLogData: MockDataSource = {
  key: 'maintenance-log',
  name: 'Maintenance Log',
  description: 'Detailed maintenance activity history with tracking',
  type: 'static-data',
  generate: () => {
    const activities = ['Annual Inspection', 'Emergency Repair', 'Filter Replacement', 'System Calibration', 'Deep Cleaning', 'Software Update', 'Preventive Maintenance'];
    const statuses = ['completed', 'in-progress', 'scheduled', 'overdue'];
    const equipmentTypes = [
      'HVAC Unit #1', 'Electrical Panel A', 'Chiller System', 'Boiler #2',
      'Fire Suppression System', 'Elevator #3', 'Backup Generator',
      'Water Treatment System', 'Lighting Control Panel', 'Access Control System'
    ];
    const technicians = [
      'John Smith', 'Maria Garcia', 'David Chen', 'Sarah Johnson',
      'Michael Brown', 'Jennifer Lee', 'Robert Taylor', 'Lisa Anderson'
    ];

    return Array.from({ length: 15 }, (_, i) => {
      const status = statuses[randomBetween(0, 3)];
      const activity = activities[randomBetween(0, activities.length - 1)];
      const scheduledDate = new Date(Date.now() + randomBetween(-30, 60) * 86400000);
      const completedDate = status === 'completed' ? new Date(scheduledDate.getTime() + randomBetween(1, 8) * 3600000) : null;

      return {
        id: `MNT-${String(i + 1).padStart(4, '0')}`,
        activity: activity,
        equipment: equipmentTypes[randomBetween(0, equipmentTypes.length - 1)],
        technician: technicians[randomBetween(0, technicians.length - 1)],
        status: status,
        priority: status === 'overdue' || activity.includes('Emergency') ? 'high' : 'normal',
        scheduledDate: scheduledDate.toISOString(),
        completedDate: completedDate ? completedDate.toISOString() : null,
        estimatedDuration: randomBetween(2, 8), // hours
        actualDuration: completedDate ? randomBetween(2, 10) : null,
        cost: randomFloat(150, 3500, 2),
        partsUsed: randomBetween(0, 5),
        notes: status === 'completed' ? 'Maintenance completed successfully' : status === 'overdue' ? 'Requires immediate attention' : '',
        recurringSchedule: activity.includes('Preventive') || activity.includes('Annual') ? 'quarterly' : null,
      };
    });
  },
};

// ============================================================================
// Additional Specialized Data Sources
// ============================================================================

export const waterFlowData: MockDataSource = {
  key: 'water-flow-realtime',
  name: 'Water Flow Rate',
  description: 'Real-time water flow measurements',
  type: 'realtime-sensor',
  generate: () => ({
    flowRate: randomFloat(5, 25, 2), // liters per minute
    pressure: randomFloat(2.5, 4.0, 2), // bar
    temperature: randomFloat(15, 25, 1),
    totalVolume: randomFloat(1000, 50000, 0),
    status: Math.random() > 0.1 ? 'normal' : 'alert',
    lastUpdated: new Date().toISOString(),
  }),
};

export const solarPowerData: MockDataSource = {
  key: 'solar-power-realtime',
  name: 'Solar Power Generation',
  description: 'Real-time solar panel output',
  type: 'realtime-sensor',
  generate: () => {
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour <= 19;
    const peakHours = hour >= 10 && hour <= 15;
    const baseOutput = isDaytime ? (peakHours ? 12 : 6) : 0;
    return {
      currentOutput: randomFloat(baseOutput - 2, baseOutput + 2, 2), // kW
      dailyTotal: randomFloat(45, 95, 1), // kWh
      efficiency: randomFloat(0.85, 0.98, 3),
      panelTemp: randomFloat(25, 55, 1),
      inverterStatus: 'online',
      lastUpdated: new Date().toISOString(),
    };
  },
};

export const batteryStorageData: MockDataSource = {
  key: 'battery-storage-realtime',
  name: 'Battery Storage Status',
  description: 'Battery storage system status',
  type: 'realtime-sensor',
  generate: () => ({
    chargeLevel: randomFloat(20, 95, 1), // percentage
    voltage: randomFloat(47.5, 52.5, 2), // V
    current: randomFloat(-15, 15, 2), // A (negative = discharging)
    temperature: randomFloat(20, 35, 1),
    health: randomFloat(90, 100, 1), // percentage
    cycleCount: randomBetween(50, 500),
    status: Math.random() > 0.9 ? 'charging' : 'idle',
    lastUpdated: new Date().toISOString(),
  }),
};

export const networkTrafficData: MockDataSource = {
  key: 'network-traffic-timeseries',
  name: 'Network Traffic',
  description: 'Network bandwidth usage over time',
  type: 'historical-timeseries',
  generate: () => {
    const now = Date.now();
    return Array.from({ length: 30 }, (_, i) => {
      const hour = new Date(now - (30 - i) * 60000).getHours();
      const isBusinessHours = hour >= 9 && hour <= 17;
      const baseValue = isBusinessHours ? 750 : 200; // Mbps
      return {
        timestamp: now - (30 - i) * 60000,
        value: randomFloat(baseValue - 150, baseValue + 150),
      };
    });
  },
};

export const cpuUsageData: MockDataSource = {
  key: 'cpu-usage-timeseries',
  name: 'CPU Usage',
  description: 'System CPU utilization over time',
  type: 'historical-timeseries',
  generate: () => generateRealisticTimeSeries(60, 45, 25, 'random'),
};

export const memoryUsageData: MockDataSource = {
  key: 'memory-usage-timeseries',
  name: 'Memory Usage',
  description: 'System memory utilization over time',
  type: 'historical-timeseries',
  generate: () => generateRealisticTimeSeries(60, 65, 15, 'trending-up'),
};

// ============================================================================
// Registry of all data sources
// ============================================================================

export const ALL_DATA_SOURCES: MockDataSource[] = [
  // Climate
  temperatureData,
  temperatureTimeSeries,
  humidityData,
  airQualityData,

  // Lighting
  lightingZoneStatus,
  lightingZone,
  lightingEnergyUsage,

  // Electrical
  circuitStatus,
  powerQualityData,
  energyConsumption,

  // HVAC
  hvacUnitStatus,
  hvacEnergyUsage,

  // Charts/Analytics
  deviceCountTimeSeries,
  alertCountTimeSeries,
  occupancyTimeSeries,
  revenueTimeSeries,
  networkTrafficData,
  cpuUsageData,
  memoryUsageData,

  // Energy & Utilities
  waterFlowData,
  solarPowerData,
  batteryStorageData,

  // Tables
  deviceListData,
  alertListData,
  maintenanceLogData,
];

// ============================================================================
// Utility Functions
// ============================================================================

export const getDataSourceByKey = (key: string): MockDataSource | undefined => {
  return ALL_DATA_SOURCES.find(source => source.key === key);
};

export const getDataSourcesByType = (type: DataSourceType): MockDataSource[] => {
  return ALL_DATA_SOURCES.filter(source => source.type === type);
};

export const generateMockData = (dataBindingKey: string): any => {
  const source = getDataSourceByKey(dataBindingKey);
  return source ? source.generate() : null;
};

export const getCompatibleDataSources = (types: DataSourceType[] | string[]): MockDataSource[] => {
  if (types.length === 0) {
    return ALL_DATA_SOURCES;
  }
  return ALL_DATA_SOURCES.filter(source => types.includes(source.type));
};
