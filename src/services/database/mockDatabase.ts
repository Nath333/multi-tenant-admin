/**
 * Mock Database - Simulates PostgreSQL with Multi-Tenant Isolation
 * Uses IndexedDB (via Dexie) to persist data in browser
 * All queries are automatically scoped to tenant context
 */

import Dexie from 'dexie';
import type { Table } from 'dexie';

// Database Types matching PostgreSQL schema
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'free' | 'pro' | 'enterprise' | 'custom';
  subscription_id?: string;
  stripe_customer_id?: string;
  created_at: Date;
  updated_at: Date;
  settings: Record<string, any>; // JSONB
  metadata: Record<string, any>; // JSONB
}

export interface User {
  id: string;
  tenant_id: string;
  username: string;
  email: string;
  password_hash: string;
  role: 'superadmin' | 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  avatar_url?: string;
  last_login_at?: Date;
  last_login_ip?: string;
  created_at: Date;
  updated_at: Date;
  metadata: Record<string, any>; // JSONB
}

export interface Device {
  id: string;
  tenant_id: string;
  name: string;
  device_type: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  location: string;
  last_seen: Date;
  battery_level?: number;
  firmware_version?: string;
  ip_address?: string;
  mac_address?: string;
  created_at: Date;
  updated_at: Date;
  attributes: Record<string, any>; // JSONB - flexible metadata
}

export interface Dashboard {
  id: string;
  tenant_id: string;
  user_id?: string;
  name: string;
  description?: string;
  is_default: boolean;
  is_shared: boolean;
  layout_type: 'grid' | 'flex' | 'custom';
  created_at: Date;
  updated_at: Date;
}

export interface Widget {
  id: string;
  dashboard_id: string;
  tenant_id: string;
  widget_type: string;
  title: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  is_enabled: boolean;
  config: Record<string, any>; // JSONB - widget-specific config
  created_at: Date;
  updated_at: Date;
}

export interface AuditLog {
  id: string;
  tenant_id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  ip_address: string;
  user_agent?: string;
  status: 'success' | 'failure';
  details: Record<string, any>; // JSONB
  created_at: Date;
}

export interface Subscription {
  id: string;
  tenant_id: string;
  plan: 'free' | 'pro' | 'enterprise' | 'custom';
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  current_period_start: Date;
  current_period_end: Date;
  trial_end?: Date;
  cancel_at?: Date;
  canceled_at?: Date;
  stripe_subscription_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Usage {
  id: string;
  tenant_id: string;
  metric_type: 'devices' | 'api_calls' | 'storage' | 'users';
  value: number;
  period_start: Date;
  period_end: Date;
  created_at: Date;
}

export interface ApiKey {
  id: string;
  tenant_id: string;
  user_id: string;
  name: string;
  key_hash: string;
  last_used_at?: Date;
  expires_at?: Date;
  is_active: boolean;
  permissions: string[]; // Array of permission strings
  rate_limit: number;
  created_at: Date;
  updated_at: Date;
}

export interface Webhook {
  id: string;
  tenant_id: string;
  url: string;
  events: string[];
  secret: string;
  is_active: boolean;
  last_triggered_at?: Date;
  failure_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface Permission {
  id: string;
  role: string;
  resource: string;
  actions: string[]; // ['create', 'read', 'update', 'delete']
  conditions?: Record<string, any>; // JSONB
}

// Dexie Database Class
class MockPostgresDB extends Dexie {
  tenants!: Table<Tenant, string>;
  users!: Table<User, string>;
  devices!: Table<Device, string>;
  dashboards!: Table<Dashboard, string>;
  widgets!: Table<Widget, string>;
  audit_logs!: Table<AuditLog, string>;
  subscriptions!: Table<Subscription, string>;
  usage!: Table<Usage, string>;
  api_keys!: Table<ApiKey, string>;
  webhooks!: Table<Webhook, string>;
  permissions!: Table<Permission, string>;

  constructor() {
    super('MockPostgresDB');

    this.version(1).stores({
      tenants: 'id, domain, status, plan, created_at',
      users: 'id, tenant_id, email, username, status, created_at',
      devices: 'id, tenant_id, device_type, status, last_seen',
      dashboards: 'id, tenant_id, user_id, is_default, created_at',
      widgets: 'id, dashboard_id, tenant_id, widget_type, is_enabled',
      audit_logs: 'id, tenant_id, user_id, action, resource_type, created_at',
      subscriptions: 'id, tenant_id, status, current_period_end',
      usage: 'id, tenant_id, metric_type, period_start',
      api_keys: 'id, tenant_id, user_id, is_active, created_at',
      webhooks: 'id, tenant_id, is_active, created_at',
      permissions: 'id, role, resource',
    });
  }
}

// Singleton instance
export const db = new MockPostgresDB();

// Tenant Context - mimics PostgreSQL RLS (Row Level Security)
let currentTenantId: string | null = null;

export const setTenantContext = (tenantId: string | null) => {
  currentTenantId = tenantId;
};

export const getTenantContext = (): string | null => {
  return currentTenantId;
};

// Tenant-scoped query wrapper
export const withTenantScope = async <T extends { tenant_id: string }>(
  table: Table<T, string>,
  operation: (table: Table<T, string>) => Promise<T | T[] | undefined | void>
): Promise<T | T[] | undefined | void> => {
  if (!currentTenantId) {
    throw new Error('Tenant context not set. All queries must be scoped to a tenant.');
  }
  return operation(table);
};

// Helper to filter by tenant
export const byTenant = <T extends { tenant_id: string }>(
  query: Dexie.Collection<T, string>
): Dexie.Collection<T, string> => {
  if (!currentTenantId) {
    throw new Error('Tenant context not set');
  }
  return query.filter(item => item.tenant_id === currentTenantId);
};

// Initialize database with seed data
export const seedDatabase = async () => {
  // Check if already seeded
  const tenantCount = await db.tenants.count();
  if (tenantCount > 0) {
    console.log('Database already seeded');
    return;
  }

  console.log('Seeding mock PostgreSQL database...');

  const now = new Date();

  // Seed Tenants
  const tenants: Tenant[] = [
    {
      id: 'tenant-1',
      name: 'Acme Corporation',
      domain: 'acme.example.com',
      status: 'active',
      plan: 'enterprise',
      stripe_customer_id: 'cus_mock_acme',
      created_at: new Date('2024-01-15'),
      updated_at: now,
      settings: {
        timezone: 'America/New_York',
        language: 'en',
        date_format: 'MM/DD/YYYY',
      },
      metadata: {
        industry: 'Manufacturing',
        employee_count: 500,
      },
    },
    {
      id: 'tenant-2',
      name: 'TechStart Inc',
      domain: 'techstart.example.com',
      status: 'active',
      plan: 'pro',
      stripe_customer_id: 'cus_mock_techstart',
      created_at: new Date('2024-02-20'),
      updated_at: now,
      settings: {
        timezone: 'America/Los_Angeles',
        language: 'en',
        date_format: 'YYYY-MM-DD',
      },
      metadata: {
        industry: 'Technology',
        employee_count: 50,
      },
    },
    {
      id: 'tenant-3',
      name: 'Demo Company',
      domain: 'demo.example.com',
      status: 'active',
      plan: 'free',
      created_at: new Date('2024-03-10'),
      updated_at: now,
      settings: {
        timezone: 'UTC',
        language: 'en',
        date_format: 'DD/MM/YYYY',
      },
      metadata: {
        industry: 'Demo',
        employee_count: 10,
      },
    },
  ];

  await db.tenants.bulkAdd(tenants);

  // Seed Users
  const users: User[] = [
    {
      id: 'user-1',
      tenant_id: 'tenant-1',
      username: 'admin',
      email: 'admin@acme.example.com',
      password_hash: '$2a$10$xQKVvvvvvvvvvvvvvvvvvOxR.KZ8H5xC8xDqQqQqQqQq', // mock hash
      role: 'superadmin',
      status: 'active',
      avatar_url: 'https://i.pravatar.cc/150?u=admin',
      last_login_at: now,
      last_login_ip: '192.168.1.100',
      created_at: new Date('2024-01-15'),
      updated_at: now,
      metadata: {
        department: 'IT',
        title: 'System Administrator',
      },
    },
    {
      id: 'user-2',
      tenant_id: 'tenant-1',
      username: 'john.doe',
      email: 'john.doe@acme.example.com',
      password_hash: '$2a$10$xQKVvvvvvvvvvvvvvvvvvOxR.KZ8H5xC8xDqQqQqQqQq',
      role: 'admin',
      status: 'active',
      created_at: new Date('2024-01-20'),
      updated_at: now,
      metadata: {
        department: 'Operations',
        title: 'Operations Manager',
      },
    },
    {
      id: 'user-3',
      tenant_id: 'tenant-2',
      username: 'jane.smith',
      email: 'jane@techstart.example.com',
      password_hash: '$2a$10$xQKVvvvvvvvvvvvvvvvvvOxR.KZ8H5xC8xDqQqQqQqQq',
      role: 'admin',
      status: 'active',
      created_at: new Date('2024-02-20'),
      updated_at: now,
      metadata: {
        department: 'Engineering',
        title: 'CTO',
      },
    },
  ];

  await db.users.bulkAdd(users);

  // Seed Permissions
  const permissions: Permission[] = [
    { id: 'perm-1', role: 'superadmin', resource: '*', actions: ['*'] },
    { id: 'perm-2', role: 'admin', resource: 'devices', actions: ['create', 'read', 'update', 'delete'] },
    { id: 'perm-3', role: 'admin', resource: 'users', actions: ['create', 'read', 'update'] },
    { id: 'perm-4', role: 'admin', resource: 'dashboards', actions: ['create', 'read', 'update', 'delete'] },
    { id: 'perm-5', role: 'user', resource: 'devices', actions: ['read'] },
    { id: 'perm-6', role: 'user', resource: 'dashboards', actions: ['read'] },
    { id: 'perm-7', role: 'viewer', resource: '*', actions: ['read'] },
  ];

  await db.permissions.bulkAdd(permissions);

  console.log('Database seeded successfully!');
};

// Initialize on import
db.on('ready', () => {
  seedDatabase();
});
