import { ProLayout } from '@ant-design/pro-components';
import { Dropdown, Space, Badge } from 'antd';
import type { MenuDataItem } from '@ant-design/pro-components';
import {
  AppstoreOutlined,
  TeamOutlined,
  MobileOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  SwapOutlined,
  BellOutlined,
  BgColorsOutlined,
  AuditOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { usePagesStore } from '../store/pagesStore';
import { useWidgetStore } from '../store/widgetStore';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useMemo, useCallback } from 'react';
import * as Icons from '@ant-design/icons';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, currentTenant, availableTenants, logout, switchTenant } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();
  const { pages: allPages } = usePagesStore();
  const { refreshWidgetData } = useWidgetStore();
  const isMobile = useIsMobile();

  const handleTenantSwitch = useCallback((tenantId: string) => {
    switchTenant(tenantId);
    refreshWidgetData(tenantId);
  }, [switchTenant, refreshWidgetData]);

  const menuData: MenuDataItem[] = useMemo(() => {
    const baseMenu: MenuDataItem[] = [];

    // Add custom pages - filter enabled pages directly
    const customPages = allPages.filter(page => page.enabled).sort((a, b) => a.order - b.order);
    const customPageMenuItems: MenuDataItem[] = customPages.map((page) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const IconComponent = (Icons as any)[page.icon];
      return {
        path: page.path,
        name: page.name,
        icon: IconComponent ? <IconComponent /> : <AppstoreOutlined />,
      };
    });

    const saasMenu: MenuDataItem[] = [
      {
        path: '/usage',
        name: 'Usage & Quotas',
        icon: <DashboardOutlined />,
      },
      {
        path: '/audit-logs',
        name: 'Audit Logs',
        icon: <AuditOutlined />,
      },
    ];

    const systemMenu: MenuDataItem[] = [
      // Team - Admin only
      ...(user?.role === 'admin' || user?.role === 'superadmin'
        ? [{
            path: '/tenants',
            name: 'Team',
            icon: <TeamOutlined />,
          }]
        : []),
      // Devices - All users
      {
        path: '/devices',
        name: t('menu.devices'),
        icon: <MobileOutlined />,
      },
      // Users - Admin only
      ...(user?.role === 'admin' || user?.role === 'superadmin'
        ? [{
            path: '/users',
            name: t('menu.users'),
            icon: <UserOutlined />,
          }]
        : []),
      // Page Manager - Admin only
      ...(user?.role === 'admin' || user?.role === 'superadmin'
        ? [{
            path: '/pages/manage',
            name: 'Page Manager',
            icon: <AppstoreOutlined />,
          }]
        : []),
      // Settings - Admin only
      ...(user?.role === 'admin' || user?.role === 'superadmin'
        ? [{
            path: '/settings',
            name: t('menu.settings'),
            icon: <SettingOutlined />,
          }]
        : []),
    ];

    return [...baseMenu, ...customPageMenuItems, ...saasMenu, ...systemMenu];
  }, [t, allPages, user]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const tenantMenuItems = useMemo(() => availableTenants.map(tenant => ({
    key: tenant.id,
    label: (
      <div>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{tenant.name}</div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{tenant.domain}</div>
      </div>
    ),
    onClick: () => handleTenantSwitch(tenant.id),
    style: {
      padding: '8px 12px',
      borderRadius: '4px',
    }
  })), [availableTenants, handleTenantSwitch]);

  const userMenuItems = useMemo(() => [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('auth.profile'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('auth.logout'),
      onClick: handleLogout,
    },
  ], [t, handleLogout]);

  return (
    <ProLayout
      logo={
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: 12,
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
          }} />
          <span style={{ position: 'relative', zIndex: 1 }}>IoT</span>
        </div>
      }
      title="IoT Admin Platform"
      headerTitleRender={(logo, title) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer'
        }} onClick={() => navigate('/tenants')}>
          {logo}
          {!isMobile && <span style={{ fontSize: 14, fontWeight: 600 }}>{title}</span>}
        </div>
      )}
      route={{
        path: '/',
        routes: menuData,
      }}
      location={{
        pathname: location.pathname,
      }}
      menuItemRender={(item, dom) => (
        <div onClick={() => item.path && navigate(item.path)}>{dom}</div>
      )}
      avatarProps={{
        src: user?.avatar,
        title: user?.username,
        size: 'default',
        render: (_, dom) => (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              {dom}
              {!isMobile && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>
                    {user?.username}
                  </span>
                  <span style={{ fontSize: 11, opacity: 0.65 }}>
                    {user?.role}
                  </span>
                </div>
              )}
            </div>
          </Dropdown>
        ),
      }}
      actionsRender={() => [
        <div
          key="theme"
          style={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))',
            border: '1px solid rgba(102, 126, 234, 0.15)',
            boxShadow: '0 1px 3px rgba(102, 126, 234, 0.08)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15))';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.2)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(102, 126, 234, 0.08)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          onClick={toggleTheme}
          title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <BgColorsOutlined style={{ fontSize: 14, color: '#667eea' }} />
        </div>,
        !isMobile && (
          <Dropdown
            key="tenant"
            menu={{ items: tenantMenuItems }}
            placement="bottomRight"
          >
            <div
              style={{
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: 6,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.15)',
                boxShadow: '0 1px 3px rgba(102, 126, 234, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.2)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(102, 126, 234, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Space size={4}>
                <SwapOutlined style={{ color: '#667eea', fontSize: 12 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#667eea', letterSpacing: '0.3px' }}>
                  {currentTenant?.name}
                </span>
              </Space>
            </div>
          </Dropdown>
        ),
        <Badge key="notifications" count={5} offset={[-4, 4]} size="small">
          <div
            style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))',
              border: '1px solid rgba(102, 126, 234, 0.15)',
              boxShadow: '0 1px 3px rgba(102, 126, 234, 0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15))';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.2)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(102, 126, 234, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <BellOutlined style={{ fontSize: 14, color: '#667eea' }} />
          </div>
        </Badge>,
      ]}
      {...(isMobile && {
        fixSiderbar: true,
        collapsed: true,
        collapsedButtonRender: false,
      })}
    >
      {children}
    </ProLayout>
  );
}
