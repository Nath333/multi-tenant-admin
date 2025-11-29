import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import frFR from 'antd/locale/fr_FR';
import { ProConfigProvider } from '@ant-design/pro-components';
import { lazy, Suspense } from 'react';
import MainLayout from './layouts/MainLayout';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { ErrorBoundary } from './components/common';
import { AdminOnlyRoute } from './components/routing';

// Core pages
const LoginPage = lazy(() => import('./pages/Login'));
const TenantsPage = lazy(() => import('./pages/Tenants'));
const DevicesPage = lazy(() => import('./pages/Devices'));
const UsersPage = lazy(() => import('./pages/Users'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const AuditLogsPage = lazy(() => import('./pages/AuditLogs'));
const UsagePage = lazy(() => import('./pages/Usage'));

// Page management
const PageManager = lazy(() => import('./pages/PageManager'));
const DynamicPage = lazy(() => import('./pages/DynamicPageWithSync'));

// Test pages
const TestLightingCalendar = lazy(() => import('./pages/TestLightingCalendar'));

function App() {
  const { isAuthenticated } = useAuthStore();
  const { getAlgorithm } = useThemeStore();

  return (
    <ErrorBoundary>
      <ConfigProvider
        locale={frFR}
        theme={{
          algorithm: getAlgorithm(),
          token: {
            colorPrimary: '#667eea',
            colorInfo: '#667eea',
            colorSuccess: '#48bb78',
            colorWarning: '#ed8936',
            colorError: '#f56565',
            borderRadius: 6,
            colorBgContainer: '#ffffff',
            colorBorder: '#e2e8f0',
            colorBorderSecondary: '#e2e8f0',
            fontSize: 13,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontWeightStrong: 600,
            lineHeight: 1.4,
            colorTextBase: '#1a202c',
            colorTextSecondary: '#718096',
            colorBgLayout: '#f8fafc',
          },
          components: {
            Button: {
              borderRadius: 6,
              controlHeight: 32,
              fontWeight: 500,
              primaryShadow: '0 2px 4px -1px rgba(102, 126, 234, 0.2)',
            },
            Card: {
              borderRadiusLG: 8,
              boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              paddingLG: 12,
            },
            Input: {
              borderRadius: 6,
              controlHeight: 32,
              paddingBlock: 4,
              paddingInline: 8,
            },
            Select: {
              borderRadius: 6,
              controlHeight: 32,
            },
            Modal: {
              borderRadiusLG: 8,
              headerBg: '#ffffff',
              contentBg: '#ffffff',
            },
            Tag: {
              borderRadiusSM: 4,
            },
            Table: {
              borderRadius: 8,
              headerBg: '#f8fafc',
              headerSplitColor: '#e2e8f0',
              cellPaddingBlock: 8,
              cellPaddingInline: 12,
            },
            Tabs: {
              itemActiveColor: '#667eea',
              itemSelectedColor: '#667eea',
              inkBarColor: '#667eea',
            },
          },
        }}
      >
        <AntdApp>
          <ProConfigProvider>
            <BrowserRouter>
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/*"
                  element={
                    isAuthenticated ? (
                      <MainLayout>
                        <Routes>
                          <Route path="/" element={<Navigate to="/devices" replace />} />

                          {/* Page management routes */}
                          <Route path="/pages/manage" element={<AdminOnlyRoute><PageManager /></AdminOnlyRoute>} />

                          {/* Test pages */}
                          <Route path="/test-lighting" element={<TestLightingCalendar />} />

                          {/* Core routes */}
                          <Route path="/tenants" element={<AdminOnlyRoute><TenantsPage /></AdminOnlyRoute>} />
                          <Route path="/devices" element={<DevicesPage />} />
                          <Route path="/users" element={<AdminOnlyRoute><UsersPage /></AdminOnlyRoute>} />
                          <Route path="/settings" element={<AdminOnlyRoute><SettingsPage /></AdminOnlyRoute>} />

                          {/* SaaS Feature routes */}
                          <Route path="/audit-logs" element={<AuditLogsPage />} />
                          <Route path="/usage" element={<UsagePage />} />

                          {/* Dynamic custom pages - must be last to avoid conflicting with other routes */}
                          <Route path="/:pagePath" element={<DynamicPage />} />
                        </Routes>
                      </MainLayout>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
              </Routes>
            </Suspense>
            </BrowserRouter>
          </ProConfigProvider>
        </AntdApp>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;
