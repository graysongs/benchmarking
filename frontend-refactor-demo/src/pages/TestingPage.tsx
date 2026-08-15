import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Progress,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckCircleOutlined, ExperimentOutlined } from '@ant-design/icons';

interface TestLayer {
  key: string;
  layer: string;
  tool: string;
  signal: string;
}

const TEST_LAYERS: TestLayer[] = [
  {
    key: 'unit',
    layer: '单元测试',
    tool: 'Vitest',
    signal: '业务函数、权限逻辑、状态机，断言必须来自已确认的业务规则清单。',
  },
  {
    key: 'component',
    layer: '组件测试',
    tool: 'Testing Library',
    signal: '按用户视角查询和交互，避免测试绑定 DOM 实现细节。',
  },
  {
    key: 'e2e',
    layer: '黄金 E2E',
    tool: 'Playwright',
    signal: '同一套用例分别驱动旧版与新版，仅切换 baseURL，验证用户可见行为一致。',
  },
  {
    key: 'visual',
    layer: '视觉回归',
    tool: 'Playwright 截图 / Chromatic',
    signal: '关键页面截图基线，防止重构后 UI 明显回退。',
  },
  {
    key: 'contract',
    layer: 'API 契约',
    tool: 'OpenAPI + Schema 校验',
    signal: '防止 AI 生成客户端时编造接口路径与字段。',
  },
  {
    key: 'a11y',
    layer: '可访问性',
    tool: 'axe-core',
    signal: '防止重构后键盘操作和可访问性退化。',
  },
  {
    key: 'perf',
    layer: '性能',
    tool: 'Lighthouse CI / Web Vitals',
    signal: '防止重构后页面性能恶化。',
  },
];

const GATES = [
  {
    id: 'baseline',
    title: '黄金 E2E 基线已录制',
    description: '覆盖登录、权限与最高频业务主流程，不依赖旧系统 DOM 结构。',
  },
  {
    id: 'url',
    title: 'URL 与 API 契约保持不变',
    description: '深链接继续有效，接口不做破坏性变更，必要时新增版本。',
  },
  {
    id: 'canary',
    title: '具备按路由灰度与快速回滚能力',
    description: '已迁移模块按路由切流，异常时可在分钟级回滚到旧版。',
  },
  {
    id: 'visual',
    title: '关键页面截图基线已建立',
    description: '用视觉回归控制明显 UI 回退，不追求逐像素一致。',
  },
  {
    id: 'review',
    title: 'AI 产物已通过人工评审',
    description: '业务规则清单经过确认，代码评审和业务抽查不能省略。',
  },
  {
    id: 'monitor',
    title: '错误率与业务监控已接入',
    description: '错误率、接口成功率、页面性能恶化超过阈值时自动停止放量。',
  },
];

const columns: ColumnsType<TestLayer> = [
  {
    title: '测试层级',
    dataIndex: 'layer',
    width: 150,
    render: (value: string) => <Typography.Text strong>{value}</Typography.Text>,
  },
  {
    title: '工具',
    dataIndex: 'tool',
    width: 240,
    render: (value: string) => <Tag color="blue">{value}</Tag>,
  },
  {
    title: '验收信号',
    dataIndex: 'signal',
  },
];

export default function TestingPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [passed, setPassed] = useState<string[]>(['baseline']);
  const [audited, setAudited] = useState(false);

  const allPassed = passed.length === GATES.length;
  const percent = Math.round((passed.length / GATES.length) * 100);

  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Typography.Title level={3} className="page-title">
            测试与无缝切换
          </Typography.Title>
          <Typography.Paragraph type="secondary" className="page-subtitle">
            自动测试不是重构完成后的补充，而是切换前的安全网。核心原则：同一套 E2E
            用例必须能在旧版和新版上运行，只切换 baseURL，断言用户可见行为。
          </Typography.Paragraph>
        </div>

        <Alert
          type="info"
          showIcon
          icon={<ExperimentOutlined />}
          message="同一套用例，两个目标地址"
          description={
            <pre className="code-block" style={{ marginTop: 12 }}>
              {'E2E_BASE_URL=https://legacy.example.internal npm run test:e2e\nE2E_BASE_URL=https://new.example.internal npm run test:e2e'}
            </pre>
          }
        />

        <Card title="测试分层" size="small">
          <Table<TestLayer>
            rowKey="key"
            dataSource={TEST_LAYERS}
            columns={columns}
            pagination={false}
            scroll={{ x: 720 }}
          />
        </Card>

        <Card title="切换验收门槛" size="small">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Progress percent={percent} status={allPassed ? 'success' : 'active'} />
            <Checkbox.Group
              value={passed}
              onChange={(values) => setPassed(values as string[])}
              style={{ width: '100%' }}
            >
              <Row gutter={[16, 16]}>
                {GATES.map((gate) => (
                  <Col xs={24} md={12} key={gate.id}>
                    <Card
                      size="small"
                      className={passed.includes(gate.id) ? 'gate-card checked' : 'gate-card'}
                    >
                      <Checkbox value={gate.id}>
                        <Typography.Text strong>{gate.title}</Typography.Text>
                      </Checkbox>
                      <Typography.Paragraph
                        type="secondary"
                        style={{ margin: '8px 0 0 24px' }}
                      >
                        {gate.description}
                      </Typography.Paragraph>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>

            <Space wrap>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                disabled={!allPassed}
                onClick={() => {
                  setAudited(true);
                  messageApi.success('验收门槛已通过，可以进入下一轮灰度。');
                }}
              >
                模拟验收
              </Button>
              <Button
                onClick={() => {
                  setAudited(false);
                  messageApi.info('已清空验收结论');
                }}
              >
                重置验收结论
              </Button>
            </Space>

            {audited && allPassed && (
              <Alert
                type="success"
                showIcon
                message="验收通过"
                description="同一套 Playwright 用例已在新旧两版通过，可按路由开始灰度放量。"
              />
            )}
          </Space>
        </Card>
      </Space>
    </>
  );
}
