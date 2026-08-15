import React from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import App from './App';
import './styles.css';

dayjs.locale('zh-cn');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#6366f1',
            colorInfo: '#6366f1',
            colorSuccess: '#10b981',
            colorWarning: '#f59e0b',
            colorError: '#f43f5e',
            colorLink: '#6366f1',
            colorTextBase: '#1e293b',
            colorTextSecondary: '#64748b',
            colorBgLayout: '#f6f7fb',
            colorBgContainer: '#ffffff',
            colorBorder: '#e7eaf3',
            colorBorderSecondary: '#eef1f7',
          borderRadius: 12,
            borderRadiusLG: 18,
            borderRadiusSM: 8,
            controlHeight: 38,
            fontFamily:
              "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
        },
        components: {
          Layout: {
              bodyBg: 'transparent',
              headerBg: 'rgba(255, 255, 255, 0.86)',
              headerPadding: '0 28px',
              headerHeight: 72,
              siderBg: 'rgba(255, 255, 255, 0.92)',
            },
            Menu: {
              activeBarBorderWidth: 0,
              iconSize: 17,
              itemBg: 'transparent',
              itemColor: '#64748b',
              itemHoverBg: '#f1f5f9',
              itemHoverColor: '#1e293b',
              itemSelectedBg: '#eef2ff',
              itemSelectedColor: '#4f46e5',
              itemBorderRadius: 12,
              itemHeight: 44,
              itemMarginBlock: 6,
              itemMarginInline: 12,
            },
            Button: {
              borderRadius: 10,
              controlHeight: 38,
              fontWeight: 500,
              primaryShadow: '0 8px 20px rgba(99, 102, 241, 0.22)',
            },
            Table: {
                          borderColor: '#eef1f7',
              cellPaddingBlock: 16,
              headerColor: '#64748b',
              headerSplitColor: 'transparent',
              rowHoverBg: '#f8fafc',
              headerBg: '#f8fafc',
          },
        },
      }}
    >
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  </React.StrictMode>,
);
