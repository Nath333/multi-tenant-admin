/**
 * Widget Monitor - Real-time widget change tracker
 * Shows live updates when widgets are added, removed, or configured
 */

import { useEffect, useState } from 'react';
import { Card, Tag, Button, Space } from 'antd';
import { BugOutlined, ClearOutlined } from '@ant-design/icons';
import { useWidgetStore } from '../../store/widgetStore';

const WidgetMonitor = () => {
  const [changes, setChanges] = useState<string[]>([]);
  const [show, setShow] = useState(true);
  const [totalChanges, setTotalChanges] = useState(0);

  useEffect(() => {
    const unsubscribe = useWidgetStore.subscribe((state, prevState) => {
      const time = new Date().toLocaleTimeString();
      const logs: string[] = [];

      // Get all widgets from both stores
      const allWidgets = [...state.widgets, ...Object.values(state.pageWidgets).flat()];
      const allPrevWidgets = [...prevState.widgets, ...Object.values(prevState.pageWidgets).flat()];

      // Detect added widgets
      allWidgets.forEach(w => {
        if (!allPrevWidgets.find(p => p.id === w.id)) {
          logs.push(`[${time}] ➕ Added: "${w.title}" (${w.type})`);
        }
      });

      // Detect removed widgets
      allPrevWidgets.forEach(w => {
        if (!allWidgets.find(p => p.id === w.id)) {
          logs.push(`[${time}] 🗑️ Removed: "${w.title}"`);
        }
      });

      // Detect config changes
      allWidgets.forEach(w => {
        const prev = allPrevWidgets.find(p => p.id === w.id);
        if (prev && JSON.stringify(w.config) !== JSON.stringify(prev.config)) {
          logs.push(`[${time}] ⚙️ Config changed: "${w.title}"`);

          // Check for element/zone changes
          if (w.config?.elements && Array.isArray(w.config.elements) &&
              prev.config?.elements && Array.isArray(prev.config.elements)) {
            const newCount = w.config.elements.length;
            const oldCount = prev.config.elements.length;
            if (newCount !== oldCount) {
              logs.push(`   → Elements/Zones: ${oldCount} → ${newCount}`);
              if (newCount > oldCount) {
                const newElement = w.config.elements[w.config.elements.length - 1];
                logs.push(`   → Added: ${newElement?.name || 'New element'}`);
              }
            }
          }
        }
      });

      if (logs.length > 0) {
        setChanges(prev => [...logs, ...prev].slice(0, 100));
        setTotalChanges(prev => prev + logs.length);
      }
    });

    return unsubscribe;
  }, []);

  if (!show) {
    return (
      <Button
        onClick={() => setShow(true)}
        icon={<BugOutlined />}
        type="primary"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
        }}
      >
        Show Monitor ({totalChanges})
      </Button>
    );
  }

  return (
    <Card
      title={
        <Space>
          <BugOutlined style={{ color: '#52c41a' }} />
          <span>Widget Monitor</span>
          <Tag color="green">Live</Tag>
          <Tag color="blue">{totalChanges} changes</Tag>
        </Space>
      }
      extra={
        <Space>
          <Button
            size="small"
            icon={<ClearOutlined />}
            onClick={() => {
              setChanges([]);
              setTotalChanges(0);
            }}
          >
            Clear
          </Button>
          <Button size="small" onClick={() => setShow(false)}>Hide</Button>
        </Space>
      }
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 450,
        maxHeight: '60vh',
        zIndex: 9999,
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        borderRadius: 12,
      }}
      bodyStyle={{
        maxHeight: 'calc(60vh - 100px)',
        overflow: 'auto',
        fontSize: 12,
        fontFamily: 'monospace',
        background: '#fafafa',
        padding: 12,
      }}
    >
      {changes.length === 0 ? (
        <div style={{
          color: '#999',
          textAlign: 'center',
          padding: 40,
          background: '#fff',
          borderRadius: 8,
          border: '1px dashed #d9d9d9'
        }}>
          <BugOutlined style={{ fontSize: 32, marginBottom: 12, opacity: 0.5 }} />
          <div style={{ fontSize: 13 }}>Waiting for widget changes...</div>
          <div style={{ fontSize: 11, marginTop: 8, color: '#bbb' }}>
            Add, edit, or configure widgets to see live updates
          </div>
        </div>
      ) : (
        <div style={{
          background: '#fff',
          padding: 12,
          borderRadius: 8,
          border: '1px solid #e8e8e8'
        }}>
          {changes.map((log, i) => (
            <div
              key={i}
              style={{
                marginBottom: 6,
                paddingBottom: 6,
                borderBottom: i < changes.length - 1 ? '1px solid #f0f0f0' : 'none',
                color: log.includes('→') ? '#666' : '#000',
                paddingLeft: log.includes('→') ? 8 : 0,
              }}
            >
              {log}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default WidgetMonitor;
