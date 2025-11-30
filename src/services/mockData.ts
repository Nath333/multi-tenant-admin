// Professional mock data service for the IoT admin platform
import { getDefaultConfig } from '../components/widgets/v2/registry/widgetDefinitions';
import type { Device, Tenant, User } from '../types';

// Re-export types for backward compatibility
export type { Device, Tenant, User } from '../types';

// Generate realistic device data with tenant-specific assignments
export const mockDevices: Device[] = [
  // Tenant 1 (tenant1) - Acme Corporation devices
  {
    id: 'dev-t1-001',
    name: 'Temperature Sensor A1',
    type: 'sensor',
    status: 'online',
    location: 'Acme HQ - Floor 1 - Room 101',
    lastSeen: '2 mins ago',
    battery: 87,
    firmware: '2.3.1',
    model: 'TS-2000',
    serialNumber: 'SN-TS-2000-001',
    temperature: 22.5,
    humidity: 45,
    signal: 95,
    tenantId: 'tenant1',
  },
  {
    id: 'dev-t1-002',
    name: 'Smart Gateway G1',
    type: 'gateway',
    status: 'online',
    location: 'Acme HQ - Floor 2 - Server Room',
    lastSeen: '1 min ago',
    battery: 100,
    firmware: '3.1.0',
    model: 'GW-5000',
    serialNumber: 'SN-GW-5000-001',
    signal: 98,
    tenantId: 'tenant1',
  },
  {
    id: 'dev-t1-003',
    name: 'Motion Detector M12',
    type: 'sensor',
    status: 'offline',
    location: 'Acme HQ - Floor 1 - Hallway',
    lastSeen: '2 hours ago',
    battery: 18,
    firmware: '2.0.5',
    model: 'MD-100',
    serialNumber: 'SN-MD-100-012',
    signal: 0,
    tenantId: 'tenant1',
  },
  {
    id: 'dev-t1-004',
    name: 'Smart Lock SL-05',
    type: 'actuator',
    status: 'online',
    location: 'Acme HQ - Main Entrance',
    lastSeen: '5 mins ago',
    battery: 68,
    firmware: '1.8.2',
    model: 'SL-300',
    serialNumber: 'SN-SL-300-005',
    signal: 89,
    tenantId: 'tenant1',
  },
  {
    id: 'dev-t1-005',
    name: 'Environmental Sensor E7',
    type: 'sensor',
    status: 'online',
    location: 'Acme HQ - Floor 3 - Lab',
    lastSeen: '3 mins ago',
    battery: 91,
    firmware: '2.4.0',
    model: 'ENV-2500',
    serialNumber: 'SN-ENV-2500-007',
    temperature: 21.8,
    humidity: 52,
    signal: 94,
    tenantId: 'tenant1',
  },

  // Tenant 2 (tenant2) - TechVision Industries devices
  {
    id: 'dev-t2-001',
    name: 'Security Camera C01',
    type: 'camera',
    status: 'online',
    location: 'Tech Startup Office - Entrance',
    lastSeen: '5 mins ago',
    battery: 85,
    firmware: '4.2.1',
    model: 'CAM-HD-1080',
    serialNumber: 'SN-CAM-HD-101',
    signal: 92,
    tenantId: 'tenant2',
  },
  {
    id: 'dev-t2-002',
    name: 'Smart Thermostat T1',
    type: 'actuator',
    status: 'online',
    location: 'Tech Startup Office - Main Hall',
    lastSeen: '1 min ago',
    battery: 95,
    firmware: '1.9.0',
    model: 'THERMO-500',
    serialNumber: 'SN-THERMO-101',
    temperature: 23.2,
    signal: 88,
    tenantId: 'tenant2',
  },
  {
    id: 'dev-t2-003',
    name: 'Door Sensor D25',
    type: 'sensor',
    status: 'online',
    location: 'Tech Startup Office - Conference Room',
    lastSeen: '10 mins ago',
    battery: 72,
    firmware: '2.1.3',
    model: 'DS-50',
    serialNumber: 'SN-DS-50-125',
    signal: 86,
    tenantId: 'tenant2',
  },
  {
    id: 'dev-t2-004',
    name: 'Air Quality Monitor AQ1',
    type: 'sensor',
    status: 'warning',
    location: 'Tech Startup Office - Open Space',
    lastSeen: '30 mins ago',
    battery: 45,
    firmware: '2.5.1',
    model: 'AQ-1000',
    serialNumber: 'SN-AQ-1000-001',
    temperature: 24.1,
    humidity: 58,
    signal: 79,
    tenantId: 'tenant2',
  },

  // Tenant 3 (tenant3) - SmartHome Solutions devices
  {
    id: 'dev-t3-001',
    name: 'Water Leak Detector W1',
    type: 'sensor',
    status: 'online',
    location: 'Demo Building - Basement',
    lastSeen: '8 mins ago',
    battery: 78,
    firmware: '1.7.2',
    model: 'WL-200',
    serialNumber: 'SN-WL-200-001',
    signal: 84,
    tenantId: 'tenant3',
  },
  {
    id: 'dev-t3-002',
    name: 'Smart Gateway G5',
    type: 'gateway',
    status: 'online',
    location: 'Demo Building - IT Room',
    lastSeen: '2 mins ago',
    battery: 100,
    firmware: '3.2.0',
    model: 'GW-5000',
    serialNumber: 'SN-GW-5000-205',
    signal: 99,
    tenantId: 'tenant3',
  },
  {
    id: 'dev-t3-003',
    name: 'Occupancy Sensor O12',
    type: 'sensor',
    status: 'online',
    location: 'Demo Building - Meeting Room A',
    lastSeen: '4 mins ago',
    battery: 89,
    firmware: '2.2.0',
    model: 'OCC-300',
    serialNumber: 'SN-OCC-300-012',
    signal: 91,
    tenantId: 'tenant3',
  },
];

// Generate realistic tenant data
export const mockTenants: Tenant[] = [
  {
    id: 'tenant1',
    name: 'Acme Corporation',
    domain: 'acme.iot.local',
    status: 'active',
    plan: 'enterprise',
    createdAt: '2024-01-15',
    devices: 247,
    users: 45,
    dataUsage: '2.4 TB',
  },
  {
    id: 'tenant2',
    name: 'TechVision Industries',
    domain: 'techvision.iot.local',
    status: 'active',
    plan: 'pro',
    createdAt: '2024-02-20',
    devices: 89,
    users: 12,
    dataUsage: '850 GB',
  },
  {
    id: 'tenant3',
    name: 'SmartHome Solutions',
    domain: 'smarthome.iot.local',
    status: 'active',
    plan: 'pro',
    createdAt: '2024-03-10',
    devices: 156,
    users: 23,
    dataUsage: '1.2 TB',
  },
  {
    id: 'tenant4',
    name: 'GreenEnergy Systems',
    domain: 'greenenergy.iot.local',
    status: 'active',
    plan: 'enterprise',
    createdAt: '2024-01-28',
    devices: 312,
    users: 67,
    dataUsage: '3.8 TB',
  },
  {
    id: 'tenant5',
    name: 'Urban Analytics',
    domain: 'urban.iot.local',
    status: 'active',
    plan: 'free',
    createdAt: '2024-04-05',
    devices: 24,
    users: 5,
    dataUsage: '120 GB',
  },
  {
    id: 'tenant6',
    name: 'SecureNet Ltd',
    domain: 'securenet.iot.local',
    status: 'suspended',
    plan: 'pro',
    createdAt: '2024-02-14',
    devices: 67,
    users: 8,
    dataUsage: '450 GB',
  },
];

// Generate realistic user data
export const mockUsers: User[] = [
  {
    id: 'user-001',
    username: 'john.anderson',
    name: 'John Anderson',
    email: 'john.anderson@acme.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-11-24 10:30',
    tenantId: 'tenant1',
    phone: '+1 (555) 123-4567',
    department: 'Operations',
  },
  {
    id: 'user-002',
    username: 'sarah.chen',
    name: 'Sarah Chen',
    email: 'sarah.chen@acme.com',
    role: 'user',
    status: 'active',
    lastLogin: '2024-11-24 09:15',
    tenantId: 'tenant1',
    phone: '+1 (555) 234-5678',
    department: 'Engineering',
  },
  {
    id: 'user-003',
    username: 'michael.torres',
    name: 'Michael Torres',
    email: 'michael.torres@techvision.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-11-23 16:45',
    tenantId: 'tenant2',
    phone: '+1 (555) 345-6789',
    department: 'IT',
  },
  {
    id: 'user-004',
    username: 'emily.watson',
    name: 'Emily Watson',
    email: 'emily.watson@smarthome.com',
    role: 'user',
    status: 'active',
    lastLogin: '2024-11-24 08:20',
    tenantId: 'tenant3',
    phone: '+1 (555) 456-7890',
    department: 'Customer Success',
  },
  {
    id: 'user-005',
    username: 'david.kim',
    name: 'David Kim',
    email: 'david.kim@greenenergy.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-11-24 11:05',
    tenantId: 'tenant4',
    phone: '+1 (555) 567-8901',
    department: 'Operations',
  },
  {
    id: 'user-006',
    username: 'lisa.rodriguez',
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@acme.com',
    role: 'user',
    status: 'inactive',
    lastLogin: '2024-11-20 14:30',
    tenantId: 'tenant1',
    phone: '+1 (555) 678-9012',
    department: 'Engineering',
  },
  {
    id: 'user-007',
    username: 'alex.johnson',
    name: 'Alex Johnson',
    email: 'alex.johnson@acme.com',
    role: 'page-manager',
    status: 'active',
    lastLogin: '2024-11-24 12:15',
    tenantId: 'tenant1',
    phone: '+1 (555) 789-0123',
    department: 'UX Design',
  },
  {
    id: 'user-008',
    username: 'maria.garcia',
    name: 'Maria Garcia',
    email: 'maria.garcia@techvision.com',
    role: 'page-manager',
    status: 'active',
    lastLogin: '2024-11-24 10:45',
    tenantId: 'tenant2',
    phone: '+1 (555) 890-1234',
    department: 'Product Management',
  },
];

// ==================== DATA CACHING LAYER ====================
// Simple in-memory cache to prevent redundant filtering and generation

// Simple cache using Map
const devicesByTenantCache = new Map<string, Device[]>();
const usersByTenantCache = new Map<string, User[]>();
const chartDataCache = new Map<string, any[]>();
const widgetMockDataCache = new Map<string, any>();

// Helper functions to get tenant-specific data with caching
export const getDevicesByTenant = (tenantId: string): Device[] => {
  // Check cache first
  if (devicesByTenantCache.has(tenantId)) {
    return devicesByTenantCache.get(tenantId)!;
  }

  // Filter and cache
  const filtered = mockDevices.filter(device => device.tenantId === tenantId);
  devicesByTenantCache.set(tenantId, filtered);
  return filtered;
};

export const getUsersByTenant = (tenantId: string): User[] => {
  // Check cache first
  if (usersByTenantCache.has(tenantId)) {
    return usersByTenantCache.get(tenantId)!;
  }

  // Filter and cache
  const filtered = mockUsers.filter(user => user.tenantId === tenantId);
  usersByTenantCache.set(tenantId, filtered);
  return filtered;
};

// Generate time-series data for charts (tenant-specific) with caching
export const generateChartData = (days: number = 7, tenantId?: string) => {
  const cacheKey = `${days}-${tenantId || 'all'}`;

  // Check cache first
  if (chartDataCache.has(cacheKey)) {
    return chartDataCache.get(cacheKey)!;
  }

  const data = [];
  const now = new Date();

  // Base multiplier based on tenant
  const baseMultiplier = tenantId === 'tenant1' ? 1.5 : tenantId === 'tenant2' ? 0.8 : 1;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      devices: Math.floor((Math.random() * 200 + 300) * baseMultiplier),
      alerts: Math.floor((Math.random() * 30 + 5) * baseMultiplier),
      dataUsage: Math.floor((Math.random() * 150 + 50) * baseMultiplier),
    });
  }

  // Cache the generated data
  chartDataCache.set(cacheKey, data);
  return data;
};

// Generate recent activities (tenant-specific)
export const generateRecentActivities = (tenantId?: string) => {
  const tenantDevices = tenantId ? getDevicesByTenant(tenantId) : mockDevices.slice(0, 5);
  const tenantUsers = tenantId ? getUsersByTenant(tenantId) : mockUsers.slice(0, 3);

  const activities = [
    {
      time: '2 minutes ago',
      action: 'Device connected',
      device: tenantDevices[0]?.name || 'Device',
      type: 'success',
      user: 'System',
    },
    {
      time: '15 minutes ago',
      action: 'Alert triggered: High temperature',
      device: tenantDevices[1]?.name || 'Device',
      type: 'warning',
      user: 'System',
    },
    {
      time: '1 hour ago',
      action: 'User logged in',
      device: 'Admin Portal',
      type: 'info',
      user: tenantUsers[0]?.name || 'User',
    },
    {
      time: '2 hours ago',
      action: 'Device offline',
      device: tenantDevices[2]?.name || 'Device',
      type: 'error',
      user: 'System',
    },
    {
      time: '3 hours ago',
      action: 'Firmware updated',
      device: tenantDevices[0]?.name || 'Device',
      type: 'success',
      user: tenantUsers[1]?.name || 'User',
    },
  ];

  return activities.filter(a => a.device !== 'Device');
};

// Dashboard statistics (tenant-specific)
export const getDashboardStats = (tenantId?: string) => {
  const tenantDevices = tenantId ? getDevicesByTenant(tenantId) : mockDevices;
  const tenantUsers = tenantId ? getUsersByTenant(tenantId) : mockUsers;
  const activeDevices = tenantDevices.filter(d => d.status === 'online').length;
  const activeUsers = tenantUsers.filter(u => u.status === 'active').length;

  // Different stats based on tenant
  const statsMap: Record<string, any> = {
    'tenant1': {
      totalDevices: { value: tenantDevices.length, trend: 12.5, comparedToLastMonth: `+2 devices` },
      activeUsers: { value: activeUsers, trend: 8.2, comparedToLastMonth: `+1 users` },
      alerts: { value: 5, trend: -15.4, comparedToLastMonth: '-1 alerts' },
      revenue: { value: '$25,234', trend: 15.3, comparedToLastMonth: '+$2,820' },
      dataUsage: { value: '4.2 TB', trend: 18.5, comparedToLastMonth: '+0.8 TB' },
      uptime: { value: '99.98%', trend: 0.05, comparedToLastMonth: '+0.03%' },
    },
    'tenant2': {
      totalDevices: { value: tenantDevices.length, trend: 8.3, comparedToLastMonth: `+1 devices` },
      activeUsers: { value: activeUsers, trend: -2.5, comparedToLastMonth: `0 users` },
      alerts: { value: 8, trend: 25.4, comparedToLastMonth: '+2 alerts' },
      revenue: { value: '$12,450', trend: 10.2, comparedToLastMonth: '+$1,150' },
      dataUsage: { value: '1.8 TB', trend: 15.8, comparedToLastMonth: '+0.3 TB' },
      uptime: { value: '99.92%', trend: -0.02, comparedToLastMonth: '-0.01%' },
    },
    'tenant3': {
      totalDevices: { value: tenantDevices.length, trend: 5.1, comparedToLastMonth: `+1 devices` },
      activeUsers: { value: activeUsers, trend: 0, comparedToLastMonth: `0 users` },
      alerts: { value: 2, trend: -50, comparedToLastMonth: '-2 alerts' },
      revenue: { value: '$8,120', trend: 7.5, comparedToLastMonth: '+$580' },
      dataUsage: { value: '950 GB', trend: 12.3, comparedToLastMonth: '+100 GB' },
      uptime: { value: '99.95%', trend: 0.01, comparedToLastMonth: '0%' },
    },
  };

  return tenantId && statsMap[tenantId] ? statsMap[tenantId] : {
    totalDevices: { value: tenantDevices.length, trend: 12.5, comparedToLastMonth: `+${Math.floor(tenantDevices.length * 0.1)} devices` },
    activeUsers: { value: activeUsers, trend: -5.2, comparedToLastMonth: `+${Math.floor(activeUsers * 0.05)} users` },
    alerts: { value: activeDevices, trend: 8.4, comparedToLastMonth: '+2 alerts' },
    revenue: { value: '$45,234', trend: 15.3, comparedToLastMonth: '+$5,820' },
    dataUsage: { value: '8.4 TB', trend: 22.1, comparedToLastMonth: '+1.5 TB' },
    uptime: { value: '99.97%', trend: 0.03, comparedToLastMonth: '+0.02%' },
  };
};

// Generate mock data for any widget type (with caching for performance)
export const getWidgetMockData = (widgetType: string, tenantId?: string) => {
  const cacheKey = `${widgetType}-${tenantId || 'default'}`;

  // Check cache first (except for random/dynamic data)
  const shouldCache = !['stats', 'hvac-control', 'climate-control', 'alerts'].includes(widgetType);
  if (shouldCache && widgetMockDataCache.has(cacheKey)) {
    return widgetMockDataCache.get(cacheKey)!;
  }

  let data;
  switch (widgetType) {
    case 'stats':
      return {
        value: Math.floor(Math.random() * 1000) + 100,
        trend: (Math.random() * 40) - 20, // -20 to +20
        comparedToLastMonth: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 50)} units`,
      };

    case 'chart':
      return generateChartData(7, tenantId);

    case 'device-status':
      return getDevicesByTenant(tenantId || 'tenant1');

    case 'recent-activity':
      return generateRecentActivities(tenantId);

    case 'table':
      return getDevicesByTenant(tenantId || 'tenant1').slice(0, 5);

    // BMS Control Widgets
    case 'hvac-control':
    case 'climate-control':
      return {
        temperature: Math.floor(Math.random() * 10) + 18, // 18-28°C
        humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
        airQuality: Math.floor(Math.random() * 50) + 50, // 50-100 AQI
        mode: ['auto', 'heating', 'cooling', 'fan'][Math.floor(Math.random() * 4)],
        fanSpeed: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        setPoint: 22,
        zones: [
          { name: 'Floor 1', temp: 21, status: 'active' },
          { name: 'Floor 2', temp: 23, status: 'active' },
          { name: 'Floor 3', temp: 22, status: 'standby' }
        ]
      };

    case 'lighting-control':
      return {
        zones: [
          { name: 'Lobby', brightness: 85, status: 'on', power: 1.2 },
          { name: 'Office A', brightness: 70, status: 'on', power: 0.8 },
          { name: 'Office B', brightness: 60, status: 'on', power: 0.7 },
          { name: 'Parking', brightness: 40, status: 'on', power: 0.5 },
          { name: 'Corridor', brightness: 0, status: 'off', power: 0 }
        ],
        totalPower: 3.2,
        energySaved: 24.5,
        schedule: 'Auto Mode',
        occupancy: 68
      };

    case 'energy-control':
      return {
        currentUsage: (Math.random() * 50 + 150).toFixed(1), // kW
        todayUsage: (Math.random() * 500 + 2000).toFixed(0), // kWh
        cost: `$${(Math.random() * 200 + 300).toFixed(2)}`,
        peakDemand: (Math.random() * 30 + 180).toFixed(1),
        efficiency: (Math.random() * 10 + 85).toFixed(1),
        renewablePercent: (Math.random() * 30 + 10).toFixed(1),
        hourlyData: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          usage: Math.random() * 200 + 100
        }))
      };

    case 'security-control':
      return {
        accessPoints: [
          { name: 'Main Entrance', status: 'active', alerts: 0 },
          { name: 'Side Door', status: 'active', alerts: 1 },
          { name: 'Parking Gate', status: 'active', alerts: 0 },
          { name: 'Roof Access', status: 'locked', alerts: 0 }
        ],
        cameras: { online: 12, offline: 1, total: 13 },
        alarms: { active: 2, resolved: 8, total: 10 },
        lastIncident: '2 hours ago',
        securityLevel: 'High'
      };

    // Monitoring & Analytics
    case 'system-health':
      return {
        overallHealth: Math.floor(Math.random() * 15 + 85), // 85-100%
        systems: [
          { name: 'HVAC', status: 'healthy', score: 95 },
          { name: 'Lighting', status: 'healthy', score: 98 },
          { name: 'Security', status: 'warning', score: 78 },
          { name: 'Energy', status: 'healthy', score: 92 },
          { name: 'Network', status: 'healthy', score: 96 }
        ],
        uptime: '99.97%',
        lastMaintenance: '3 days ago'
      };

    case 'performance-metrics':
      return {
        metrics: [
          { label: 'Energy Efficiency', value: 87, target: 85, unit: '%' },
          { label: 'Space Utilization', value: 72, target: 75, unit: '%' },
          { label: 'System Uptime', value: 99.8, target: 99.5, unit: '%' },
          { label: 'Cost Savings', value: 18.5, target: 15, unit: '%' },
          { label: 'Occupant Comfort', value: 4.2, target: 4.0, unit: '/5' }
        ],
        trend: 'improving'
      };

    case 'analytics':
      return {
        insights: [
          'Peak energy usage occurs between 2-4 PM',
          'HVAC efficiency improved 12% this month',
          'Lighting automation saved $1,240 in energy costs'
        ],
        predictions: [
          'Estimated 8% cost reduction next quarter',
          'Recommended maintenance for Unit 3 in 2 weeks'
        ],
        chartData: generateChartData(30, tenantId)
      };

    case 'user-activity-heatmap':
      return {
        data: Array.from({ length: 24 }, (_, hour) =>
          Array.from({ length: 7 }, (_, day) => ({
            hour,
            day,
            value: Math.floor(Math.random() * 100)
          }))
        ).flat(),
        peakHours: ['9:00 AM', '2:00 PM', '5:00 PM'],
        utilization: 68
      };

    // Infrastructure
    case 'alerts':
      return {
        critical: Math.floor(Math.random() * 3),
        warning: Math.floor(Math.random() * 8) + 2,
        info: Math.floor(Math.random() * 15) + 5,
        alerts: [
          { type: 'critical', message: 'HVAC Unit 2 high temperature', time: '5 min ago' },
          { type: 'warning', message: 'Lighting zone offline', time: '15 min ago' },
          { type: 'warning', message: 'High energy consumption detected', time: '1 hour ago' },
          { type: 'info', message: 'Scheduled maintenance reminder', time: '2 hours ago' }
        ]
      };

    case 'map':
      return {
        floors: 3,
        zones: 12,
        devices: getDevicesByTenant(tenantId || 'tenant1').length,
        alerts: 3,
        floorPlans: [
          { floor: 1, devices: 24, alerts: 1 },
          { floor: 2, devices: 18, alerts: 2 },
          { floor: 3, devices: 15, alerts: 0 }
        ]
      };

    case 'storage-analytics':
      return {
        used: (Math.random() * 400 + 100).toFixed(1), // GB
        total: 500,
        retention: '90 days',
        growthRate: '+12% per month',
        categories: [
          { name: 'Sensor Data', size: 180, percent: 36 },
          { name: 'Video Footage', size: 150, percent: 30 },
          { name: 'Logs', size: 80, percent: 16 },
          { name: 'Other', size: 90, percent: 18 }
        ]
      };

    case 'api-usage':
      return {
        requests: Math.floor(Math.random() * 5000) + 10000,
        quota: 50000,
        responseTime: (Math.random() * 50 + 100).toFixed(0), // ms
        errorRate: (Math.random() * 2).toFixed(2), // %
        endpoints: [
          { name: '/api/devices', calls: 5420, avgTime: 145 },
          { name: '/api/sensors', calls: 3280, avgTime: 98 },
          { name: '/api/alerts', calls: 1850, avgTime: 76 }
        ]
      };

    case 'revenue-dashboard':
      return {
        revenue: `$${(Math.random() * 20000 + 30000).toFixed(0)}`,
        costs: `$${(Math.random() * 10000 + 15000).toFixed(0)}`,
        savings: `$${(Math.random() * 5000 + 8000).toFixed(0)}`,
        roi: (Math.random() * 15 + 12).toFixed(1), // %
        breakdown: [
          { category: 'Energy Costs', amount: 12500, trend: -8.5 },
          { category: 'Maintenance', amount: 4200, trend: -2.1 },
          { category: 'Operations', amount: 8900, trend: 3.2 }
        ]
      };

    // V2 Configurable Widgets - use default configurations from widget definitions
    case 'chart-v2':
    case 'data-table-v2':
    case 'lighting-control-v2':
    case 'hvac-control-v2':
    case 'electrical-panel-v2':
      return getDefaultConfig(widgetType);

    default:
      data = {};
  }

  // Cache the result if applicable
  if (shouldCache && data) {
    widgetMockDataCache.set(cacheKey, data);
  }

  return data;
};
