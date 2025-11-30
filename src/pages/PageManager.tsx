import { useState, useMemo, useEffect } from 'react';
import {
  Button, Card, Modal, Form, Input, Select, Switch, message, Space, Typography,
  Tag, Row, Col, Statistic, Empty, Tooltip, Dropdown, Badge,
  Segmented, Divider, Alert
} from 'antd';
import type { MenuProps } from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined,
  SearchOutlined, CopyOutlined, DownloadOutlined, UploadOutlined, AppstoreOutlined,
  UnorderedListOutlined, BarChartOutlined, CheckCircleOutlined, CloseCircleOutlined,
  DragOutlined, MoreOutlined, FileTextOutlined, SettingOutlined
} from '@ant-design/icons';
import * as Icons from '@ant-design/icons';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePagesStore } from '../store/pagesStore';
import type { CustomPage, PageMode } from '../store/pagesStore';
import { useNavigate } from 'react-router-dom';

// Type definitions for component props
interface SortablePageCardProps {
  page: CustomPage;
  onEdit: (page: CustomPage) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onDuplicate: (page: CustomPage) => void;
  onView: (id: string) => void;
  onBuild: (id: string) => void;
}

interface PageFormValues {
  name: string;
  icon: string;
  mode: PageMode;
  enabled: boolean;
}

type FilterStatus = 'all' | 'active' | 'inactive';
type ViewMode = 'list' | 'grid';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

// Common icons for pages
const iconOptions = [
  'FireOutlined', 'BulbOutlined', 'ThunderboltOutlined', 'CloudOutlined',
  'HomeOutlined', 'ShopOutlined', 'CarOutlined', 'RocketOutlined',
  'HeartOutlined', 'StarOutlined', 'SettingOutlined', 'ToolOutlined',
  'CameraOutlined', 'PhoneOutlined', 'MailOutlined', 'DashboardOutlined',
  'ApiOutlined', 'DatabaseOutlined', 'CodeOutlined', 'SafetyOutlined'
];

const IconComponent = ({ iconName }: { iconName: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (Icons as any)[iconName];
  return Icon ? <Icon /> : null;
};

// Sortable Page Card Component with enhanced animations
const SortablePageCard = ({ page, onEdit, onDelete, onToggle, onDuplicate, onView, onBuild }: SortablePageCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: page.id });
  const [isHovering, setIsHovering] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: isDragging ? 0.5 : 1,
    scale: isDragging ? 1.02 : isHovering ? 1.01 : 1,
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: 'View Page',
      onClick: () => onView(page.id),
    },
    {
      key: 'duplicate',
      icon: <CopyOutlined />,
      label: 'Duplicate',
      onClick: () => onDuplicate(page),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete',
      danger: true,
      onClick: () => onDelete(page.id),
    },
  ];

  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Card
        hoverable
        style={{
          marginBottom: 16,
          borderRadius: 12,
          border: isHovering ? '1px solid #1890ff' : '1px solid #f0f0f0',
          boxShadow: isHovering ? '0 4px 12px rgba(24, 144, 255, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        styles={{ body: { padding: 20 } }}
      >
        <Row gutter={16} align="middle">
          <Col flex="40px">
            <div
              {...attributes}
              {...listeners}
              style={{ cursor: 'grab', fontSize: 20, color: '#8c8c8c' }}
            >
              <DragOutlined />
            </div>
          </Col>

          <Col flex="60px">
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 10,
                background: page.enabled ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: page.enabled ? '#fff' : '#8c8c8c',
              }}
            >
              <IconComponent iconName={page.icon} />
            </div>
          </Col>

          <Col flex="auto">
            <Space orientation="vertical" size={4} style={{ width: '100%' }}>
              <Space>
                <Text strong style={{ fontSize: 16 }}>{page.name}</Text>
                <Tag color={page.enabled ? 'success' : 'default'} icon={page.enabled ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
                  {page.enabled ? 'Active' : 'Inactive'}
                </Tag>
                <Tag color="blue">{page.mode === 'hybrid' ? 'Hybrid' : 'Custom'}</Tag>
              </Space>
              <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, color: '#8c8c8c' }}>
                {page.description}
              </Paragraph>
              <Space size={16} style={{ fontSize: 12, color: '#bfbfbf' }}>
                <Space size={4}>
                  <FileTextOutlined />
                  <Text type="secondary">{page.path}</Text>
                </Space>
                <Space size={4}>
                  <AppstoreOutlined />
                  <Text type="secondary">{page.widgets.length} widgets</Text>
                </Space>
                <Space size={4}>
                  <BarChartOutlined />
                  <Text type="secondary">Order: {page.order}</Text>
                </Space>
              </Space>
            </Space>
          </Col>

          <Col>
            <Space size={8}>
              <Switch
                checked={page.enabled}
                onChange={() => onToggle(page.id)}
                checkedChildren={<EyeOutlined />}
                unCheckedChildren={<EyeInvisibleOutlined />}
              />
              <Button
                type="default"
                icon={<EditOutlined />}
                onClick={() => onEdit(page)}
              >
                Edit
              </Button>
              <Button
                type="primary"
                icon={<AppstoreOutlined />}
                onClick={() => onBuild(page.id)}
              >
                Build Page
              </Button>
              <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                <Button icon={<MoreOutlined />} />
              </Dropdown>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default function PageManager() {
  const navigate = useNavigate();
  const { pages, createPage, updatePage, deletePage, togglePage, getPage } = usePagesStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isLoading] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // N - New page
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsModalOpen((isOpen) => {
          if (!isOpen) {
            handleNew();
          }
          return isOpen;
        });
        return;
      }

      // / - Focus search
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        searchInput?.focus();
        return;
      }

      // ? - Show keyboard shortcuts help
      if (e.key === '?') {
        e.preventDefault();
        setShowKeyboardHelp(true);
        return;
      }

      // Escape - Close help modal
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowKeyboardHelp((prev) => {
          if (prev) return false;
          return prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- handleNew is stable
  }, []);

  // Statistics
  const stats = useMemo(() => {
    const totalPages = pages.length;
    const activePages = pages.filter(p => p.enabled).length;
    const totalWidgets = pages.reduce((sum, p) => sum + p.widgets.length, 0);
    const hybridPages = pages.filter(p => p.mode === 'hybrid').length;

    return { totalPages, activePages, totalWidgets, hybridPages };
  }, [pages]);

  // Filtered and sorted pages
  const filteredPages = useMemo(() => {
    return pages
      .filter(page => {
        const matchesSearch = page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            page.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            page.path.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' ||
                            (filterStatus === 'active' && page.enabled) ||
                            (filterStatus === 'inactive' && !page.enabled);
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => a.order - b.order);
  }, [pages, searchTerm, filterStatus]);

  const handleCreateOrUpdate = async (values: PageFormValues) => {
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    // Auto-generate URL path from page name
    const autoPath = '/' + values.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    if (editingPage) {
      updatePage(editingPage.id, {
        ...values,
        path: autoPath,
      });
      message.success({
        content: '✨ Page updated successfully!',
        duration: 3,
      });
      setIsModalOpen(false);
      setEditingPage(null);
      form.resetFields();
    } else {
      // Create the page with auto-generated path and no template widgets
      createPage({
        ...values,
        path: autoPath,
        widgets: [],
        order: pages.length + 1,
      });

      // Close modal and reset form
      setIsModalOpen(false);
      setEditingPage(null);
      form.resetFields();

      // Show success notification with navigation options
      // Use a small timeout to ensure React has re-rendered with the new page
      setTimeout(() => {
        const allPages = usePagesStore.getState().pages;
        const newPage = allPages.find(p => p.path === autoPath);

        if (!newPage) {
          console.error('Page was created but not found in store:', autoPath);
          message.error('Error: Page created but not found. Please refresh the page.');
          return;
        }

        const key = `page-creation-${Date.now()}`;
        message.success({
          content: (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>✨ Page created successfully!</div>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 12 }}>
                Your page <strong>{values.name}</strong> is now live at <code>{autoPath}</code>
                <br />
                <span style={{ color: '#52c41a' }}>✓ Added to navigation menu</span>
              </div>
              <Space>
                <Button
                  size="small"
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={() => {
                    message.destroy(key);
                    navigate(autoPath);
                  }}
                >
                  View Page
                </Button>
              </Space>
            </div>
          ),
          duration: 8,
          key,
        });
      }, 100);
    }
  };

  const handleEdit = (page: CustomPage) => {
    setEditingPage(page);
    form.setFieldsValue({
      name: page.name,
      icon: page.icon,
      mode: page.mode,
      enabled: page.enabled,
    });
    setIsModalOpen(true);
  };

  const handleBuildPage = (pageId: string) => {
    const page = getPage(pageId);
    if (page) {
      navigate(page.path);
      message.info('You can now edit widgets on this page');
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Page?',
      content: 'This action cannot be undone. All widgets on this page will be lost.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        deletePage(id);
        message.success('Page deleted successfully!');
      },
    });
  };

  const handleDuplicate = (page: CustomPage) => {
    const newName = `${page.name} (Copy)`;
    const autoPath = '/' + newName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    createPage({
      name: newName,
      path: autoPath,
      icon: page.icon,
      mode: page.mode,
      widgets: page.widgets.map(w => ({
        ...w,
        id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      })),
      order: pages.length + 1,
      enabled: false,
    });
    message.success(`"${page.name}" duplicated successfully!`);
  };

  const handleNew = () => {
    setEditingPage(null);
    form.resetFields();
    form.setFieldsValue({
      enabled: true,
      icon: 'AppstoreOutlined',
      mode: 'custom',
    });
    setIsModalOpen(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredPages.findIndex(p => p.id === active.id);
    const newIndex = filteredPages.findIndex(p => p.id === over.id);
    const newOrder = arrayMove(filteredPages, oldIndex, newIndex);

    // Update order for all pages
    newOrder.forEach((page, index) => {
      updatePage(page.id, { order: index + 1 });
    });

    message.success('Page order updated!');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(pages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pages-export-${Date.now()}.json`;
    link.click();
    message.success('Pages exported successfully!');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const result = event.target?.result;
          if (typeof result !== 'string') return;

          const importedPages = JSON.parse(result) as CustomPage[];
          if (Array.isArray(importedPages)) {
            importedPages.forEach(page => {
              createPage({
                name: page.name,
                path: page.path,
                icon: page.icon,
                mode: page.mode,
                widgets: page.widgets,
                order: page.order,
                enabled: page.enabled,
                description: page.description,
                templateId: page.templateId,
              });
            });
            message.success(`${importedPages.length} pages imported successfully!`);
          }
        } catch {
          message.error('Failed to import pages. Invalid file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div style={{ padding: 24, background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16, flexWrap: 'wrap', gap: 16 }}>
          <Col xs={24} md={12}>
            <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <AppstoreOutlined style={{ fontSize: 24 }} />
              </div>
              <span>Page Manager</span>
            </Title>
            <Text type="secondary" style={{ fontSize: 14, marginTop: 8, display: 'block' }}>
              Create and manage custom pages with drag-and-drop widgets
            </Text>
          </Col>
          <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Space size={8} wrap>
              <Tooltip title="Export all pages">
                <Button icon={<DownloadOutlined />} onClick={handleExport}>
                  Export
                </Button>
              </Tooltip>
              <Tooltip title="Import pages from file">
                <Button icon={<UploadOutlined />} onClick={handleImport}>
                  Import
                </Button>
              </Tooltip>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={handleNew}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                }}
              >
                Create New Page
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Statistics Cards with animations */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                background: 'linear-gradient(135deg, #e6f7ff 0%, #ffffff 100%)',
                border: '1px solid #91d5ff',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(24, 144, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Statistic
                title="Total Pages"
                value={stats.totalPages}
                prefix={<FileTextOutlined />}
                styles={{ content: { color: '#1890ff', fontWeight: 600 } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                background: 'linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)',
                border: '1px solid #b7eb8f',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(82, 196, 26, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Statistic
                title="Active Pages"
                value={stats.activePages}
                prefix={<CheckCircleOutlined />}
                styles={{ content: { color: '#52c41a', fontWeight: 600 } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                background: 'linear-gradient(135deg, #f9f0ff 0%, #ffffff 100%)',
                border: '1px solid #d3adf7',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(114, 46, 209, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Statistic
                title="Total Widgets"
                value={stats.totalWidgets}
                prefix={<AppstoreOutlined />}
                styles={{ content: { color: '#722ed1', fontWeight: 600 } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                background: 'linear-gradient(135deg, #fff7e6 0%, #ffffff 100%)',
                border: '1px solid #ffd591',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(250, 140, 22, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Statistic
                title="Hybrid Pages"
                value={stats.hybridPages}
                prefix={<BarChartOutlined />}
                styles={{ content: { color: '#fa8c16', fontWeight: 600 } }}
              />
            </Card>
          </Col>
        </Row>

        {/* Search and Filters */}
        <Card
          style={{
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12} lg={14}>
              <Search
                placeholder="Search pages by name, description, or path... (Press / to focus)"
                allowClear
                size="large"
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={12} md={6} lg={5}>
              <Segmented
                block
                options={[
                  { label: 'All', value: 'all' },
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ]}
                value={filterStatus}
                onChange={(value) => setFilterStatus(value as FilterStatus)}
              />
            </Col>
            <Col xs={12} md={6} lg={5}>
              <Segmented
                block
                options={[
                  { label: <UnorderedListOutlined />, value: 'list', title: 'List View' },
                  { label: <AppstoreOutlined />, value: 'grid', title: 'Grid View' },
                ]}
                value={viewMode}
                onChange={(value) => setViewMode(value as ViewMode)}
              />
            </Col>
          </Row>
        </Card>
      </div>

      {/* Pages List */}
      <Card
        title={
          <Space>
            <Text strong style={{ fontSize: 16 }}>Your Pages</Text>
            <Badge count={filteredPages.length} showZero style={{ backgroundColor: '#1890ff' }} />
            {searchTerm && <Tag color="blue">Filtered</Tag>}
          </Space>
        }
        extra={
          <Space>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Total: {pages.length} pages
            </Text>
            {filteredPages.length > 0 && (
              <Text type="secondary">
                • Drag to reorder
              </Text>
            )}
          </Space>
        }
      >
        {filteredPages.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              searchTerm || filterStatus !== 'all'
                ? 'No pages match your filters'
                : 'No pages yet. Create your first custom page!'
            }
          >
            {!searchTerm && filterStatus === 'all' && (
              <Button type="primary" icon={<PlusOutlined />} onClick={handleNew}>
                Create First Page
              </Button>
            )}
          </Empty>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredPages.map(p => p.id)} strategy={verticalListSortingStrategy}>
              {filteredPages.map((page) => (
                <SortablePageCard
                  key={page.id}
                  page={page}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggle={togglePage}
                  onDuplicate={handleDuplicate}
                  onView={(id: string) => navigate(`/pages/${id}`)}
                  onBuild={handleBuildPage}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <Space>
            <SettingOutlined />
            {editingPage ? 'Edit Page Settings' : 'Create New Page'}
          </Space>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingPage(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={700}
        okText={editingPage ? 'Save Changes' : 'Create Page'}
        confirmLoading={isLoading}
      >
        <Divider />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateOrUpdate}
          initialValues={{
            enabled: true,
            icon: 'AppstoreOutlined',
            mode: 'custom',
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Alert
                title={editingPage ? "Update Page Settings" : "Create Your Custom Page"}
                description={
                  editingPage
                    ? "Update your page configuration. Changes will be reflected immediately."
                    : "After creation, your page will be automatically added to the navigation menu. You can then add widgets and customize the layout using the visual builder."
                }
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />
            </Col>

            <Col span={24}>
              <Form.Item
                label="Page Name"
                name="name"
                rules={[{ required: true, message: 'Please enter a page name' }]}
              >
                <Input size="large" placeholder="e.g., HVAC Control, Lighting Dashboard" />
              </Form.Item>
            </Col>

            {/* Hidden field - always custom mode for full editability */}
            <Form.Item name="mode" hidden>
              <Input />
            </Form.Item>

            <Col span={24}>
              <Form.Item
                label="Icon"
                name="icon"
                rules={[{ required: true, message: 'Please select an icon' }]}
              >
                <Select
                  size="large"
                  showSearch
                  placeholder="Select an icon"
                >
                  {iconOptions.map((icon) => (
                    <Select.Option key={icon} value={icon}>
                      <Space>
                        <IconComponent iconName={icon} />
                        {icon.replace('Outlined', '')}
                      </Space>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Enable Page"
                name="enabled"
                valuePropName="checked"
                tooltip="Disabled pages won't appear in navigation"
              >
                <Switch
                  checkedChildren="Enabled"
                  unCheckedChildren="Disabled"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Keyboard Shortcuts Indicator */}
      <Tooltip title="Press ? for keyboard shortcuts" placement="left">
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1000,
          }}
          onClick={() => setShowKeyboardHelp(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
          }}
        >
          ?
        </div>
      </Tooltip>

      {/* Keyboard Shortcuts Help Modal */}
      <Modal
        title={
          <Space>
            <span style={{ fontSize: 18 }}>⌨️</span>
            <span>Keyboard Shortcuts</span>
          </Space>
        }
        open={showKeyboardHelp}
        onCancel={() => setShowKeyboardHelp(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setShowKeyboardHelp(false)}>
            Got it!
          </Button>
        ]}
        width={500}
      >
        <div style={{ padding: '16px 0' }}>
          <Space orientation="vertical" size={20} style={{ width: '100%' }}>
            <Row align="middle">
              <Col span={6}>
                <Tag color="blue" style={{ fontFamily: 'monospace', fontSize: 15, padding: '4px 12px' }}>N</Tag>
              </Col>
              <Col span={18}>
                <Text strong>Create new page</Text>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>
                <Tag color="blue" style={{ fontFamily: 'monospace', fontSize: 15, padding: '4px 12px' }}>/</Tag>
              </Col>
              <Col span={18}>
                <Text strong>Focus search bar</Text>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>
                <Tag color="blue" style={{ fontFamily: 'monospace', fontSize: 15, padding: '4px 12px' }}>?</Tag>
              </Col>
              <Col span={18}>
                <Text strong>Show this help dialog</Text>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={6}>
                <Tag color="blue" style={{ fontFamily: 'monospace', fontSize: 15, padding: '4px 12px' }}>Esc</Tag>
              </Col>
              <Col span={18}>
                <Text strong>Close modals</Text>
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <Alert
              title="Pro Tip"
              description="Use these shortcuts to navigate faster and boost your productivity!"
              type="info"
              showIcon
            />
          </Space>
        </div>
      </Modal>
    </div>
  );
}
