import { Modal, Row, Col, Space } from 'antd';

interface KeyboardShortcutsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ visible, onClose }: KeyboardShortcutsModalProps) {
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            ⌨️
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1a202c' }}>Keyboard Shortcuts</div>
            <div style={{ fontSize: 13, fontWeight: 400, color: '#64748b', marginTop: 2 }}>
              Speed up your workflow
            </div>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div style={{ padding: '20px 0' }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <div style={{ marginBottom: 12, fontSize: 15, fontWeight: 600, color: '#667eea' }}>
              Navigation
            </div>
            <Space orientation="vertical" size={12} style={{ width: '100%' }}>
              {[
                { keys: ['Ctrl', 'E'], desc: 'Toggle edit mode' },
                { keys: ['Ctrl', 'K'], desc: 'Open widget catalog' },
                { keys: ['Esc'], desc: 'Close modal or exit edit mode' },
              ].map((shortcut, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: '#f8fafc',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <span style={{ fontSize: 14, color: '#475569' }}>{shortcut.desc}</span>
                  <Space size={4}>
                    {shortcut.keys.map((key, kidx) => (
                      <kbd
                        key={kidx}
                        style={{
                          padding: '4px 10px',
                          background: 'white',
                          border: '2px solid #e2e8f0',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#1a202c',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        {key}
                      </kbd>
                    ))}
                  </Space>
                </div>
              ))}
            </Space>
          </Col>
          <Col span={24}>
            <div style={{ marginBottom: 12, fontSize: 15, fontWeight: 600, color: '#667eea' }}>
              Help
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: '#f8fafc',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
              }}
            >
              <span style={{ fontSize: 14, color: '#475569' }}>Show this help menu</span>
              <Space size={4}>
                <kbd
                  style={{
                    padding: '4px 10px',
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#1a202c',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  Ctrl
                </kbd>
                <kbd
                  style={{
                    padding: '4px 10px',
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#1a202c',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  /
                </kbd>
              </Space>
            </div>
          </Col>
        </Row>
        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            borderRadius: 8,
            border: '1px solid rgba(102, 126, 234, 0.15)',
          }}
        >
          <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
            💡 <strong>Pro tip:</strong> Use{' '}
            <kbd
              style={{
                padding: '2px 6px',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 4,
                fontSize: 11,
              }}
            >
              Ctrl+E
            </kbd>{' '}
            to quickly toggle between edit and view mode.
          </div>
        </div>
      </div>
    </Modal>
  );
}
