import { ProCard } from '@ant-design/pro-components';
import { Form, Input, Switch, Select, Button, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { SettingOutlined } from '@ant-design/icons';
import {
  PAGE_CONTAINER_STYLE,
  PAGE_HEADER_STYLE,
  PAGE_TITLE_STYLE,
  PAGE_DESCRIPTION_STYLE,
  PRIMARY_BUTTON_STYLE,
  SECONDARY_BUTTON_STYLE,
  CARD_STYLE,
  COLORS,
  createIconStyle,
} from '../styles/themeConstants';

// ============================================================================
// CONSTANTS
// ============================================================================

const CARD_TITLE_STYLE = {
  fontSize: 16,
  fontWeight: 700,
  color: COLORS.text.primary,
} as const;

const CARD_HEAD_STYLE = {
  borderBottom: `1px solid ${COLORS.border.light}`,
  padding: '16px 24px',
} as const;

const CARD_BODY_STYLE = {
  padding: '24px',
} as const;

export default function SettingsPage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSave = () => {
    message.success(t('settings.settingsSaved'));
  };

  return (
    <div style={PAGE_CONTAINER_STYLE}>
      <div style={PAGE_HEADER_STYLE}>
        <h2 style={PAGE_TITLE_STYLE}>
          <SettingOutlined style={createIconStyle(COLORS.primary.start, 20)} />
          {t('settings.title')}
        </h2>
        <p style={PAGE_DESCRIPTION_STYLE}>
          Configure your application preferences and settings
        </p>
      </div>

      <ProCard
        title={<span style={CARD_TITLE_STYLE}>{t('settings.general')}</span>}
        style={{ ...CARD_STYLE, marginBottom: 20 }}
        headStyle={CARD_HEAD_STYLE}
        bodyStyle={CARD_BODY_STYLE}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            tenantName: 'Acme Corporation',
            timezone: 'UTC',
            language: 'fr',
            dateFormat: 'YYYY-MM-DD',
          }}
          onFinish={handleSave}
        >
          <Form.Item
            label={t('settings.tenantName')}
            name="tenantName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={t('settings.timezone')} name="timezone">
            <Select>
              <Select.Option value="UTC">{t('settings.timezones.utc')}</Select.Option>
              <Select.Option value="America/New_York">
                {t('settings.timezones.eastern')}
              </Select.Option>
              <Select.Option value="America/Los_Angeles">
                {t('settings.timezones.pacific')}
              </Select.Option>
              <Select.Option value="Europe/London">{t('settings.timezones.london')}</Select.Option>
              <Select.Option value="Asia/Tokyo">{t('settings.timezones.tokyo')}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label={t('settings.language')} name="language">
            <Select>
              <Select.Option value="en">{t('settings.languages.en')}</Select.Option>
              <Select.Option value="es">{t('settings.languages.es')}</Select.Option>
              <Select.Option value="fr">{t('settings.languages.fr')}</Select.Option>
              <Select.Option value="de">{t('settings.languages.de')}</Select.Option>
              <Select.Option value="zh">{t('settings.languages.zh')}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label={t('settings.dateFormat')} name="dateFormat">
            <Select>
              <Select.Option value="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
              <Select.Option value="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
              <Select.Option value="DD/MM/YYYY">DD/MM/YYYY</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space size={12}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={PRIMARY_BUTTON_STYLE}
              >
                {t('settings.saveChanges')}
              </Button>
              <Button
                onClick={() => form.resetFields()}
                size="large"
                style={SECONDARY_BUTTON_STYLE}
              >
                {t('common.reset')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </ProCard>

      <ProCard
        title={<span style={CARD_TITLE_STYLE}>{t('settings.notifications')}</span>}
        style={{ ...CARD_STYLE, marginBottom: 20 }}
        headStyle={CARD_HEAD_STYLE}
        bodyStyle={CARD_BODY_STYLE}
      >
        <Form
          layout="vertical"
          initialValues={{
            emailNotifications: true,
            pushNotifications: true,
            smsNotifications: false,
            deviceAlerts: true,
          }}
        >
          <Form.Item label={t('settings.emailNotifications')} name="emailNotifications" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label={t('settings.pushNotifications')} name="pushNotifications" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label={t('settings.smsNotifications')} name="smsNotifications" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label={t('settings.deviceAlerts')} name="deviceAlerts" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </ProCard>

      <ProCard
        title={<span style={CARD_TITLE_STYLE}>{t('settings.security')}</span>}
        style={{ ...CARD_STYLE, marginBottom: 20 }}
        headStyle={CARD_HEAD_STYLE}
        bodyStyle={CARD_BODY_STYLE}
      >
        <Form
          layout="vertical"
          initialValues={{
            twoFactor: false,
            sessionTimeout: 30,
            ipWhitelist: false,
          }}
        >
          <Form.Item label={t('settings.twoFactor')} name="twoFactor" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label={t('settings.sessionTimeout')} name="sessionTimeout">
            <Input type="number" />
          </Form.Item>

          <Form.Item label={t('settings.ipWhitelist')} name="ipWhitelist" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </ProCard>
    </div>
  );
}
