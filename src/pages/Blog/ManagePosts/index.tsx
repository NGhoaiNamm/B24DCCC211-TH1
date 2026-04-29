import { BLOG_STATUS_LABEL } from '@/services/Blog/constants';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type useBlogModel from '@/models/blog';
import { Button, Card, Input, Popconfirm, Select, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import PostFormModal from './components/PostFormModal';
import './style.less';

type BlogModelState = ReturnType<typeof useBlogModel>;

const BlogManagePostsPage = () => {
	const {
		managePosts,
		loadingAdmin,
		submitting,
		adminTitleKeyword,
		setAdminTitleKeyword,
		adminStatus,
		setAdminStatus,
		tags,
		loadManagePosts,
		refreshMeta,
		createPostAction,
		updatePostAction,
		deletePostAction,
	} = useModel('blog' as any) as BlogModelState;

	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [editingPost, setEditingPost] = useState<Blog.Post | undefined>(undefined);

	useEffect(() => {
		refreshMeta();
	}, [refreshMeta]);

	useEffect(() => {
		loadManagePosts();
	}, [adminTitleKeyword, adminStatus, loadManagePosts]);

	const columns: ColumnsType<Blog.PostWithTags> = [
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			key: 'title',
			render: (value: string) => <Typography.Text strong>{value}</Typography.Text>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 120,
			render: (status: Blog.PostStatus) => (
				<Tag color={status === 'published' ? 'green' : 'default'}>{BLOG_STATUS_LABEL[status]}</Tag>
			),
		},
		{
			title: 'Thẻ',
			dataIndex: 'tags',
			key: 'tags',
			render: (postTags: Blog.Tag[]) => (
				<Space wrap>
					{postTags.length ? postTags.map((tag) => <Tag key={tag.id}>{tag.name}</Tag>) : <Tag>Chưa gắn thẻ</Tag>}
				</Space>
			),
		},
		{
			title: 'Lượt xem',
			dataIndex: 'views',
			key: 'views',
			width: 100,
			align: 'right',
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: 170,
			render: (value: string) => moment(value).format('DD/MM/YYYY HH:mm'),
		},
		{
			title: 'Thao tác',
			key: 'actions',
			width: 120,
			align: 'center',
			render: (_, record) => (
				<Space>
					<Button
						type='text'
						icon={<EditOutlined />}
						onClick={() => {
							setEditingPost(record);
							setVisibleForm(true);
						}}
					/>
					<Popconfirm title='Bạn chắc chắn muốn xóa bài viết này?' onConfirm={() => deletePostAction(record.id)}>
						<Button type='text' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div className='blog-page'>
			<Card>
				<div className='blog-admin-toolbar'>
					<div>
						<Typography.Title className='blog-admin-title' level={3}>
							Quản lý bài viết
						</Typography.Title>
						<Typography.Text type='secondary'>Quản lý nội dung bài viết blog</Typography.Text>
					</div>

					<div className='blog-admin-toolbar__left'>
						<Input
							allowClear
							className='blog-search-input'
							placeholder='Tìm theo tiêu đề'
							value={adminTitleKeyword}
							onChange={(event) => setAdminTitleKeyword(event.target.value)}
						/>
						<Select<'all' | Blog.PostStatus>
							style={{ width: 150 }}
							value={adminStatus}
							onChange={(value) => setAdminStatus(value)}
						>
							<Select.Option value='all'>Tất cả</Select.Option>
							<Select.Option value='draft'>Nháp</Select.Option>
							<Select.Option value='published'>Đã đăng</Select.Option>
						</Select>
						<Button
							type='primary'
							icon={<PlusOutlined />}
							onClick={() => {
								setEditingPost(undefined);
								setVisibleForm(true);
							}}
						>
							Thêm bài viết
						</Button>
					</div>
				</div>

				<Table
					rowKey='id'
					className='blog-admin-table'
					loading={loadingAdmin}
					columns={columns}
					dataSource={managePosts}
					pagination={{ pageSize: 10, showSizeChanger: false }}
				/>
			</Card>

			<PostFormModal
				visible={visibleForm}
				loading={submitting}
				tags={tags}
				initialValues={editingPost}
				onCancel={() => setVisibleForm(false)}
				onSubmit={async (payload) => {
					if (editingPost) await updatePostAction(editingPost.id, payload);
					else await createPostAction(payload);
					setVisibleForm(false);
					setEditingPost(undefined);
				}}
			/>
		</div>
	);
};

export default BlogManagePostsPage;
