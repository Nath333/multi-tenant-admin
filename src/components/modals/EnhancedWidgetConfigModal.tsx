import { useEffect, useState, useRef, useCallback } from 'react';
import { Form, Input, Switch, Slider, Button, Tooltip, Badge } from 'antd';
import {
  SaveOutlined,
  CloseOutlined,
  EyeOutlined,
  SettingOutlined,
  BgColorsOutlined,
  AppstoreOutlined,
  ThunderboltOutlined,
  CheckCircleFilled,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { Widget } from '../../store/widgetStore';
import WidgetConfigForm from '../widgets/forms/WidgetConfigForm';
import { widgetRegistry } from '../widgets/registry/WidgetRegistry';
import styles from './EnhancedWidgetConfigModal.module.css';

interface EnhancedWidgetConfigModalProps {
  visible: boolean;
  widget: Widget | null;
  onSave: (updates: Partial<Widget>) => void;
  onCancel: () => void;
}


const COLOR_THEMES = [
  { label: 'Blue', value: 'blue', color: '#1890ff' },
  { label: 'Green', value: 'green', color: '#52c41a' },
  { label: 'Purple', value: 'purple', color: '#722ed1' },
  { label: 'Orange', value: 'orange', color: '#fa8c16' },
  { label: 'Red', value: 'red', color: '#f5222d' },
  { label: 'Gradient', value: 'gradient', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
] as const;

const BORDER_RADIUS_MARKS = {
  0: '0',
  8: '8',
  16: '16',
  24: '24',
} as const;

type ConfigSection = 'general' | 'appearance' | 'widget';

function EnhancedWidgetConfigModal({ visible, widget, onSave, onCancel }: EnhancedWidgetConfigModalProps) {
  const [form] = Form.useForm();
  const [previewConfig, setPreviewConfig] = useState<Record<string, unknown>>({});
  const [activeSection, setActiveSection] = useState<ConfigSection>('general');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  /* eslint-disable react-hooks/set-state-in-effect -- animation state sync is intentional */
  useEffect(() => {
    if (visible) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      // Staggered animation for content
      setTimeout(() => setShowContent(true), 150);
    } else {
      setShowContent(false);
      setIsAnimating(false);
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  useEffect(() => {
    if (widget) {
      const initialValues = {
        title: widget.title,
        ...widget.config,
      };
      form.setFieldsValue(initialValues);
      setPreviewConfig(initialValues);
      setHasChanges(false);
    }
  }, [widget, form]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    setPreviewConfig(values);
    setHasChanges(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const { title, ...configValues } = values;
      onSave({
        title,
        config: {
          ...widget?.config,
          ...configValues,
        },
      });
      form.resetFields();
      setHasChanges(false);
    });
  };

  const handleCancel = useCallback(() => {
    form.resetFields();
    setHasChanges(false);
    onCancel();
  }, [form, onCancel]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) {
        handleCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, handleCancel]);

  const sectionTabs = [
    {
      key: 'general' as ConfigSection,
      label: 'General',
      icon: <SettingOutlined />,
      description: 'Title & Status',
    },
    {
      key: 'appearance' as ConfigSection,
      label: 'Appearance',
      icon: <BgColorsOutlined />,
      description: 'Theme & Style',
    },
    {
      key: 'widget' as ConfigSection,
      label: 'Widget Settings',
      icon: <AppstoreOutlined />,
      description: 'Type-specific',
    },
  ];

  const renderGeneralSection = () => (
    <div className={styles.sectionContent}>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>
          <SettingOutlined className={styles.fieldIcon} />
          Widget Title
        </label>
        <Form.Item
          name="title"
          rules={[{ required: true, message: 'Please enter a widget title' }]}
          style={{ marginBottom: 0 }}
        >
          <Input
            placeholder="Enter widget title"
            className={styles.modernInput}
            size="large"
          />
        </Form.Item>
        <span className={styles.fieldHint}>The name displayed on the widget header</span>
      </div>

      <div className={styles.togglesContainer}>
        <div className={styles.toggleCard}>
          <Form.Item
            name="disabled"
            valuePropName="checked"
            initialValue={false}
            style={{ marginBottom: 0 }}
          >
            <div className={styles.toggleContent}>
              <div className={styles.toggleInfo}>
                <ThunderboltOutlined className={styles.toggleIcon} />
                <div>
                  <div className={styles.toggleLabel}>Disabled State</div>
                  <div className={styles.toggleDesc}>Widget will be inactive</div>
                </div>
              </div>
              <Switch />
            </div>
          </Form.Item>
        </div>

        <div className={styles.toggleCard}>
          <Form.Item
            name="showBorder"
            valuePropName="checked"
            initialValue={true}
            style={{ marginBottom: 0 }}
          >
            <div className={styles.toggleContent}>
              <div className={styles.toggleInfo}>
                <AppstoreOutlined className={styles.toggleIcon} />
                <div>
                  <div className={styles.toggleLabel}>Show Border</div>
                  <div className={styles.toggleDesc}>Display widget border</div>
                </div>
              </div>
              <Switch />
            </div>
          </Form.Item>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className={styles.sectionContent}>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>
          <BgColorsOutlined className={styles.fieldIcon} />
          Color Theme
        </label>
        <Form.Item
          name="colorTheme"
          initialValue="blue"
          style={{ marginBottom: 0 }}
        >
          <div className={styles.themeGrid}>
            {COLOR_THEMES.map((theme) => (
              <Tooltip key={theme.value} title={theme.label}>
                <div
                  className={`${styles.themeOption} ${previewConfig.colorTheme === theme.value ? styles.themeActive : ''}`}
                  onClick={() => {
                    form.setFieldValue('colorTheme', theme.value);
                    handleFormChange();
                  }}
                >
                  <div
                    className={styles.themeColor}
                    style={{ background: theme.color }}
                  />
                  <span className={styles.themeName}>{theme.label}</span>
                  {previewConfig.colorTheme === theme.value && (
                    <CheckCircleFilled className={styles.themeCheck} />
                  )}
                </div>
              </Tooltip>
            ))}
          </div>
        </Form.Item>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>
          <AppstoreOutlined className={styles.fieldIcon} />
          Corner Radius
          <Tooltip title="Adjust the roundness of widget corners">
            <InfoCircleOutlined className={styles.infoIcon} />
          </Tooltip>
        </label>
        <Form.Item
          name="borderRadius"
          initialValue={8}
          style={{ marginBottom: 0 }}
        >
          <div className={styles.sliderContainer}>
            <Slider
              min={0}
              max={24}
              marks={BORDER_RADIUS_MARKS}
              tooltip={{ formatter: (val) => `${val}px` }}
              className={styles.modernSlider}
            />
          </div>
        </Form.Item>
        <div className={styles.radiusPreview}>
          <div
            className={styles.radiusBox}
            style={{ borderRadius: (previewConfig.borderRadius as number) || 8 }}
          />
          <span>{(previewConfig.borderRadius as number) || 8}px radius</span>
        </div>
      </div>
    </div>
  );

  const renderWidgetSection = () => {
    if (!widget) return null;

    return (
      <div className={styles.sectionContent}>
        <div className={styles.widgetTypeInfo}>
          <Badge status="processing" />
          <span>Widget Type: <strong>{widget.type}</strong></span>
        </div>
        <WidgetConfigForm widgetType={widget.type} config={widget.config} />
      </div>
    );
  };

  const renderWidgetPreview = () => {
    if (!widget) {
      return (
        <div className={styles.emptyPreview}>
          <div className={styles.emptyIcon}>📦</div>
          <span>No widget selected</span>
        </div>
      );
    }

    const registration = widgetRegistry.get(widget.type);
    if (!registration) {
      return (
        <div className={styles.errorPreview}>
          <div className={styles.errorIcon}>⚠️</div>
          <span>Widget type "{widget.type}" not found</span>
        </div>
      );
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const WidgetComponent = registration.component as any;
      const { title, ...configValues } = previewConfig;

      return (
        <div className={styles.previewWrapper}>
          <div className={styles.previewContent}>
            <WidgetComponent
              id={widget.id}
              title={title || widget.title}
              widgetType={widget.type}
              editMode={false}
              config={{ ...widget.config, ...configValues }}
              onConfigChange={() => {}}
              disabled={configValues.disabled || false}
            />
          </div>
        </div>
      );
    } catch {
      return (
        <div className={styles.errorPreview}>
          <div className={styles.errorIcon}>❌</div>
          <span>Error rendering preview</span>
        </div>
      );
    }
  };

  if (!visible) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${isAnimating ? styles.visible : ''}`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`${styles.modalContainer} ${showContent ? styles.modalVisible : ''}`}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIconWrapper}>
              <div className={styles.headerIcon}>
                <SettingOutlined />
              </div>
              <div className={styles.headerIconRing} />
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.headerTitle}>Configure Widget</h2>
              <p className={styles.headerSubtitle}>{widget?.title || 'Widget Settings'}</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            {hasChanges && (
              <Badge
                dot
                status="warning"
                className={styles.changesBadge}
              >
                <span className={styles.changesText}>Unsaved changes</span>
              </Badge>
            )}
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleCancel}
              className={styles.closeButton}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.modalBody}>
          {/* Left Panel - Config */}
          <div className={styles.configPanel}>
            {/* Section Tabs */}
            <div className={styles.sectionTabs}>
              {sectionTabs.map((tab, index) => (
                <button
                  key={tab.key}
                  className={`${styles.sectionTab} ${activeSection === tab.key ? styles.tabActive : ''}`}
                  onClick={() => setActiveSection(tab.key)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={styles.tabIcon}>{tab.icon}</div>
                  <div className={styles.tabInfo}>
                    <span className={styles.tabLabel}>{tab.label}</span>
                    <span className={styles.tabDesc}>{tab.description}</span>
                  </div>
                  {activeSection === tab.key && <div className={styles.tabIndicator} />}
                </button>
              ))}
            </div>

            {/* Form Content */}
            <div className={styles.formWrapper}>
              <Form
                form={form}
                layout="vertical"
                onValuesChange={handleFormChange}
                className={styles.configForm}
              >
                <div className={`${styles.sectionPanel} ${activeSection === 'general' ? styles.sectionActive : ''}`}>
                  {activeSection === 'general' && renderGeneralSection()}
                </div>
                <div className={`${styles.sectionPanel} ${activeSection === 'appearance' ? styles.sectionActive : ''}`}>
                  {activeSection === 'appearance' && renderAppearanceSection()}
                </div>
                <div className={`${styles.sectionPanel} ${activeSection === 'widget' ? styles.sectionActive : ''}`}>
                  {activeSection === 'widget' && renderWidgetSection()}
                </div>
              </Form>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className={styles.previewPanel}>
            <div className={styles.previewHeader}>
              <div className={styles.previewLabel}>
                <EyeOutlined className={styles.previewIcon} />
                <span>Live Preview</span>
              </div>
              <div className={styles.previewBadge}>Real-time</div>
            </div>
            <div className={styles.previewContainer}>
              {renderWidgetPreview()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <div className={styles.footerHint}>
            <InfoCircleOutlined />
            <span>Press <kbd>Esc</kbd> to cancel</span>
          </div>
          <div className={styles.footerActions}>
            <Button
              size="large"
              onClick={handleCancel}
              className={styles.cancelBtn}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              onClick={handleSave}
              className={styles.saveBtn}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedWidgetConfigModal;
