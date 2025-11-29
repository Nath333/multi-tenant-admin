import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Card, Result, Button, Typography } from 'antd';
import { ReloadOutlined, CloseOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

interface Props {
  children: ReactNode;
  widgetTitle?: string;
  onRemove?: () => void;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary specifically designed for widgets
 *
 * Catches errors in widget components and displays a user-friendly fallback
 * without crashing the entire application.
 */
class WidgetErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Widget Error:', error, {
        component: 'WidgetErrorBoundary',
        widgetTitle: this.props.widgetTitle,
        errorInfo: errorInfo.componentStack,
      });
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleRemove = () => {
    if (this.props.onRemove) {
      this.props.onRemove();
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Card
          style={{
            height: '100%',
            borderColor: '#ff4d4f',
            backgroundColor: '#fff2f0',
          }}
          styles={{
            body: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '24px',
            }
          }}
        >
          <Result
            status="error"
            title={
              <span style={{ fontSize: 16 }}>
                {this.props.widgetTitle || 'Widget'} Error
              </span>
            }
            subTitle={
              <div style={{ fontSize: 13 }}>
                <Paragraph>
                  This widget encountered an error and could not be displayed.
                </Paragraph>
                {import.meta.env.DEV && this.state.error && (
                  <details style={{ marginTop: 12, textAlign: 'left' }}>
                    <summary style={{ cursor: 'pointer', marginBottom: 8 }}>
                      <Text type="secondary">Technical Details</Text>
                    </summary>
                    <pre
                      style={{
                        fontSize: 11,
                        background: '#f5f5f5',
                        padding: 12,
                        borderRadius: 4,
                        overflow: 'auto',
                        maxHeight: 200,
                      }}
                    >
                      {this.state.error.toString()}
                      {this.state.errorInfo && (
                        <div style={{ marginTop: 8 }}>
                          {this.state.errorInfo.componentStack}
                        </div>
                      )}
                    </pre>
                  </details>
                )}
              </div>
            }
            extra={[
              <Button
                key="retry"
                type="primary"
                size="small"
                icon={<ReloadOutlined />}
                onClick={this.handleReset}
              >
                Retry
              </Button>,
              this.props.onRemove && (
                <Button
                  key="remove"
                  size="small"
                  danger
                  icon={<CloseOutlined />}
                  onClick={this.handleRemove}
                >
                  Remove Widget
                </Button>
              ),
            ]}
          />
        </Card>
      );
    }

    return this.props.children;
  }
}

export default WidgetErrorBoundary;
