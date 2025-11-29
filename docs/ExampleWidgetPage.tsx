/**
 * Example Widget Page Template
 *
 * This is a template showing how to create a new page with widget support.
 * Copy this file and modify it to create your own custom page with widgets.
 */

import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { RocketOutlined, StarOutlined } from '@ant-design/icons';
import WidgetLayout from '../components/WidgetLayout';

const ExampleWidgetPage: React.FC = () => {
  // Your custom page content goes here
  const customContent = (
    <>
      {/* Add your custom UI components here */}
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Example Metric 1"
              value={123}
              prefix={<RocketOutlined />}
              styles={{ content: { color: '#3f8600' } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Example Metric 2"
              value={456}
              prefix={<StarOutlined />}
              styles={{ content: { color: '#1890ff' } }}
            />
          </Card>
        </Col>
      </Row>

      {/* Add more custom content as needed */}
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        <Col xs={24}>
          <Card title="Custom Content Section" variant="borderless">
            <p>This is your custom page content. It will appear above the widget grid.</p>
            <p>You can add any React components, charts, forms, or controls here.</p>
          </Card>
        </Col>
      </Row>
    </>
  );

  return (
    <WidgetLayout
      pageId="example-widget-page"  // IMPORTANT: Change this to a unique ID for your page
      title="Example Widget Page"
      description="This is an example page showing how to use widgets"
      customContent={customContent}
    />
  );
};

export default ExampleWidgetPage;

/**
 * HOW TO USE THIS TEMPLATE:
 *
 * 1. Copy this file and rename it (e.g., MyNewPage.tsx)
 * 2. Change the pageId to something unique (e.g., "my-new-page")
 * 3. Update the title and description
 * 4. Add your custom content in the customContent section
 * 5. Import and add the route in App.tsx:
 *    <Route path="/my-new-page" element={<MyNewPage />} />
 * 6. Add to navigation in MainLayout if needed
 *
 * FEATURES INCLUDED:
 * - Drag & drop widget positioning
 * - Add/remove widgets using the + button
 * - Edit mode toggle for rearranging
 * - Automatic save to local storage
 * - Responsive grid layout
 * - All available widget types
 */
