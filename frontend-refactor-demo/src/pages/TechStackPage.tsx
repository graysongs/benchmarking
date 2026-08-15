import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Modal,
  Row,
  Segmented,
  Space,
  Tag,
  Typography,
} from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { TECH_CATEGORIES, TECH_STACK } from '../data/techStack';
import type { TechBadge, TechItem } from '../data/techStack';

const BADGE_COLORS: Record<TechBadge, string> = {
  首推: 'gold',
  按需: 'orange',
  可选: 'blue',
};

const ALL = '全部';

export default function TechStackPage() {
  const [category, setCategory] = useState<string>(ALL);
  const [selected, setSelected] = useState<TechItem | null>(null);

  const visibleItems =
    category === ALL ? TECH_STACK : TECH_STACK.filter((item) => item.category === category);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={3} className="page-title">
          技术栈详解
        </Typography.Title>
        <Typography.Paragraph type="secondary" className="page-subtitle">
          点击任意技术栈卡片查看详情：它是什么、在方案中承担什么角色、为什么这样选择，以及许可证与商用提示。
          所有展示内容均为方案规划内容。
        </Typography.Paragraph>
      </div>

      <Alert
        type="info"
        showIcon
        icon={<BulbOutlined />}
        message="交互说明：点击卡片打开详情弹窗"
        description="可用上方的分类筛选缩小范围。卡片悬停有抬升效果，详情弹窗展示该技术的定位、选型理由和许可证信息。"
      />

      <Segmented
        options={[ALL, ...TECH_CATEGORIES]}
        value={category}
        onChange={(value) => setCategory(String(value))}
      />

      <Row gutter={[16, 16]}>
        {visibleItems.map((item) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={item.id}>
            <Card
              hoverable
              className="tech-card"
              data-testid={`tech-card-${item.id}`}
              onClick={() => setSelected(item)}
            >
              <Space direction="vertical" size={10} style={{ width: '100%' }}>
                <Space align="center" size={10}>
                  <span className="tech-card-icon">{item.icon}</span>
                  <div>
                    <Typography.Text strong style={{ display: 'block' }}>
                      {item.name}
                    </Typography.Text>
                    <Space size={4} wrap>
                      <Tag color={BADGE_COLORS[item.badge]}>{item.badge}</Tag>
                      <Tag color={item.license.includes('商业') ? 'orange' : 'green'}>
                        {item.license}
                      </Tag>
                    </Space>
                  </div>
                </Space>
                <Typography.Paragraph
                  type="secondary"
                  style={{ marginBottom: 0, minHeight: 66 }}
                  ellipsis={{ rows: 3 }}
                >
                  {item.summary}
                </Typography.Paragraph>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  点击查看详情 →
                </Typography.Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        open={selected !== null}
        title={
          selected ? (
            <Space align="center">
              <span className="tech-card-icon">{selected.icon}</span>
              <span>{selected.name}</span>
            </Space>
          ) : null
        }
        width={680}
        onCancel={() => setSelected(null)}
        footer={
          <Button type="primary" onClick={() => setSelected(null)}>
            关闭
          </Button>
        }
      >
        {selected && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Space wrap>
              <Tag>{selected.category}</Tag>
              <Tag color={BADGE_COLORS[selected.badge]}>{selected.badge}</Tag>
              <Tag color={selected.license.includes('商业') ? 'orange' : 'green'}>
                {selected.license}
              </Tag>
            </Space>

            <div>
              <Typography.Title level={5}>它是什么</Typography.Title>
              <Typography.Paragraph>{selected.summary}</Typography.Paragraph>
            </div>

            <div>
              <Typography.Title level={5}>在方案中的角色</Typography.Title>
              <Typography.Paragraph>{selected.role}</Typography.Paragraph>
            </div>

            <div>
              <Typography.Title level={5}>为什么这样选</Typography.Title>
              <ul className="detail-list">
                {selected.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          </Space>
        )}
      </Modal>
    </Space>
  );
}
