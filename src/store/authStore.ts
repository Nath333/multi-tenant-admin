import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Tenant, UserRole } from '../types';

// Re-export types for backwards compatibility
export type { User, Tenant };

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  currentTenant: Tenant | null;
  availableTenants: Tenant[];
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  switchTenant: (tenantId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      currentTenant: null,
      availableTenants: [],

      login: async (username: string, _password: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockTenants: Tenant[] = [
          {
            id: 'tenant1',
            name: 'Acme Corporation',
            domain: 'acme.example.com',
            status: 'active',
            plan: 'enterprise',
            createdAt: '2024-01-15',
          },
          {
            id: 'tenant2',
            name: 'Tech Startup Inc',
            domain: 'techstartup.example.com',
            status: 'active',
            plan: 'pro',
            createdAt: '2024-02-20',
          },
          {
            id: 'tenant3',
            name: 'Demo Company',
            domain: 'demo.example.com',
            status: 'active',
            plan: 'free',
            createdAt: '2024-03-10',
          },
        ];

        // Determine role based on username
        let role: UserRole = 'user';
        if (username === 'admin') {
          role = 'admin';
        } else if (username === 'superadmin') {
          role = 'superadmin';
        } else if (username === 'user') {
          role = 'user';
        } else if (username === 'viewer') {
          role = 'user'; // viewer will have limited permissions
        }

        const mockUser: User = {
          id: 'user1',
          username,
          email: `${username}@example.com`,
          role,
          tenantId: mockTenants[0].id,
          status: 'active',
        };

        set({
          isAuthenticated: true,
          user: mockUser,
          currentTenant: mockTenants[0],
          availableTenants: mockTenants,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          currentTenant: null,
          availableTenants: [],
        });
      },

      switchTenant: (tenantId: string) => {
        set((state) => {
          const tenant = state.availableTenants.find(t => t.id === tenantId);
          return {
            currentTenant: tenant || state.currentTenant,
          };
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
