import { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Rule } from 'antd/es/form';
import type { HTMLAttributes, ReactNode, TdHTMLAttributes } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { useMigrationStore } from '../store/useMigrationStore';
import type { MigrationItem, MigrationStatus } from '../store/useMigrationStore';
import {
  STATUS_META,
  createMigrationItem,
  getAverageProgress,
  summarizeDiff,
} from '../utils/planUtils';

type EditableColumn = ColumnsType<MigrationItem>[number] & {
  editable?: boolean;
  inputType?: 'text' | 'number' | 'select';
};

interface EditableCellProps extends HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'text' | 'number' | 'select';
  record?: MigrationItem;
  children: ReactNode;
}

const STATUS_OPTIONS = (Object.keys(STATUS_META) as MigrationStatus[]).map((value) => ({
  value,
  label: STATUS_META[value].label,
}));

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  children,
  ...restProps
}) => {
  const rules = useMemo<Rule[]>(() => {
    if (dataIndex === 'phase') {
      return [
        { required: true, whitespace: true, message: `请输入${title}` },
        { max: 24, message: `${title}不能超过 24 个字符` },
      ];
    }
    if (dataIndex === 'goal') {
      return [
        { required: true, whitespace: true, message: `请输入${title}` },
        { max: 80, message: `${title}不能超过 80 个字符` },
      ];
    }
    if (dataIndex === 'progress') {
      return [
        { required: true, message: `请输入${title}` },
        { type: 'number', min: 0, max: 100, message: `${title}需在 0-100 之间` },
      ];
    }
    if (dataIndex === 'status') {
      return [{ required: true, message: `请选择${title}` }];
    }
    return [];
  }, [dataIndex, title]);

  const inputId = record ? `input-${dataIndex}-${record.id}` : undefined;

  let inputNode: ReactNode = <Input id={inputId} />;
  if (inputType === 'number') {
    inputNode = (
      <InputNumber
        id={inputId}
        min={0}
        max={100}
        style={{ width: '100%' }}
      />
    );
  } else if (inputType === 'select') {
    inputNode = <Select id={inputId} options={STATUS_OPTIONS} />;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} style={{ margin: 0 }} rules={rules}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default function MigrationPlanPage() {
  const [form] = Form.useForm<MigrationItem>();
  const [editingKey, setEditingKey] = useState('');
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submittedPayload, setSubmittedPayload] = useState<MigrationItem[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const items = useMigrationStore((state) => state.items);
  const baseline = useMigrationStore((state) => state.baseline);
  const updateItem = useMigrationStore((state) => state.updateItem);
  const addItem = useMigrationStore((state) => state.addItem);
  const removeItem = useMigrationStore((state) => state.removeItem);
  const reset = useMigrationStore((state) => state.reset);

  const diff = useMemo(() => summarizeDiff(items, baseline), [items, baseline]);
  const averageProgress = useMemo(() => getAverageProgress(items), [items]);

  const isEditing = (record: MigrationItem) => record.id === editingKey;

  const focusPhaseInput = (id: string) => {
    window.setTimeout(() => {
      document.getElementById(`input-phase-${id}`)?.focus();
    }, 0);
  };

  const edit = (record: MigrationItem) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
    focusPhaseInput(record.id);
  };

  const save = async (id: string): Promise<boolean> => {
    try {
      const row = await form.validateFields();
      updateItem(id, {
        phase: row.phase,
        goal: row.goal,
        status: row.status,
        progress: Number(row.progress),
        note: row.note,
      });
      setEditingKey('');
      messageApi.success('该行修改已在表格内保存');
      return true;
    } catch (error) {
      console.info('表单校验未通过', error);
      return false;
    }
  };

  const cancel = () => {
    setEditingKey('');
    form.resetFields();
  };

  const addRow = () => {
    const item = createMigrationItem({
      phase: '新增阶段',
      goal: '在此描述该阶段要达成的目标',
      status: 'pending',
      progress: 0,
      note: '保存后会写入本地演示状态。',
    });
    addItem(item);
    form.setFieldsValue({ ...item });
    setEditingKey(item.id);
    focusPhaseInput(item.id);
  };

  const remove = (id: string) => {
    removeItem(id);
    if (editingKey === id) {
      setEditingKey('');
      form.resetFields();
    }
  };

  const resetAll = () => {
    reset();
    setEditingKey('');
    form.resetFields();
    messageApi.info('已恢复基线计划');
  };

  const submitAll = async () => {
    if (editingKey) {
      const saved = await save(editingKey);
      if (!saved) {
        messageApi.warning('当前编辑行校验未通过，请先修正后再提交');
        return;
      }
    }
    const payload = useMigrationStore.getState().items;
    setSubmittedPayload(payload.map((item) => ({ ...item })));
    setSubmitModalOpen(true);
  };

  const columns: EditableColumn[] = [
    {
      title: '阶段',
      dataIndex: 'phase',
      width: 200,
      editable: true,
      inputType: 'text',
    },
    {
      title: '目标',
      dataIndex: 'goal',
      width: 300,
      editable: true,
      inputType: 'text',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      editable: true,
      inputType: 'select',
      render: (value: MigrationStatus) => {
        const meta = STATUS_META[value] ?? STATUS_META.pending;
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      width: 110,
      editable: true,
      inputType: 'number',
      render: (value: number) => `${value}%`,
    },
    {
      title: '备注',
      dataIndex: 'note',
      width: 240,
      editable: true,
      inputType: 'text',
      ellipsis: true,
      render: (value?: string) =>
        value ? value : <Typography.Text type="secondary">—</Typography.Text>,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 170,
      fixed: 'right',
      render: (_: unknown, record: MigrationItem) => {
        const editing = isEditing(record);
        return editing ? (
          <Space size={4}>
            <Button
              type="link"
              size="small"
              icon={<SaveOutlined />}
              data-testid={`save-${record.id}`}
              onClick={() => void save(record.id)}
            >
              保存
            </Button>
            <Button type="link" size="small" onClick={cancel}>
              取消
            </Button>
          </Space>
        ) : (
          <Space size={4}>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              data-testid={`edit-${record.id}`}
              onClick={() => edit(record)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定删除该行吗？"
              okText="删除"
              cancelText="取消"
              onConfirm={() => remove(record.id)}
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const mergedColumns: ColumnsType<MigrationItem> = columns.map((column) => {
    if (!column.editable) {
      return column;
    }
    return {
      ...column,
      onCell: (record: MigrationItem) =>
        ({
          record,
          editing: isEditing(record),
          dataIndex: column.dataIndex as string,
          title: typeof column.title === 'string' ? column.title : String(column.dataIndex),
          inputType: column.inputType ?? 'text',
        }) as HTMLAttributes<HTMLElement> & TdHTMLAttributes<HTMLElement>,
    } as ColumnsType<MigrationItem>[number];
  });

  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Typography.Title level={3} className="page-title">
            可编辑迁移计划表
          </Typography.Title>
          <Typography.Paragraph type="secondary" className="page-subtitle">
            这张表演示方案中的“表格内部提交内容修改”：点击编辑后直接在单元格内修改，行级保存；
            也可以新增、删除、恢复基线，最后提交全部修改。数据通过 Zustand 持久化到浏览器本地，仅用于 Demo。
          </Typography.Paragraph>
        </div>

        <Alert
          type="info"
          showIcon
          message="该交互用于验证复杂表格迁移风险"
          description="推荐在真实项目中最先做复杂表格 POC：至少覆盖新增、行内编辑、必填校验、部分保存失败、权限禁用和未保存离开提示。"
        />

        <Card
          size="small"
          title={
            <Space wrap>
              <Typography.Text strong>计划操作</Typography.Text>
              <Tag color="blue">共 {items.length} 行</Tag>
              <Tag color="orange">相对基线变更 {diff.changed + diff.added + diff.removed} 行</Tag>
              <Tag color="green">平均进度 {averageProgress}%</Tag>
            </Space>
          }
          extra={
            <Space wrap>
              <Button icon={<PlusOutlined />} data-testid="add-row" onClick={addRow}>
                新增阶段
              </Button>
              <Button
                type="primary"
                icon={<SendOutlined />}
                data-testid="submit-all"
                onClick={() => void submitAll()}
              >
                提交所有修改
              </Button>
              <Button
                icon={<ReloadOutlined />}
                data-testid="reset-plan"
                onClick={resetAll}
              >
                恢复基线
              </Button>
            </Space>
          }
        />

          <Form form={form} component={false}>
        <Table<MigrationItem>
          rowKey="id"
          bordered
          size="middle"
          dataSource={items}
          columns={mergedColumns}
          components={{ body: { cell: EditableCell } }}
          pagination={{ pageSize: 8, hideOnSinglePage: true }}
          scroll={{ x: 1140 }}
        />
          </Form>
      </Space>

      <Modal
        open={submitModalOpen}
        title="提交预览"
        width={720}
        onCancel={() => setSubmitModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setSubmitModalOpen(false)}>
            关闭
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={() => {
              setSubmitModalOpen(false);
              messageApi.success('已模拟提交当前计划');
            }}
          >
            确认提交
          </Button>,
        ]}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space wrap>
            <Tag color="blue">共 {submittedPayload.length} 行</Tag>
            <Tag color="green">平均进度 {getAverageProgress(submittedPayload)}%</Tag>
          </Space>
          <Alert
            type="info"
            showIcon
            message="Demo 环境没有后端，提交动作只在当前页面状态中模拟。"
          />
          <pre className="code-block">
            {JSON.stringify(submittedPayload, null, 2)}
          </pre>
        </Space>
      </Modal>
    </>
  );
}
