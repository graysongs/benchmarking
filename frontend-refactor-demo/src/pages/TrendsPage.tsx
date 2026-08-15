import {
  Alert,
  Card,
  Col,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  BarChartOutlined,
  GlobalOutlined,
  LineChartOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import {
  AI_METRICS,
  NPM_TRENDS,
  SOURCES,
  TRENDING_REPOS,
  TRENDING_SUMMARY,
  TREND_MAPPINGS,
} from '../data/trendData';
import type { NpmTrend, TrendMapping } from '../data/trendData';

const TIER_META = {
  boom: { color: 'volcano', label: '爆发' },
  fast: { color: 'blue', label: '高速' },
  steady: { color: 'default', label: '平稳' },
} as const;

function formatCount(n: number): string {
  if (n >= 1e8) return `${(n / 1e8).toFixed(2)} 亿`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} 百万`;
  if (n >= 1e4) return `${(n / 1e4).toFixed(0)} 万`;
  return String(n);
}

/** 条形图按 +400% 封顶，避免 rolldown 之类极端值压扁其余条目 */
function barPercent(growth: number): number {
  return Math.min(growth, 400) / 4;
}

const npmColumns: ColumnsType<NpmTrend> = [
  {
    title: '包',
    dataIndex: 'name',
    width: 200,
    render: (name: string, row) => (
      <Space size={6}>
        <Typography.Text strong>{name}</Typography.Text>
        <Tag color={TIER_META[row.tier].color}>{TIER_META[row.tier].label}</Tag>
      </Space>
    ),
  },
  {
    title: '类别',
    dataIndex: 'category',
    width: 110,
  },
  {
    title: '一年前月下载',
    dataIndex: 'yearAgo',
    width: 130,
    align: 'right',
    render: (v: number) => formatCount(v),
  },
  {
    title: '最近月下载',
    dataIndex: 'now',
    width: 130,
    align: 'right',
    render: (v: number) => formatCount(v),
  },
  {
    title: '同比增速',
    dataIndex: 'growth',
    render: (growth: number) => (
      <Space size={8} style={{ width: '100%' }}>
        <Progress
          percent={barPercent(growth)}
          showInfo={false}
          strokeColor={growth >= 200 ? '#7c3aed' : '#1677ff'}
          style={{ width: 180 }}
        />
        <Typography.Text strong style={{ minWidth: 76 }}>
          +{growth.toLocaleString('en-US')}%
        </Typography.Text>
      </Space>
    ),
  },
];

const mappingColumns: ColumnsType<TrendMapping> = [
  {
    title: 'AI 带来的变化',
    dataIndex: 'trend',
    width: 260,
    render: (v: string) => <Typography.Text strong>{v}</Typography.Text>,
  },
  {
    title: '行业数据证据',
    dataIndex: 'evidence',
  },
  {
    title: '本方案选型',
    dataIndex: 'choice',
    width: 220,
    render: (v: string) => <Tag color="cyan">{v}</Tag>,
  },
];

export default function TrendsPage() {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={3} className="page-title">
          行业趋势与数据支撑
        </Typography.Title>
        <Typography.Paragraph type="secondary" className="page-subtitle">
          过去一年（2025-08 → 2026-07）前端开源生态最显著的变化不是「框架之争」，而是 AI
          把行业推向「TypeScript + 现代工具链 + 强测试」的收敛方向。以下数据用于回答：
          为什么要选这套技术栈？
        </Typography.Paragraph>
      </div>

      <Alert
        type="success"
        showIcon
        icon={<LineChartOutlined />}
        message="一句话结论"
        description="AI 越强，行业越向「类型安全 + 可测试 + 现代工具链」集中；同时 AI 输出信任度持续走低（46% 不信任），恰好反证了本方案里「测试与验证」环节的战略价值。"
      />

      <Row gutter={[16, 16]}>
        {AI_METRICS.map((metric) => (
          <Col xs={12} md={8} xl={4} key={metric.label}>
            <Card size="small" style={{ height: '100%' }}>
              <Statistic
                title={metric.label}
                value={metric.value}
                prefix={<BarChartOutlined style={{ color: '#7c3aed' }} />}
              />
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {metric.hint}
              </Typography.Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        size="small"
        title="过去一年 npm 月下载量增速（对比 2025-08 与 2026-07）"
        extra={<Tag color="geekblue">数据源：npm 官方 API</Tag>}
      >
        <Typography.Paragraph type="secondary">
          增速第一梯队全是「类型化 + 现代工具链 + AI 友好」的栈（rolldown、vitest、playwright、zod、zustand、tailwindcss、motion、bun、astro）；
          框架层 React 系（+241%）远超 Vue（+63%）与 Angular（+38%）；手工配置工具持续被零配置方案替代。
        </Typography.Paragraph>
        <Table<NpmTrend>
          rowKey="name"
          size="middle"
          dataSource={NPM_TRENDS}
          columns={npmColumns}
          pagination={false}
          scroll={{ x: 760 }}
        />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            size="small"
            title="GitHub Trending 现状（2026-08 TypeScript 月度榜）"
            extra={<Tag color="magenta">数据源：GitHub</Tag>}
          >
            <Alert type="info" showIcon message={TRENDING_SUMMARY} style={{ marginBottom: 12 }} />
            <List
              size="small"
              dataSource={TRENDING_REPOS}
              renderItem={(repo) => (
                <List.Item>
                  <Space size={8} wrap>
                    <Typography.Text strong style={{ fontSize: 13 }}>
                      {repo.name}
                    </Typography.Text>
                    <Tag color="purple">{repo.category}</Tag>
                  </Space>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {repo.note}
                  </Typography.Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            size="small"
            title="AI 信任度下降 → 测试成为质量安全网"
            extra={<SafetyCertificateOutlined style={{ color: '#10b981' }} />}
          >
            <List
              size="small"
              dataSource={[
                '84% 开发者使用或计划使用 AI 工具（上年 76%）；专业开发者 50.6% 每天使用。',
                '但 46% 不信任 AI 输出的准确性，仅 33% 信任；只有 3.1% 高度信任。',
                '仅 3.9% 专业开发者认为 AI 能「很好」处理复杂任务，22.8% 认为表现差。',
                '2026 年 Stack Overflow 调查标题直接改为「仅限人类开发者」——AI 回复已开始污染调查数据。',
                'SoJS 2025 结论：知道什么是「好」的，比以往任何时候都重要，而不是 vibe coding 从零造一切。',
                '结论：代码量变大、质量参差，类型检查 + 单测 + E2E 成为唯一可靠的质量安全网。',
              ]}
              renderItem={(text) => (
                <List.Item style={{ padding: '8px 0' }}>
                  <Typography.Text style={{ fontSize: 13 }}>{text}</Typography.Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Card size="small" title="AI 变化 → 行业应对 → 本方案选型">
        <Table<TrendMapping>
          rowKey="trend"
          size="middle"
          dataSource={TREND_MAPPINGS}
          columns={mappingColumns}
          pagination={false}
          scroll={{ x: 760 }}
        />
      </Card>

      <Card
        size="small"
        title="数据来源"
        extra={<GlobalOutlined style={{ color: '#1677ff' }} />}
      >
        <List
          size="small"
          dataSource={SOURCES}
          renderItem={(source) => (
            <List.Item>
              <Typography.Text strong>{source.name}</Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {source.url} — {source.note}
              </Typography.Text>
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
}
