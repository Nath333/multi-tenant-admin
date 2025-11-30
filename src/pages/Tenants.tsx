import { useState, useMemo, useCallback } from 'react';
import { ProTable, type ProColumns } from '@ant-design/pro-components';
import {
  Tag, Button, Space, Modal, message, Form, Input, Select, Avatar
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined,
  UserOutlined, MailOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTenantsStore } from '../store/tenantsStore';
import type { Tenant } from '../services/mockData';
import {
  PAGE_CONTAINER_STYLE,
  PRIMARY_BUTTON_STYLE,
  PRO_TABLE_STYLE,
  PRO_TABLE_TABLE_STYLE,
  TABLE_HEADER_TITLE_STYLE,
  TABLE_HEADER_SUBTITLE_STYLE,
  TOTAL_COUNT_STYLE,
  MODAL_TITLE_STYLE,
  MODAL_HEADER_STYLE,
  MODAL_BODY_STYLE,
  MODAL_OK_BUTTON_PROPS,
  MODAL_CANCEL_BUTTON_PROPS,
  COLORS,
  createIconStyle,
} from '../styles/themeConstants';

// ============================================================================
// CONSTANTS
// ============================================================================

const ROLE_MAP: Record<string, { label: string; color: string }> = {
  free: { label: 'Admin', color: 'red' },
  pro: { label: 'User', color: 'blue' },
  enterprise: { label: 'Viewer', color: 'green' },
} as const;

const STATUS_COLORS: Record<string, string> = {
  active: 'success',
  inactive: 'default',
  suspended: 'error',
} as const;

const FORM_CONTAINER_STYLE = { marginTop: 20 } as const;

export default function TenantsPage() {
  const { t } = useTranslation();
  const { tenants, addTenant, updateTenant, deleteTenant } = useTenantsStore();

  // State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [form] = Form.useForm();

  // Handlers
  const handleAddTenant = useCallback(() => {
    form.validateFields()
      .then((values) => {
        addTenant({
          name: values.name,
          domain: values.domain,
          status: values.status || 'active',
          plan: values.plan,
        });
        message.success(t('tenants.tenantAdded'));
        setIsAddModalOpen(false);
        form.resetFields();
      })
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  }, [form, addTenant, t]);

  const handleEditTenant = useCallback(() => {
    if (!editingTenant) return;

    form.validateFields()
      .then((values) => {
        updateTenant(editingTenant.id, values);
        message.success(t('tenants.tenantUpdated'));
        setIsEditModalOpen(false);
        setEditingTenant(null);
        form.resetFields();
      })
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  }, [editingTenant, form, updateTenant, t]);

  const handleDeleteTenant = useCallback((record: Tenant) => {
    Modal.confirm({
      title: t('tenants.deleteTenant'),
      content: t('tenants.deleteConfirm', { name: record.name }),
      okText: t('common.delete'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      onOk: () => {
        deleteTenant(record.id);
        message.success(t('tenants.tenantDeleted'));
      },
    });
  }, [deleteTenant, t]);

  const openEditModal = useCallback((record: Tenant) => {
    setEditingTenant(record);
    form.setFieldsValue({
      name: record.name,
      domain: record.domain,
      plan: record.plan,
      status: record.status,
    });
    setIsEditModalOpen(true);
  }, [form]);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
    form.resetFields();
  }, [form]);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingTenant(null);
    form.resetFields();
  }, [form]);

  const columns = useMemo<ProColumns<Tenant>[]>(() => [
    {
      title: 'Team Member',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Tenant, b: Tenant) => a.name.localeCompare(b.name),
      render: (_: unknown, record: Tenant) => (
        <Space>
          <Avatar
            src={`https://i.pravatar.cc/150?u=${record.name}`}
            icon={<UserOutlined />}
            size={40}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#999' }}>
              <MailOutlined style={{ marginRight: 4 }} />
              {record.domain}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'plan',
      key: 'plan',
      filters: [
        { text: 'Admin', value: 'free' },
        { text: 'User', value: 'pro' },
        { text: 'Viewer', value: 'enterprise' },
      ],
      onFilter: (value: React.Key | boolean, record: Tenant) => record.plan === value,
      render: (_: unknown, record: Tenant) => {
        const role = ROLE_MAP[record.plan] || { label: record.plan, color: 'default' };
        return (
          <Tag color={role.color}>
            {role.label.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: t('common.active'), value: 'active' },
        { text: t('common.inactive'), value: 'inactive' },
        { text: 'Suspended', value: 'suspended' },
      ],
      onFilter: (value: React.Key | boolean, record: Tenant) => record.status === value,
      render: (_: unknown, record: Tenant) => (
        <Tag color={STATUS_COLORS[record.status]}>
          {record.status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'dataUsage',
      key: 'dataUsage',
      render: (_: unknown, record: Tenant) => (
        <span>{record.dataUsage || 'Engineering'}</span>
      ),
    },
    {
      title: 'Last Active',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: Tenant, b: Tenant) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (_: unknown, record: Tenant) => new Date(record.createdAt).toLocaleDateString(),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      fixed: 'right' as const,
      width: 180,
      render: (_: unknown, record: Tenant) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            {t('common.edit')}
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTenant(record)}
          >
            {t('common.delete')}
          </Button>
        </Space>
      ),
    },
  ], [t]);

  return (
    <div style={PAGE_CONTAINER_STYLE}>
      <ProTable
        columns={columns}
        dataSource={tenants}
        rowKey="id"
        search={false}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => (
            <span style={TOTAL_COUNT_STYLE}>
              Total {total} team members
            </span>
          ),
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalOpen(true)}
            size="large"
            style={PRIMARY_BUTTON_STYLE}
          >
            Invite Team Member
          </Button>,
        ]}
        headerTitle={
          <div>
            <div style={TABLE_HEADER_TITLE_STYLE}>
              <TeamOutlined style={createIconStyle(COLORS.primary.start)} />
              Team Members
            </div>
            <div style={TABLE_HEADER_SUBTITLE_STYLE}>
              Manage your team members and their access levels
            </div>
          </div>
        }
        cardBordered
        style={PRO_TABLE_STYLE}
        tableStyle={PRO_TABLE_TABLE_STYLE}
      />

      {/* Add Team Member Modal */}
      <Modal
        title={<div style={MODAL_TITLE_STYLE}>Invite Team Member</div>}
        open={isAddModalOpen}
        onOk={handleAddTenant}
        onCancel={handleCloseAddModal}
        okText="Send Invitation"
        cancelText={t('common.cancel')}
        width={640}
        destroyOnHidden
        styles={{
          header: MODAL_HEADER_STYLE,
          body: MODAL_BODY_STYLE,
        }}
        okButtonProps={MODAL_OK_BUTTON_PROPS}
        cancelButtonProps={MODAL_CANCEL_BUTTON_PROPS}
      >
        <Form
          form={form}
          layout="vertical"
          style={FORM_CONTAINER_STYLE}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: 'Please enter the member name' },
              { min: 2, message: 'Name must be at least 2 characters' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            name="domain"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter an email address' },
              {
                type: 'email',
                message: 'Please enter a valid email address',
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="john.doe@company.com" />
          </Form.Item>

          <Form.Item
            name="plan"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select a role">
              <Select.Option value="free">Admin - Full access</Select.Option>
              <Select.Option value="pro">User - Standard access</Select.Option>
              <Select.Option value="enterprise">Viewer - Read-only</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label={t('common.status')}
            initialValue="active"
          >
            <Select>
              <Select.Option value="active">{t('common.active')}</Select.Option>
              <Select.Option value="inactive">{t('common.inactive')}</Select.Option>
              <Select.Option value="suspended">Suspended</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Team Member Modal */}
      <Modal
        title={
          <div style={MODAL_TITLE_STYLE}>
            Edit Team Member: {editingTenant?.name || ''}
          </div>
        }
        open={isEditModalOpen}
        onOk={handleEditTenant}
        onCancel={handleCloseEditModal}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
        width={640}
        destroyOnHidden
        styles={{
          header: MODAL_HEADER_STYLE,
          body: MODAL_BODY_STYLE,
        }}
        okButtonProps={MODAL_OK_BUTTON_PROPS}
        cancelButtonProps={MODAL_CANCEL_BUTTON_PROPS}
      >
        <Form
          form={form}
          layout="vertical"
          style={FORM_CONTAINER_STYLE}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: 'Please enter the member name' },
              { min: 2, message: 'Name must be at least 2 characters' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            name="domain"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter an email address' },
              {
                type: 'email',
                message: 'Please enter a valid email address',
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="john.doe@company.com" />
          </Form.Item>

          <Form.Item
            name="plan"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select a role">
              <Select.Option value="free">Admin - Full access</Select.Option>
              <Select.Option value="pro">User - Standard access</Select.Option>
              <Select.Option value="enterprise">Viewer - Read-only</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label={t('common.status')}
          >
            <Select>
              <Select.Option value="active">{t('common.active')}</Select.Option>
              <Select.Option value="inactive">{t('common.inactive')}</Select.Option>
              <Select.Option value="suspended">Suspended</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
