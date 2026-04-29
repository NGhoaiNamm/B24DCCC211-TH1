import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type useBlogModel from '@/models/blog';
import { Button, Card, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TagFormModal from './components/TagFormModal';
import './style.less';

type BlogModelState = ReturnType<typeof useBlogModel>;

const BlogManageTagsPage = () => {
	const { tagsWithUsage, submitting, refreshMeta, createTagAction, updateTagAction, deleteTagAction } =
		(useModel('blog' as any) as BlogModelState);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [editingTag, setEditingTag] = useState<Blog.Tag | undefined>(undefined);

	useEffect(() => {
		refreshMeta();
	}, [refreshMeta]);

	const columns: ColumnsType<Blog.TagUsage> = [
		{
			title: 'Tên thẻ',
			dataIndex: 'name',
			key: 'name',
			render: (value: string) => <Typography.Text strong>{value}</Typography.Text>,
		},
		{
			title: 'Slug',
			dataIndex: 'slug',
			key: 'slug',
			render: (value: string) => <Tag>{value}</Tag>,
		},
		{
			title: 'Số bài viết sử dụng',
			dataIndex: 'usageCount',
			key: 'usageCount',
			width: 200,
			align: 'right',
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
							setEditingTag(record);
							setVisibleForm(true);
						}}
					/>
					<Popconfirm
						title='Xóa thẻ này và gỡ khỏi các bài viết liên quan?'
						onConfirm={() => deleteTagAction(record.id)}
					>
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
							Quản lý thẻ
						</Typography.Title>
						<Typography.Text type='secondary'>Thêm, sửa, xóa thẻ và theo dõi số bài viết đang sử dụng</Typography.Text>
					</div>
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => {
							setEditingTag(undefined);
							setVisibleForm(true);
						}}
					>
						Thêm thẻ
					</Button>
				</div>

				<Table
					rowKey='id'
					className='blog-admin-table'
					columns={columns}
					dataSource={tagsWithUsage}
					pagination={false}
				/>
			</Card>

			<TagFormModal
				visible={visibleForm}
				loading={submitting}
				initialValues={editingTag}
				onCancel={() => setVisibleForm(false)}
				onSubmit={async (payload) => {
					if (editingTag) await updateTagAction(editingTag.id, payload);
					else await createTagAction(payload);
					setVisibleForm(false);
					setEditingTag(undefined);
				}}
			/>
		</div>
	);
};

export default BlogManageTagsPage;
