import React, { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, Popconfirm, Space,
  Typography, Card, Badge, message,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, TagsOutlined,
} from '@ant-design/icons';
import { Tag, getTags, saveTags, recalculateTagUsage } from '../utils';

const genId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const { Title } = Typography;

const QuanLyThe: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [form] = Form.useForm();

  const loadTags = () => {
    recalculateTagUsage();
    setTags(getTags());
  };

  useEffect(() => {
    loadTags();
  }, []);

  const openAddModal = () => {
    setEditingTag(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (tag: Tag) => {
    setEditingTag(tag);
    form.setFieldsValue({ name: tag.name });
    setModalVisible(true);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const allTags = getTags();

      // Check duplicate name
      const isDuplicate = allTags.some(
        (t) => t.name.toLowerCase() === values.name.toLowerCase() && t.id !== editingTag?.id,
      );
      if (isDuplicate) {
        message.error('Tên thẻ đã tồn tại!');
        return;
      }

      if (editingTag) {
        // Update
        const updatedTags = allTags.map((t) =>
          t.id === editingTag.id ? { ...t, name: values.name } : t,
        );
        saveTags(updatedTags);
        message.success('Cập nhật thẻ thành công!');
      } else {
        // Add new
        const newTag: Tag = {
          id: genId(),
          name: values.name,
          usageCount: 0,
        };
        saveTags([...allTags, newTag]);
        message.success('Thêm thẻ thành công!');
      }

      setModalVisible(false);
      loadTags();
    });
  };

  const handleDelete = (id: string) => {
    const allTags = getTags();
    saveTags(allTags.filter((t) => t.id !== id));
    message.success('Xóa thẻ thành công!');
    loadTags();
  };

  const columns = [
    {
      title: 'Tên thẻ',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Space>
          <TagsOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{name}</span>
        </Space>
      ),
    },
    {
      title: 'Số bài viết',
      dataIndex: 'usageCount',
      key: 'usageCount',
      align: 'center' as const,
      render: (count: number) => (
        <Badge
          count={count}
          showZero
          style={{ backgroundColor: count > 0 ? '#52c41a' : '#d9d9d9' }}
        />
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: Tag) => (
        <Space>
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEditModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa thẻ"
            description={`Bạn có chắc muốn xóa thẻ "${record.name}"?`}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <TagsOutlined style={{ color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0 }}>Quản lý Thẻ (Tags)</Title>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Thêm thẻ
          </Button>
        }
        bordered={false}
      >
        <Table
          dataSource={tags}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 15 }}
          locale={{ emptyText: 'Chưa có thẻ nào.' }}
        />
      </Card>

      <Modal
        title={editingTag ? 'Sửa thẻ' : 'Thêm thẻ mới'}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editingTag ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: '16px' }}>
          <Form.Item
            label="Tên thẻ"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên thẻ!' }]}
          >
            <Input placeholder="Ví dụ: React, JavaScript, CSS..." autoFocus />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyThe;
