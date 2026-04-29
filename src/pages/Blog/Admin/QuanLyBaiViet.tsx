import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Table, Button, Modal, Form, Input, Select, Drawer, Popconfirm,
  Space, Typography, Card, Tag, Badge, message, Row, Col,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  FileTextOutlined, SearchOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import debounce from 'lodash/debounce';
import {
  Article, Tag as TagType, getArticles, saveArticles, getTags, recalculateTagUsage, initMockData,
} from '../utils';

const genId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const QuanLyBaiViet: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [form] = Form.useForm();

  const loadData = () => {
    initMockData();
    setArticles(getArticles());
    setTags(getTags());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = useMemo(
    () => debounce((value: string) => setSearchText(value.toLowerCase()), 300),
    [],
  );

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchTitle = a.title.toLowerCase().includes(searchText);
      const matchStatus = statusFilter ? a.status === statusFilter : true;
      return matchTitle && matchStatus;
    });
  }, [articles, searchText, statusFilter]);

  const openAddDrawer = () => {
    setEditingArticle(null);
    form.resetFields();
    form.setFieldsValue({ status: 'Draft' });
    setDrawerVisible(true);
  };

  const openEditDrawer = (article: Article) => {
    setEditingArticle(article);
    form.setFieldsValue({
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      content: article.content,
      imageUrl: article.imageUrl,
      tags: article.tags,
      status: article.status,
    });
    setDrawerVisible(true);
  };

  const handleDelete = (id: string) => {
    const updated = getArticles().filter((a) => a.id !== id);
    saveArticles(updated);
    recalculateTagUsage();
    message.success('Xóa bài viết thành công!');
    loadData();
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const allArticles = getArticles();

      if (editingArticle) {
        // Update
        const updatedArticles = allArticles.map((a) =>
          a.id === editingArticle.id
            ? { ...a, ...values, updatedAt: new Date().toISOString() }
            : a,
        );
        saveArticles(updatedArticles);
        message.success('Cập nhật bài viết thành công!');
      } else {
        // Add new
        const newArticle: Article = {
          id: genId(),
          slug: values.slug || values.title.toLowerCase().replace(/\s+/g, '-'),
          title: values.title,
          summary: values.summary,
          content: values.content,
          imageUrl: values.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
          tags: values.tags || [],
          status: values.status || 'Draft',
          views: 0,
          author: {
            name: 'Admin',
            avatar: 'https://joeschmoe.io/api/v1/random',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        saveArticles([...allArticles, newArticle]);
        message.success('Thêm bài viết thành công!');
      }

      recalculateTagUsage();
      setDrawerVisible(false);
      loadData();
    });
  };

  const getTagName = (tagId: string) => {
    const tag = tags.find((t) => t.id === tagId);
    return tag ? tag.name : tagId;
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (title: string) => (
        <Space>
          <FileTextOutlined style={{ color: '#1890ff' }} />
          <Text strong>{title}</Text>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string) => (
        <Badge
          status={status === 'Published' ? 'success' : 'default'}
          text={status === 'Published' ? 'Đã đăng' : 'Nháp'}
        />
      ),
    },
    {
      title: 'Thẻ',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tagIds: string[]) => (
        <>
          {tagIds.map((id) => (
            <Tag color="cyan" key={id}>{getTagName(id)}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      width: 110,
      align: 'center' as const,
      render: (v: number) => <Text type="secondary">{v}</Text>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 130,
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 160,
      align: 'center' as const,
      render: (_: any, record: Article) => (
        <Space>
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEditDrawer(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description={`Bạn có chắc muốn xóa bài viết "${record.title}"?`}
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
            <FileTextOutlined style={{ color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0 }}>Quản lý Bài viết</Title>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddDrawer}>
            Thêm bài viết
          </Button>
        }
        bordered={false}
      >
        {/* Filters */}
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={14} md={10}>
            <Input
              placeholder="Tìm kiếm theo tiêu đề..."
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={10} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Lọc theo trạng thái"
              allowClear
              onChange={(val) => setStatusFilter(val || null)}
            >
              <Option value="Published">Đã đăng</Option>
              <Option value="Draft">Nháp</Option>
            </Select>
          </Col>
        </Row>

        <Table
          dataSource={filteredArticles}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'Chưa có bài viết nào.' }}
        />
      </Card>

      {/* Add/Edit Drawer */}
      <Drawer
        title={editingArticle ? 'Sửa bài viết' : 'Thêm bài viết mới'}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={720}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setDrawerVisible(false)}>Hủy</Button>
              <Button type="primary" onClick={handleSubmit}>
                {editingArticle ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label="Tiêu đề"
                name="title"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
              >
                <Input placeholder="Nhập tiêu đề bài viết..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select>
                  <Option value="Draft">Nháp</Option>
                  <Option value="Published">Đã đăng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Slug (URL)" name="slug">
            <Input placeholder="vd: bai-viet-hay-nhat (tự động tạo nếu bỏ trống)" />
          </Form.Item>

          <Form.Item label="Tóm tắt" name="summary" rules={[{ required: true, message: 'Vui lòng nhập tóm tắt!' }]}>
            <TextArea rows={3} placeholder="Mô tả ngắn về bài viết..." />
          </Form.Item>

          <Form.Item
            label="Nội dung (Markdown)"
            name="content"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <TextArea
              rows={12}
              placeholder={`## Tiêu đề h2\n\nNhập nội dung Markdown tại đây...\n\n- Bullet 1\n- Bullet 2\n\n**In đậm**, *in nghiêng*`}
              style={{ fontFamily: 'monospace', fontSize: '13px' }}
            />
          </Form.Item>

          <Form.Item label="URL ảnh đại diện" name="imageUrl">
            <Input placeholder="https://images.unsplash.com/..." />
          </Form.Item>

          <Form.Item label="Thẻ (Tags)" name="tags">
            <Select mode="multiple" placeholder="Chọn thẻ cho bài viết..." allowClear>
              {tags.map((tag) => (
                <Option key={tag.id} value={tag.id}>
                  {tag.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default QuanLyBaiViet;
