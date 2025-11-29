import { Navigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../utils/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return (
      <div style={{ padding: 48 }}>
        <Result
          status="403"
          title="Access Denied"
          subTitle={`Sorry, you need ${requiredRole} role or higher to access this page.`}
          icon={<LockOutlined style={{ color: '#ff4d4f' }} />}
          extra={
            <Button type="primary" onClick={() => window.history.back()}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

interface AdminOnlyRouteProps {
  children: React.ReactNode;
}

export const AdminOnlyRoute: React.FC<AdminOnlyRouteProps> = ({ children }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Only admins can access
  if (user.role !== 'admin' && user.role !== 'superadmin') {
    return (
      <div style={{ padding: 48 }}>
        <Result
          status="403"
          title="Admin Access Required"
          subTitle="Sorry, only administrators can access this page. Contact your admin to request access."
          icon={<LockOutlined style={{ color: '#ff4d4f', fontSize: 72 }} />}
          extra={
            <Button type="primary" onClick={() => (window.location.href = '/devices')}>
              Go to Dashboard
            </Button>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
};
