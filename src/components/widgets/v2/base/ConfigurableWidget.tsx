/**
 * ConfigurableWidget - Base component for all smart widgets
 * Provides built-in configuration panel and common functionality
 */

import { useState, memo } from 'react';
import { Card, Button, Drawer, Space, Tooltip } from 'antd';
import {
  SettingOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useAutoResize } from '../hooks/useAutoResize';
import type { ConfigurableWidgetProps } from '../types/ConfigurableWidget.types';
import './ConfigurableWidget.css';

interface ConfigurableWidgetBaseProps<T> extends ConfigurableWidgetProps<T> {
  children: React.ReactNode;
  configPanel?: React.ReactNode;
  renderConfigPanel?: (props: { config: T; onChange: (newConfig: T) => void; onClose: () => void }) => React.ReactNode;
  onRefresh?: () => void;
  loading?: boolean;
  showConfigButton?: boolean;
}

function ConfigurableWidgetBase<T>({
  id,
  title,
  onRemove,
  onResize,
  currentSize,
  widgetType,
  editMode = false,
  className = '',
  style = {},
  children,
  configPanel,
  renderConfigPanel,
  onRefresh,
  loading = false,
  showConfigButton = true,
  enableAutoResize = true,
  config,
  onConfigChange,
}: ConfigurableWidgetBaseProps<T>) {
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-resize when configuration changes
  useAutoResize({
    widgetId: id,
    widgetType: widgetType || 'unknown',
    config: config as Record<string, unknown>,
    currentSize,
    enabled: enableAutoResize && editMode,
    onResize,
  });

  const handleOpenConfig = () => {
    setConfigDrawerOpen(true);
  };

  const handleCloseConfig = () => {
    setConfigDrawerOpen(false);
  };

  const actions = (
    <Space size="small">
      {onRefresh && (
        <Tooltip title="Refresh data">
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined spin={loading} />}
            onClick={onRefresh}
            disabled={loading}
          />
        </Tooltip>
      )}
      {showConfigButton && (
        <Tooltip title="Configure widget">
          <Button
            type="text"
            size="small"
            icon={<SettingOutlined />}
            onClick={handleOpenConfig}
            className="config-button"
          />
        </Tooltip>
      )}
      {editMode && onRemove && (
        <Tooltip title="Remove widget">
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={onRemove}
          />
        </Tooltip>
      )}
    </Space>
  );

  return (
    <>
      <Card
        title={title}
        extra={actions}
        className={`configurable-widget ${className} ${isHovered ? 'hovered' : ''}`}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          ...style,
        }}
        styles={{
          body: {
            flex: 1,
            overflow: 'auto',
            padding: 16,
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </Card>

      <Drawer
        title={`Configure: ${title}`}
        placement="right"
        size="large"
        open={configDrawerOpen}
        onClose={handleCloseConfig}
        styles={{
          body: {
            padding: 0,
          }
        }}
      >
        {renderConfigPanel
          ? renderConfigPanel({
              config,
              onChange: onConfigChange,
              onClose: handleCloseConfig
            })
          : configPanel
        }
      </Drawer>
    </>
  );
}

export default memo(ConfigurableWidgetBase) as typeof ConfigurableWidgetBase;
