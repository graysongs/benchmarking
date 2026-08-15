import {
  Alert,
  Card,
  Col,
  List,
  Row,
  Space,
  Steps,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import {
  CodeOutlined,
  NodeIndexOutlined,
  SafetyCertificateOutlined,
  SyncOutlined,
  TableOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';

interface DecisionItem {
  icon: ReactNode;
  title: string;
  description: string;
}

const DECISIONS: DecisionItem[] = [
  {
    icon: <CodeOutlined style={{ fontSize: 28, color: '#6366f1' }} />,
    title: 'React SPA + TypeScript strict',
    description:
      'AI 编码工具语料最丰富的组合，生成质量最稳定；无 SEO 需求时保持纯 SPA，不引入 SSR。',
  },
  {
    icon: <TableOutlined style={{ fontSize: 28, color: '#6366f1' }} />,
    title: 'Ant Design + ProComponents',
    description:
      '中后台表格内编辑、行级校验、Drawer/Modal 表单都有成熟组件；MIT 协议商用友好。',
  },
  {
    icon: <NodeIndexOutlined style={{ fontSize: 28, color: '#6366f1' }} />,
    title: '同域路由级渐进替换',
    description:
      '不引入重型微前端，由 Nginx/网关按路由切流；已迁移模块走新应用，其余继续走旧应用。',
  },
  {
    icon: <SafetyCertificateOutlined style={{ fontSize: 28, color: '#6366f1' }} />,
    title: '黄金 E2E 基线先行',
    description:
      '同一套 Playwright 用例分别驱动旧版与新版，只切换 baseURL，确保用户可见行为一致。',
  },
];

const PIPELINE = [
  '资产盘点：导出路由、模块、API、组件依赖与第三方许可证清单。',
  '黄金测试录制：用 Playwright 锁定登录、权限和最高频业务旅程，不绑定旧 DOM 实现。',
  '固化 AI 规则包：目录规范、组件映射、API 调用、测试要求、禁止事项。',
  '模块级翻译：每次只迁移一个页面或模块，先生成业务规则清单，再生成代码与单测。',
  '同一套 E2E 验收：旧版与新版分别运行同一套用例，断言用户可见行为一致。',
  '灰度放量与回滚：按用户、组织、路由或比例放量，异常时 5 分钟内回滚。',
];

const SWITCH_POINTS = [
  {
    title: 'URL 与 API 契约不变',
    description: '深链接继续有效；接口优先保持兼容，必须变更时新增版本。',
  },
  {
    title: '按路由切流',
    description: '已迁移路径指向新应用，未迁移路径继续走旧应用，用户无感知。',
  },
  {
    title: '分步灰度',
    description: '内部用户、小比例、逐步放量，会话粘滞避免同一用户频繁横跳。',
  },
  {
    title: '一键回滚',
    description: '错误率、接口成功率或业务指标恶化时，可快速按路由回滚到旧版。',
  },
];

const STEPS = [
  { title: '盘点与 POC' },
  { title: '测试基线' },
  { title: '新骨架' },
  { title: '试点迁移' },
  { title: '批量迁移' },
  { title: '灰度全量' },
  { title: '旧版下线' },
];

const TABS = [
  {
    key: 'decision',
    label: '选型决策',
    children: (
      <List
        dataSource={DECISIONS}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={item.icon}
              title={<Typography.Text strong>{item.title}</Typography.Text>}
              description={item.description}
            />
          </List.Item>
        )}
      />
    ),
  },
  {
    key: 'pipeline',
    label: 'AI 重构流水线',
    children: (
      <div>
        {PIPELINE.map((step, index) => (
          <div className="pipeline-step" key={step}>
            <Tag color="blue">{String(index + 1).padStart(2, '0')}</Tag>
            <Typography.Text>{step}</Typography.Text>
          </div>
        ))}
      </div>
    ),
  },
  {
    key: 'switch',
    label: '无缝切换机制',
    children: (
      <Row gutter={[16, 16]}>
        {SWITCH_POINTS.map((point) => (
          <Col xs={24} md={12} key={point.title}>
            <Card size="small">
              <Typography.Text strong>{point.title}</Typography.Text>
              <Typography.Paragraph
                type="secondary"
                style={{ marginTop: 8, marginBottom: 0 }}
              >
                {point.description}
              </Typography.Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    ),
  },
];

export default function OverviewPage() {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div className="hero">
        <Typography.Title level={3} style={{ marginTop: 0 }}>
          可商用的前端现代化重构方案
        </Typography.Title>
        <Typography.Paragraph>
          本 Demo 展示的是方案本身：技术栈如何选择、AI 如何辅助模块级迁移、表格内编辑如何验证，
          以及同一套 E2E 测试如何支撑新旧系统无缝切换。
        </Typography.Paragraph>
        <Space wrap>
          <Tag color="cyan">React + TypeScript</Tag>
          <Tag color="cyan">Vite SPA</Tag>
          <Tag color="cyan">Ant Design</Tag>
          <Tag color="cyan">Playwright 黄金基线</Tag>
          <Tag color="cyan">同域渐进替换</Tag>
        </Space>
      </div>

      <Alert
        type="success"
        showIcon
        message="建议的最终组合"
        description="React + TypeScript + Vite + Ant Design 5/ProComponents + TanStack Query + Zustand + Vitest + Playwright，默认不上微前端、不上 SSR；复杂表格优先 ProTable POC，Excel 级需求再评估 AG Grid。"
      />

      <Row gutter={[16, 16]}>
        {DECISIONS.map((item) => (
          <Col xs={24} md={12} xl={6} key={item.title}>
            <Card className="section-card" style={{ height: '100%' }}>
              <Space direction="vertical" size={8}>
                {item.icon}
                <Typography.Text strong>{item.title}</Typography.Text>
                <Typography.Paragraph
                  type="secondary"
                  style={{ marginBottom: 0, minHeight: 88 }}
                >
                  {item.description}
                </Typography.Paragraph>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="迁移路线图" size="small">
        <Steps items={STEPS} size="small" responsive />
      </Card>

      <Card title="方案机制详解" size="small">
        <Tabs items={TABS} />
      </Card>

      <Alert
        type="info"
        showIcon
        icon={<SyncOutlined />}
        message="许可证提示"
        description="React、Vite、Ant Design、Zustand、Vitest 等主链路为 MIT 协议；Playwright 为 Apache-2.0。真正的合规审查重点是组件库、图表库、字体和图标等第三方依赖，选型后应生成许可证清单。"
      />
    </Space>
  );
}
