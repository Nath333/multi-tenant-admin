import { useState, useMemo, useCallback } from 'react';
import { ProTable, type ProColumns } from '@ant-design/pro-components';
import {
  Tag, Avatar, Button, Space, Modal, Form, Input, Select, message
} from 'antd';
import {
  PlusOutlined, UserOutlined, PhoneOutlined, MailOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { mockTenants } from '../services/mockData';
import { useAuthStore } from '../store/authStore';
import { useUsersStore } from '../store/usersStore';
import type { User } from '../services/mockData';
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

const ROLE_COLORS: Record<string, string> = {
  superadmin: 'red',
  admin: 'blue',
  user: 'default',
  'page-manager': 'purple',
} as const;

const ROLE_FILTERS = [
  { text: 'Super Admin', value: 'superadmin' },
  { text: 'Admin', value: 'admin' },
  { text: 'User', value: 'user' },
  { text: 'Page Manager', value: 'page-manager' },
];

const FORM_CONTAINER_STYLE = { marginTop: 20 } as const;

// Types
type UserWithTenant = User & { tenantName: string };

export default function UsersPage() {
  const { t } = useTranslation();
  const { currentTenant } = useAuthStore();
  const { users, addUser, updateUser, deleteUser, toggleUserStatus, getUsersByTenant } = useUsersStore();

  // State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // Memoized values
  const tenantMap = useMemo(() =>
    new Map(mockTenants.map(tenant => [tenant.id, tenant.name])),
    []
  );

  // eslint-disable-next-line react-hooks/preserve-manual-memoization -- intentional dependency on specific properties
  const tenantUsers = useMemo<UserWithTenant[]>(() => {
    const filteredUsers = currentTenant?.id ? getUsersByTenant(currentTenant.id) : users;
    return filteredUsers.map((user) => ({
      ...user,
      tenantName: tenantMap.get(user.tenantId) || 'Unknown',
    }));
  }, [currentTenant?.id, users, getUsersByTenant, tenantMap]);

  const statusFilters = useMemo(() => [
    { text: t('common.active'), value: 'active' },
    { text: t('common.inactive'), value: 'inactive' },
  ], [t]);

  // Handlers
  const handleAddUser = useCallback(() => {
    form.validateFields()
      .then((values) => {
        addUser({
          ...values,
          tenantId: currentTenant?.id || 'tenant-1',
          status: values.status || 'active',
        });
        message.success(t('users.userAdded'));
        setIsAddModalOpen(false);
        form.resetFields();
      })
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  }, [form, addUser, currentTenant?.id, t]);

  const handleEditUser = useCallback(() => {
    if (!editingUser) return;

    form.validateFields()
      .then((values) => {
        updateUser(editingUser.id, values);
        message.success(t('users.userUpdated'));
        setIsEditModalOpen(false);
        setEditingUser(null);
        form.resetFields();
      })
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  }, [editingUser, form, updateUser, t]);

  const handleToggleStatus = useCallback((record: User) => {
    Modal.confirm({
      title: record.status === 'active'
        ? t('users.deactivateUser')
        : t('users.activateUser'),
      content: record.status === 'active'
        ? t('users.deactivateConfirm', { name: record.name })
        : t('users.activateConfirm', { name: record.name }),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onOk: () => {
        toggleUserStatus(record.id);
        message.success(
          record.status === 'active'
            ? t('users.userDeactivated')
            : t('users.userActivated')
        );
      },
    });
  }, [toggleUserStatus, t]);

  const handleDeleteUser = useCallback((record: User) => {
    Modal.confirm({
      title: t('users.deleteUser'),
      content: t('users.deleteConfirm', { name: record.name }),
      okText: t('common.delete'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      onOk: () => {
        deleteUser(record.id);
        message.success(t('users.userDeleted'));
      },
    });
  }, [deleteUser, t]);

  const openEditModal = useCallback((record: User) => {
    setEditingUser(record);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      role: record.role,
      phone: record.phone,
      department: record.department,
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
    setEditingUser(null);
    form.resetFields();
  }, [form]);

  const columns = useMemo<ProColumns<UserWithTenant>[]>(() => [
    {
      title: t('users.user'),
      dataIndex: 'name',
      key: 'name',
      render: (_: unknown, record: UserWithTenant) => (
        <Space>
          <Avatar
            src={record.avatar}
            icon={!record.avatar && <UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <Space style={{ fontSize: 12, color: '#999' }} size={4}>
              <MailOutlined />
              <span>{record.email}</span>
            </Space>
          </div>
        </Space>
      ),
    },
    {
      title: t('users.role'),
      dataIndex: 'role',
      key: 'role',
      filters: ROLE_FILTERS,
      onFilter: (value: React.Key | boolean, record: UserWithTenant) => record.role === value,
      render: (_: unknown, record: UserWithTenant) => {
        return (
          <Tag color={ROLE_COLORS[record.role]}>
            {record.role.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Contact',
      dataIndex: 'phone',
      key: 'phone',
      render: (_: unknown, record: UserWithTenant) => (
        <div>
          {record.phone && (
            <Space style={{ fontSize: 12 }} size={4}>
              <PhoneOutlined style={{ color: '#52c41a' }} />
              <span>{record.phone}</span>
            </Space>
          )}
          {record.department && (
            <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
              {record.department}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('users.tenant'),
      dataIndex: 'tenantName',
      key: 'tenantName',
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      filters: statusFilters,
      onFilter: (value: React.Key | boolean, record: UserWithTenant) => record.status === value,
      render: (_: unknown, record: UserWithTenant) => (
        <Tag color={record.status === 'active' ? 'success' : 'default'}>
          {record.status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: t('users.lastLogin'),
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      sorter: (a: UserWithTenant, b: UserWithTenant) => new Date(a.lastLogin || 0).getTime() - new Date(b.lastLogin || 0).getTime(),
      render: (_: unknown, record: UserWithTenant) => record.lastLogin ? new Date(record.lastLogin).toLocaleString() : '-',
    },
    {
      title: t('common.actions'),
      key: 'actions',
      fixed: 'right' as const,
      width: 200,
      render: (_: unknown, record: User) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => openEditModal(record)}
          >
            {t('common.edit')}
          </Button>
          <Button
            type="link"
            size="small"
            danger={record.status === 'active'}
            onClick={() => handleToggleStatus(record)}
          >
            {record.status === 'active' ? t('users.deactivate') : t('users.activate')}
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleDeleteUser(record)}
          >
            {t('common.delete')}
          </Button>
        </Space>
      ),
    },
  ], [t, statusFilters, handleDeleteUser, handleToggleStatus, openEditModal]);

  return (
    <div style={PAGE_CONTAINER_STYLE}>
      <ProTable
        columns={columns}
        dataSource={tenantUsers}
        rowKey="id"
        search={false}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => (
            <span style={TOTAL_COUNT_STYLE}>
              Total {total} users for {currentTenant?.name || 'tenant'}
            </span>
          ),
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setIsAddModalOpen(true)}
            style={PRIMARY_BUTTON_STYLE}
          >
            {t('users.addUser')}
          </Button>,
        ]}
        headerTitle={
          <div>
            <div style={TABLE_HEADER_TITLE_STYLE}>
              <UserOutlined style={createIconStyle(COLORS.primary.start)} />
              {t('users.title')}
            </div>
            <div style={TABLE_HEADER_SUBTITLE_STYLE}>
              Manage user accounts and permissions
            </div>
          </div>
        }
        cardBordered
        style={PRO_TABLE_STYLE}
        tableStyle={PRO_TABLE_TABLE_STYLE}
      />

      {/* Add User Modal */}
      <Modal
        title={<div style={MODAL_TITLE_STYLE}>{t('users.addUser')}</div>}
        open={isAddModalOpen}
        onOk={handleAddUser}
        onCancel={handleCloseAddModal}
        okText={t('common.create')}
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
            label={t('users.userName')}
            rules={[
              { required: true, message: t('users.userNameRequired') },
              { min: 2, message: t('users.userNameMin') },
            ]}
          >
            <Input placeholder={t('users.userNamePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="email"
            label={t('users.email')}
            rules={[
              { required: true, message: t('users.emailRequired') },
              { type: 'email', message: t('users.emailInvalid') },
            ]}
          >
            <Input placeholder={t('users.emailPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="role"
            label={t('users.role')}
            rules={[{ required: true, message: t('users.roleRequired') }]}
          >
            <Select placeholder={t('users.rolePlaceholder')}>
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="page-manager">Page Manager</Select.Option>
              <Select.Option value="superadmin">Super Admin</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="phone"
            label={t('users.phone')}
          >
            <Input placeholder={t('users.phonePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="department"
            label={t('users.department')}
          >
            <Input placeholder={t('users.departmentPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="status"
            label={t('common.status')}
            initialValue="active"
          >
            <Select>
              <Select.Option value="active">{t('common.active')}</Select.Option>
              <Select.Option value="inactive">{t('common.inactive')}</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title={<div style={MODAL_TITLE_STYLE}>{t('users.editUser')}</div>}
        open={isEditModalOpen}
        onOk={handleEditUser}
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
            label={t('users.userName')}
            rules={[
              { required: true, message: t('users.userNameRequired') },
              { min: 2, message: t('users.userNameMin') },
            ]}
          >
            <Input placeholder={t('users.userNamePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="email"
            label={t('users.email')}
            rules={[
              { required: true, message: t('users.emailRequired') },
              { type: 'email', message: t('users.emailInvalid') },
            ]}
          >
            <Input placeholder={t('users.emailPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="role"
            label={t('users.role')}
            rules={[{ required: true, message: t('users.roleRequired') }]}
          >
            <Select placeholder={t('users.rolePlaceholder')}>
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="page-manager">Page Manager</Select.Option>
              <Select.Option value="superadmin">Super Admin</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="phone"
            label={t('users.phone')}
          >
            <Input placeholder={t('users.phonePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="department"
            label={t('users.department')}
          >
            <Input placeholder={t('users.departmentPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="status"
            label={t('common.status')}
          >
            <Select>
              <Select.Option value="active">{t('common.active')}</Select.Option>
              <Select.Option value="inactive">{t('common.inactive')}</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
