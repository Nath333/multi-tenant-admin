import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { mockUsers } from '../services/mockData';

interface UsersState {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'lastLogin'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  getUsersByTenant: (tenantId: string) => User[];
  toggleUserStatus: (id: string) => void;
}

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      users: mockUsers,

      addUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          lastLogin: new Date().toISOString(),
        };
        set((state) => ({
          users: [...state.users, newUser],
        }));
      },

      updateUser: (id, userData) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...userData } : user
          ),
        }));
      },

      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }));
      },

      getUserById: (id) => {
        return get().users.find((user) => user.id === id);
      },

      getUsersByTenant: (tenantId) => {
        return get().users.filter((user) => user.tenantId === tenantId);
      },

      toggleUserStatus: (id) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id
              ? {
                  ...user,
                  status: user.status === 'active' ? 'inactive' : 'active',
                }
              : user
          ),
        }));
      },
    }),
    {
      name: 'users-storage',
    }
  )
);
