import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { UserOutlined, LockOutlined, ApiOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { t } = useTranslation();

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      await login(values.username, values.password);
      message.success(t('auth.loginSuccess'));
      navigate('/dashboard');
    } catch (error) {
      message.error(t('auth.loginFailed'));
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'gridMove 25s linear infinite',
        }}
      />

      {/* Glowing orbs */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float 12s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '10%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float 15s ease-in-out infinite reverse',
        }}
      />

      <div style={{
        maxWidth: '420px',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo & Branding */}
        <div style={{
          textAlign: 'center',
          marginBottom: 40,
          animation: 'fadeInDown 0.6s ease-out',
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            margin: '0 auto 20px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 40px rgba(99, 102, 241, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            position: 'relative',
          }}>
            <ApiOutlined style={{ fontSize: 36, color: 'white' }} />
            <div style={{
              position: 'absolute',
              inset: -3,
              borderRadius: '21px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              opacity: 0.4,
              filter: 'blur(12px)',
              zIndex: -1,
            }} />
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            margin: '0 0 8px',
            background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.5px',
          }}>
            IoT Admin Platform
          </h1>
          <div style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.55)',
            fontWeight: 500,
            letterSpacing: '0.3px',
          }}>
            Enterprise Device Management
          </div>
        </div>

        {/* Login Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '32px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
            animation: 'fadeInUp 0.6s ease-out',
          }}
        >
          <LoginForm
            logo={false}
            title={
              <span style={{
                fontSize: 22,
                fontWeight: 700,
                color: 'white',
                letterSpacing: '-0.3px',
              }}>
                {t('auth.title')}
              </span>
            }
            subTitle={
              <span style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: 14,
                fontWeight: 500,
              }}>
                {t('auth.subtitle')}
              </span>
            }
            onFinish={handleSubmit}
            submitter={{
              searchConfig: {
                submitText: t('auth.signIn') || 'Sign In',
              },
              submitButtonProps: {
                size: 'large',
                style: {
                  width: '100%',
                  height: 44,
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
                  transition: 'all 0.3s ease',
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(99, 102, 241, 0.5)';
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(99, 102, 241, 0.4)';
                },
              },
            }}
          >
            <div style={{ marginBottom: 6 }}>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined style={{ color: '#94a3b8' }} />,
                  style: {
                    borderRadius: 8,
                    height: 44,
                    fontSize: 14,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                  },
                }}
                placeholder={t('auth.usernamePlaceholder')}
                rules={[
                  {
                    required: true,
                    message: t('auth.usernameRequired'),
                  },
                ]}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined style={{ color: '#94a3b8' }} />,
                  style: {
                    borderRadius: 8,
                    height: 44,
                    fontSize: 14,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                  },
                }}
                placeholder={t('auth.passwordPlaceholder')}
                rules={[
                  {
                    required: true,
                    message: t('auth.passwordRequired'),
                  },
                ]}
              />
            </div>
            <div
              style={{
                marginTop: 20,
                padding: 18,
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.08) 100%)',
                borderRadius: 12,
                fontSize: 12,
                border: '1px solid rgba(99, 102, 241, 0.25)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                opacity: 0.6,
              }} />
              <div style={{
                fontWeight: 700,
                marginBottom: 12,
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: 13,
                letterSpacing: '0.3px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <div style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  boxShadow: '0 0 8px rgba(99, 102, 241, 0.6)',
                }} />
                Demo Credentials
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: 8,
                  color: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: 13,
                }}>
                  <span style={{ color: '#a5b4fc', fontWeight: 700 }}>admin</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.4)', margin: '0 6px' }}>•</span>
                  <span style={{ fontSize: 12 }}>Full access</span>
                </div>
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: 8,
                  color: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: 13,
                }}>
                  <span style={{ color: '#a5b4fc', fontWeight: 700 }}>user</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.4)', margin: '0 6px' }}>•</span>
                  <span style={{ fontSize: 12 }}>Standard access</span>
                </div>
                <div style={{
                  marginTop: 4,
                  padding: '8px 12px',
                  background: 'rgba(168, 85, 247, 0.12)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#ddd6fe',
                  fontWeight: 600,
                  textAlign: 'center',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                }}>
                  Password: any password
                </div>
              </div>
            </div>
          </LoginForm>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: 28,
          fontSize: 13,
          color: 'rgba(255, 255, 255, 0.5)',
          animation: 'fadeIn 0.8s ease-out 0.3s backwards',
          fontWeight: 500,
          letterSpacing: '0.5px',
        }}>
          Secure • Scalable • Real-time
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-30px) scale(1.05);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes gridMove {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(40px);
          }
        }

        .ant-input-affix-wrapper,
        .ant-input {
          transition: all 0.3s ease !important;
        }

        .ant-input-affix-wrapper:focus,
        .ant-input-affix-wrapper-focused {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15) !important;
          background: rgba(255, 255, 255, 0.08) !important;
        }

        .ant-input:focus {
          border-color: #6366f1 !important;
          box-shadow: none !important;
        }

        .ant-input::placeholder,
        .ant-input-affix-wrapper input::placeholder {
          color: rgba(148, 163, 184, 0.6) !important;
        }

        .ant-pro-form-login-main {
          padding: 0 !important;
        }

        .ant-pro-form-login-title {
          color: white !important;
        }

        .ant-pro-form-login-desc {
          color: rgba(255, 255, 255, 0.5) !important;
        }
      `}</style>
    </div>
  );
}
