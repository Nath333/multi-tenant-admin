import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tenant } from '../services/mockData';
import { mockTenants } from '../services/mockData';

interface TenantsState {
  tenants: Tenant[];
  addTenant: (tenant: Omit<Tenant, 'id' | 'createdAt' | 'devices' | 'users' | 'dataUsage'>) => void;
  updateTenant: (id: string, tenant: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  getTenantById: (id: string) => Tenant | undefined;
  toggleTenantStatus: (id: string) => void;
}

export const useTenantsStore = create<TenantsState>()(
  persist(
    (set, get) => ({
      tenants: mockTenants,

      addTenant: (tenantData) => {
        const newTenant: Tenant = {
          ...tenantData,
          id: `tenant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          devices: 0,
          users: 0,
          dataUsage: '0 GB',
        };
        set((state) => ({
          tenants: [...state.tenants, newTenant],
        }));
      },

      updateTenant: (id, tenantData) => {
        set((state) => ({
          tenants: state.tenants.map((tenant) =>
            tenant.id === id ? { ...tenant, ...tenantData } : tenant
          ),
        }));
      },

      deleteTenant: (id) => {
        set((state) => ({
          tenants: state.tenants.filter((tenant) => tenant.id !== id),
        }));
      },

      getTenantById: (id) => {
        return get().tenants.find((tenant) => tenant.id === id);
      },

      toggleTenantStatus: (id) => {
        set((state) => ({
          tenants: state.tenants.map((tenant) =>
            tenant.id === id
              ? {
                  ...tenant,
                  status: tenant.status === 'active' ? 'inactive' : 'active',
                }
              : tenant
          ),
        }));
      },
    }),
    {
      name: 'tenants-storage',
    }
  )
);
