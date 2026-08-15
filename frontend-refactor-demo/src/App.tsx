import { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  DashboardOutlined,
  EditOutlined,
  ExperimentOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import OverviewPage from './pages/OverviewPage';
import TechStackPage from './pages/TechStackPage';
import MigrationPlanPage from './pages/MigrationPlanPage';
import TestingPage from './pages/TestingPage';

const { Header, Sider, Content } = Layout;

const MENU_ITEMS = [
  { key: '/overview', icon: <DashboardOutlined />, label: '方案总览' },
  { key: '/tech-stack', icon: <ExperimentOutlined />, label: '技术栈详解' },
  { key: '/migration-plan', icon: <EditOutlined />, label: '迁移计划表格' },
  { key: '/testing', icon: <SafetyCertificateOutlined />, label: '测试与切换' },
];

function Shell() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = MENU_ITEMS.some((item) => item.key === location.pathname)
    ? location.pathname
    : '/overview';

  return (
    <Layout className="app-shell">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        className="app-sider"
      >
        <div className="logo">            <span className="logo-mark">
              <RocketOutlined />
            </span>
            {!collapsed && <span className="logo-text">前端重构方案</span>}</div>
        <Menu
          theme="light"
          mode="inline"
            className="app-menu"
          selectedKeys={[selectedKey]}
          items={MENU_ITEMS}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className="app-header">
            <div className="app-header-title">
          <Typography.Title level={4} className="app-title">
            前端现代化重构 · 产品化方案演示
          </Typography.Title>
              <Typography.Text type="secondary" className="app-subtitle">
                React + TypeScript + Ant Design
              </Typography.Text>
            </div>
            <div className="app-header-badge">
              <span className="status-dot" />
              可交互 Demo
            </div>
        </Header>
        <Content className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/tech-stack" element={<TechStackPage />} />
            <Route path="/migration-plan" element={<MigrationPlanPage />} />
            <Route path="/testing" element={<TestingPage />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}
