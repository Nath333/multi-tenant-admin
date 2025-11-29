/**
 * Mock SaaS Data - Simple mock data for SaaS features
 * Focus: Audit logs, Usage tracking
 */

// Only export data that's actively used in the application

export const mockPlans = [
  {
    id: 'free',
    name: 'Free',
    features: {
      maxDevices: 10,
      maxUsers: 3,
      maxApiCalls: 1000,
      apiAccess: false,
      webhooks: false,
      auditLogs: false,
    },
  },
  {
    id: 'pro',
    name: 'Professional',
    features: {
      maxDevices: 100,
      maxUsers: 20,
      maxApiCalls: 50000,
      apiAccess: true,
      webhooks: true,
      auditLogs: true,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    features: {
      maxDevices: -1, // unlimited
      maxUsers: -1,
      maxApiCalls: -1,
      apiAccess: true,
      webhooks: true,
      auditLogs: true,
    },
  },
];

export const mockAuditLogs = [
  {
    id: 'log-1',
    timestamp: '2024-11-25T14:30:00Z',
    user: 'admin@acme.com',
    action: 'device.created',
    resource: 'Device #1234',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Created new temperature sensor',
  },
  {
    id: 'log-2',
    timestamp: '2024-11-25T14:25:00Z',
    user: 'john.doe@acme.com',
    action: 'user.updated',
    resource: 'User #5678',
    ip: '192.168.1.105',
    status: 'success',
    details: 'Updated user permissions',
  },
  {
    id: 'log-3',
    timestamp: '2024-11-25T14:20:00Z',
    user: 'admin@acme.com',
    action: 'apikey.created',
    resource: 'API Key',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Generated new production API key',
  },
  {
    id: 'log-4',
    timestamp: '2024-11-25T14:15:00Z',
    user: 'jane.smith@acme.com',
    action: 'dashboard.updated',
    resource: 'Dashboard #main',
    ip: '192.168.1.110',
    status: 'success',
    details: 'Modified dashboard layout',
  },
  {
    id: 'log-5',
    timestamp: '2024-11-25T14:10:00Z',
    user: 'admin@acme.com',
    action: 'webhook.created',
    resource: 'Webhook #webhook-1',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Created device event webhook',
  },
];

export const mockUsageData = {
  devices: { current: 45, limit: 100 },
  users: { current: 8, limit: 20 },
  apiCalls: { current: 12450, limit: 50000 },
  storage: { current: 2.3, limit: 10 },
};

export const mockApiCallsHistory = [
  { date: '2024-11-19', calls: 1850 },
  { date: '2024-11-20', calls: 2100 },
  { date: '2024-11-21', calls: 1920 },
  { date: '2024-11-22', calls: 2350 },
  { date: '2024-11-23', calls: 1680 },
  { date: '2024-11-24', calls: 1450 },
  { date: '2024-11-25', calls: 1100 },
];
