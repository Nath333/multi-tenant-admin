import { Card, Row, Col, Tag, Input, Select, Badge, Empty, Tooltip, Modal } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  ControlOutlined,
  BellOutlined,
  BlockOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useState, useMemo, memo, useCallback } from 'react';
import type { WidgetCategory, WidgetRegistration } from './widgetRegistry.types';
import { widgetRegistry } from './WidgetRegistry';
import { CachedWidgetPreview } from './WidgetPreviewCache';

/**
 * WidgetCatalog - Browse and discover available widgets
 *
 * A searchable, filterable catalog component that displays all registered widgets
 * with support for drag-and-drop, preview modals, and categorization.
 *
 * Features:
 * - Real-time search across widget names, descriptions, and tags
 * - Category filtering with widget counts
 * - Drag-and-drop support for adding widgets to dashboards
 * - Modal preview with full widget details
 * - Responsive grid layout
 * - Performance optimized with memoization
 */

interface WidgetCatalogProps {
  /** Callback when a widget is selected/added */
  onSelect?: (widgetId: string) => void;
  /** Pre-select a category filter */
  selectedCategory?: WidgetCategory;
  /** Enable drag-and-drop functionality */
  enableDragAndDrop?: boolean;
}

/**
 * Category configuration mapping
 * Centralizes all category-related metadata for consistency
 */
const CATEGORY_CONFIG: Record<WidgetCategory, {
  icon: React.ReactNode;
  label: string;
  color: string;
}> = {
  analytics: {
    icon: <BarChartOutlined />,
    label: 'Analytics',
    color: 'blue',
  },
  monitoring: {
    icon: <DashboardOutlined />,
    label: 'Monitoring',
    color: 'green',
  },
  iot: {
    icon: <AppstoreOutlined />,
    label: 'IoT & Devices',
    color: 'purple',
  },
  charts: {
    icon: <BarChartOutlined />,
    label: 'Charts & Graphs',
    color: 'cyan',
  },
  tables: {
    icon: <AppstoreOutlined />,
    label: 'Data Tables',
    color: 'orange',
  },
  maps: {
    icon: <EnvironmentOutlined />,
    label: 'Maps',
    color: 'magenta',
  },
  controls: {
    icon: <ControlOutlined />,
    label: 'Controls',
    color: 'geekblue',
  },
  alerts: {
    icon: <BellOutlined />,
    label: 'Alerts & Notifications',
    color: 'red',
  },
  custom: {
    icon: <BlockOutlined />,
    label: 'Custom',
    color: 'default',
  },
  bms: {
    icon: <ControlOutlined />,
    label: 'Building Management',
    color: 'volcano',
  },
};

/**
 * Style constants for consistent theming
 */
const STYLES = {
  card: {
    borderRadius: 20,
    border: '2px solid transparent',
    background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%) border-box',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.02)',
  },
  previewHeight: 200,
  thumbnailSize: { width: 260, height: 160 },
  modalPreviewSize: { width: 700, height: 400 },
  maxTagsVisible: 3,
  descriptionMinHeight: 44,
} as const;

/**
 * Utility function to create drag data from widget registration
 */
const createDragData = (registration: WidgetRegistration) => ({
  widgetId: registration.metadata.id,
  widgetType: registration.metadata.id,
  widgetName: registration.metadata.name,
  defaultSize: {
    w: registration.metadata.size.defaultW,
    h: registration.metadata.size.defaultH,
  },
});

/**
 * WidgetDetailsSection - Displays widget metadata in preview modal
 */
interface WidgetDetailsSectionProps {
  registration: WidgetRegistration;
}

const WidgetDetailsSection = memo<WidgetDetailsSectionProps>(({ registration }) => {
  const { metadata } = registration;
  const categoryConfig = CATEGORY_CONFIG[metadata.category];

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* Category */}
      <div>
        <div style={{ fontWeight: 600, marginBottom: 8, color: '#262626' }}>
          Category
        </div>
        <Tag color={categoryConfig.color}>
          {categoryConfig.label}
        </Tag>
      </div>

      {/* Tags */}
      {metadata.tags && metadata.tags.length > 0 && (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 8, color: '#262626' }}>
            Tags
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {metadata.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>
      )}

      {/* Default Size */}
      <div>
        <div style={{ fontWeight: 600, marginBottom: 8, color: '#262626' }}>
          Default Size
        </div>
        <div style={{ color: '#666' }}>
          {metadata.size.defaultW} × {metadata.size.defaultH} grid units
        </div>
      </div>

      {/* Version */}
      {metadata.version && (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 8, color: '#262626' }}>
            Version
          </div>
          <div style={{ color: '#666' }}>
            {metadata.version}
          </div>
        </div>
      )}

      {/* Author */}
      {metadata.author && (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 8, color: '#262626' }}>
            Author
          </div>
          <div style={{ color: '#666' }}>
            {metadata.author}
          </div>
        </div>
      )}
    </div>
  );
});

WidgetDetailsSection.displayName = 'WidgetDetailsSection';

/**
 * ModalTitle - Custom title component for preview modal
 */
interface ModalTitleProps {
  registration: WidgetRegistration;
}

const ModalTitle = memo<ModalTitleProps>(({ registration }) => {
  const categoryConfig = CATEGORY_CONFIG[registration.metadata.category];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 24, color: '#1890ff' }}>
        {categoryConfig.icon}
      </span>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>
          {registration.metadata.name}
        </div>
        <div style={{ fontSize: 13, color: '#666', fontWeight: 'normal' }}>
          {registration.metadata.description}
        </div>
      </div>
    </div>
  );
});

ModalTitle.displayName = 'ModalTitle';

export const WidgetCatalog = memo<WidgetCatalogProps>(({
  onSelect,
  selectedCategory,
  enableDragAndDrop = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<WidgetCategory | undefined>(
    selectedCategory
  );
  const [previewModal, setPreviewModal] = useState<{
    visible: boolean;
    registration: WidgetRegistration | null;
  }>({ visible: false, registration: null });

  /**
   * Memoized list of all available widgets
   * Only recalculates when registry changes
   */
  const allWidgets = useMemo(() => widgetRegistry.getAll(), []);

  /**
   * Filtered widgets based on search query and category
   * Automatically updates when filters change
   */
  const filteredWidgets = useMemo(() => {
    return widgetRegistry.filter({
      category: categoryFilter,
      search: searchQuery,
    });
  }, [searchQuery, categoryFilter]);

  /**
   * Category options with widget counts for the filter dropdown
   * Computed once on mount as registry is static
   */
  const categories = useMemo(() => {
    const stats = widgetRegistry.getStats();
    return widgetRegistry.getCategories().map((category) => ({
      value: category,
      label: CATEGORY_CONFIG[category].label,
      count: stats.byCategory[category] || 0,
    }));
  }, []);

  /**
   * Handle drag start event for widget cards
   * Sets up drag data and visual feedback
   */
  const handleDragStart = useCallback((
    e: React.DragEvent<HTMLDivElement>,
    registration: WidgetRegistration
  ) => {
    if (!enableDragAndDrop) return;

    const dragData = createDragData(registration);

    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.setData('text/plain', registration.metadata.name);

    // Add visual feedback
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '0.5';
  }, [enableDragAndDrop]);

  /**
   * Handle drag end event - restore card opacity
   */
  const handleDragEnd = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
  }, []);

  /**
   * Open preview modal for a widget
   */
  const handlePreviewClick = useCallback((registration: WidgetRegistration) => {
    setPreviewModal({ visible: true, registration });
  }, []);

  /**
   * Close preview modal
   */
  const handleClosePreview = useCallback(() => {
    setPreviewModal({ visible: false, registration: null });
  }, []);

  /**
   * Handle modal OK button - add widget and close modal
   */
  const handleModalOk = useCallback(() => {
    if (previewModal.registration) {
      onSelect?.(previewModal.registration.metadata.id);
      handleClosePreview();
    }
  }, [previewModal.registration, onSelect, handleClosePreview]);

  /**
   * Render individual widget card
   * Memoized to prevent unnecessary re-renders
   */
  const renderWidgetCard = useCallback((registration: WidgetRegistration) => {
    const { metadata } = registration;
    const categoryConfig = CATEGORY_CONFIG[metadata.category];

    return (
      <Col xs={24} sm={12} md={8} lg={6} key={metadata.id}>
        <Card
          hoverable
          draggable={enableDragAndDrop}
          onDragStart={(e) => handleDragStart(e, registration)}
          onDragEnd={handleDragEnd}
          style={{
            height: '100%',
            cursor: enableDragAndDrop ? 'grab' : 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            ...STYLES.card,
            overflow: 'hidden',
            position: 'relative',
          }}
          styles={{
            body: { padding: 0 },
          }}
          className="widget-catalog-card"
        >
          {/* Preview Thumbnail */}
          <div
            onClick={() => handlePreviewClick(registration)}
            style={{
              position: 'relative',
              height: STYLES.previewHeight,
              background: 'linear-gradient(135deg, #f8fafc 0%, #f0f4f8 50%, #f8fafc 100%)',
              borderBottom: '2px solid rgba(226, 232, 240, 0.5)',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            {metadata.preview ? (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CachedWidgetPreview
                  widgetId={metadata.id}
                  width={STYLES.thumbnailSize.width}
                  height={STYLES.thumbnailSize.height}
                  mode="thumbnail"
                />
              </div>
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 64,
                  color: '#d9d9d9',
                }}
              >
                {categoryConfig.icon}
              </div>
            )}

            {/* Preview Overlay on Hover */}
            <div
              className="preview-overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: 0,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <EyeOutlined style={{ fontSize: 36, color: '#fff', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' }} />
              <span style={{
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }}>
                Preview
              </span>
            </div>
          </div>

          {/* Card Content */}
          <div style={{ padding: 20 }} onClick={() => onSelect?.(metadata.id)}>
            <div style={{ marginBottom: 12, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#0f172a',
                  lineHeight: 1.3,
                  letterSpacing: '-0.3px',
                  background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {metadata.name}
                </h3>
                {metadata.version && (
                  <Tag
                    style={{
                      marginTop: 6,
                      fontSize: 10,
                      padding: '3px 10px',
                      borderRadius: 8,
                      border: 'none',
                      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                      color: '#64748b',
                      fontWeight: 600,
                    }}
                  >{`v${metadata.version}`}</Tag>
                )}
              </div>
            </div>

          <div style={{ marginBottom: 14 }}>
            <p
              style={{
                fontSize: 13,
                color: '#64748b',
                margin: 0,
                minHeight: STYLES.descriptionMinHeight,
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              {metadata.description}
            </p>
          </div>

          <div style={{ marginBottom: 10 }}>
            <Tag
              icon={categoryConfig.icon}
              style={{
                borderRadius: 10,
                padding: '4px 12px',
                fontSize: 11,
                fontWeight: 600,
                border: 'none',
                background: `linear-gradient(135deg, ${categoryConfig.color === 'blue' ? '#dbeafe' : categoryConfig.color === 'green' ? '#d1fae5' : categoryConfig.color === 'purple' ? '#e9d5ff' : '#f3f4f6'} 0%, white 100%)`,
              }}
              color={categoryConfig.color}
            >
              {categoryConfig.label}
            </Tag>
          </div>

          {metadata.tags && metadata.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {metadata.tags.slice(0, STYLES.maxTagsVisible).map((tag) => (
                <Tag
                  key={tag}
                  style={{
                    fontSize: 11,
                    borderRadius: 8,
                    padding: '2px 10px',
                    background: 'rgba(102, 126, 234, 0.08)',
                    border: '1px solid rgba(102, 126, 234, 0.15)',
                    color: '#667eea',
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </Tag>
              ))}
              {metadata.tags.length > STYLES.maxTagsVisible && (
                <Tag
                  style={{
                    fontSize: 11,
                    borderRadius: 8,
                    padding: '2px 10px',
                    background: 'rgba(100, 116, 139, 0.08)',
                    border: '1px solid rgba(100, 116, 139, 0.15)',
                    color: '#64748b',
                    fontWeight: 500,
                  }}
                >
                  +{metadata.tags.length - STYLES.maxTagsVisible}
                </Tag>
              )}
            </div>
          )}

          <div
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: '2px solid rgba(226, 232, 240, 0.5)',
              fontSize: 12,
              color: '#94a3b8',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontWeight: 500 }}>
                Size: {metadata.size.defaultW} × {metadata.size.defaultH}
              </div>
              {metadata.author && (
                <div style={{ fontSize: 11 }}>
                  By: {metadata.author}
                </div>
              )}
            </div>

            <Tooltip title={enableDragAndDrop ? 'Drag to add or click' : 'Add widget'}>
              <div
                className="add-widget-button"
                style={{
                  fontSize: 16,
                  color: '#fff',
                  padding: 10,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PlusOutlined />
              </div>
            </Tooltip>
          </div>
          </div>
        </Card>

        <style>{`
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }

          .widget-catalog-card {
            background: linear-gradient(white, white) padding-box,
                        linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%) border-box !important;
          }

          .widget-catalog-card:hover {
            box-shadow:
              0 12px 32px rgba(102, 126, 234, 0.15),
              0 4px 12px rgba(102, 126, 234, 0.1),
              0 0 0 3px rgba(102, 126, 234, 0.08) !important;
            transform: translateY(-6px) scale(1.01);
            background: linear-gradient(white, white) padding-box,
                        linear-gradient(135deg, #667eea 0%, #764ba2 100%) border-box !important;
          }

          .widget-catalog-card:hover .preview-overlay {
            opacity: 1 !important;
          }

          .widget-catalog-card:hover .add-widget-button {
            transform: scale(1.1) rotate(90deg);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5) !important;
          }

          .widget-catalog-card[draggable="true"]:active {
            cursor: grabbing !important;
            transform: scale(0.97);
          }

          .add-widget-button:hover {
            transform: scale(1.15) rotate(90deg) !important;
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.6) !important;
          }
        `}</style>
      </Col>
    );
  }, [enableDragAndDrop, handleDragStart, handleDragEnd, handlePreviewClick, onSelect]);

  return (
    <div style={{ padding: '20px 0 28px 0' }}>
      {/* Filters Section */}
      <div
        className="filter-section"
        style={{
          marginBottom: 32,
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(12px)',
          borderRadius: 20,
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative gradient orbs */}
        <div style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 150,
          height: 150,
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 100,
          height: 100,
          background: 'radial-gradient(circle, rgba(118, 75, 162, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <Row gutter={[16, 16]} align="middle" style={{ position: 'relative', zIndex: 1 }}>
          <Col flex="auto">
            <Input
              size="large"
              placeholder="Search widgets by name, description, or tags..."
              prefix={<SearchOutlined style={{ color: '#667eea', fontSize: 18 }} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              style={{
                borderRadius: 14,
                border: '2px solid rgba(226, 232, 240, 0.5)',
                fontSize: 14,
                fontWeight: 500,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              className="search-input"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              size="large"
              placeholder="Filter by category"
              style={{
                width: '100%',
                borderRadius: 14,
              }}
              value={categoryFilter}
              onChange={setCategoryFilter}
              allowClear
              className="category-select"
              options={[
                { label: 'All Categories', value: undefined },
                ...categories.map((cat) => ({
                  label: `${cat.label} (${cat.count})`,
                  value: cat.value,
                })),
              ]}
            />
          </Col>
          <Col>
            <Badge
              count={`${filteredWidgets.length} of ${allWidgets.length}`}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: 13,
                fontWeight: 700,
                padding: '8px 18px',
                height: 'auto',
                borderRadius: 24,
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.35), 0 0 0 3px rgba(102, 126, 234, 0.1)',
                letterSpacing: '0.3px',
              }}
              showZero
            />
          </Col>
        </Row>

        <style>{`
          .search-input:hover,
          .search-input:focus {
            border-color: rgba(102, 126, 234, 0.5) !important;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15), 0 0 0 3px rgba(102, 126, 234, 0.05) !important;
          }

          .filter-section {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .filter-section:hover {
            box-shadow: 0 12px 32px rgba(102, 126, 234, 0.18), 0 4px 12px rgba(0, 0, 0, 0.06) !important;
          }
        `}</style>
      </div>

      {/* Widget Grid */}
      {filteredWidgets.length > 0 ? (
        <Row gutter={[16, 16]}>{filteredWidgets.map(renderWidgetCard)}</Row>
      ) : (
        <Empty
          description={
            searchQuery || categoryFilter
              ? 'No widgets found matching your criteria'
              : 'No widgets available'
          }
          style={{ marginTop: 48 }}
        />
      )}

      {/* Statistics */}
      {filteredWidgets.length > 0 && (
        <div
          style={{
            marginTop: 36,
            padding: '18px 24px',
            background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.95) 100%)',
            backdropFilter: 'blur(8px)',
            borderRadius: 16,
            textAlign: 'center',
            color: '#64748b',
            fontSize: 13,
            fontWeight: 500,
            border: '2px solid rgba(226, 232, 240, 0.5)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            letterSpacing: '0.2px',
          }}
        >
          <span style={{ color: '#667eea', fontWeight: 700 }}>{filteredWidgets.length}</span>
          {' '}of{' '}
          <span style={{ color: '#764ba2', fontWeight: 700 }}>{allWidgets.length}</span>
          {' '}available widgets
        </div>
      )}

      {/* Preview Modal */}
      <Modal
        title={previewModal.registration ? <ModalTitle registration={previewModal.registration} /> : 'Widget Preview'}
        open={previewModal.visible}
        onCancel={handleClosePreview}
        onOk={handleModalOk}
        okText="Add Widget"
        cancelText="Close"
        width={850}
        style={{ top: 20 }}
        styles={{
          header: {
            padding: '20px 24px',
            borderBottom: '2px solid rgba(226, 232, 240, 0.5)',
            background: 'linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)',
          },
          body: {
            padding: '28px 24px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%)',
          },
        }}
      >
        {previewModal.registration && (
          <div>
            {/* Live Preview */}
            <div
              style={{
                marginBottom: 28,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)',
                backdropFilter: 'blur(8px)',
                borderRadius: 16,
                padding: 28,
                border: '2px solid rgba(226, 232, 240, 0.5)',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.08)',
              }}
            >
              <div style={{
                marginBottom: 16,
                fontSize: 11,
                fontWeight: 700,
                color: '#667eea',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <EyeOutlined style={{ fontSize: 14 }} />
                Live Preview
              </div>
              <CachedWidgetPreview
                widgetId={previewModal.registration.metadata.id}
                width={STYLES.modalPreviewSize.width}
                height={STYLES.modalPreviewSize.height}
                mode="full"
              />
            </div>

            {/* Widget Details */}
            <WidgetDetailsSection registration={previewModal.registration} />
          </div>
        )}
      </Modal>
    </div>
  );
});

WidgetCatalog.displayName = 'WidgetCatalog';
