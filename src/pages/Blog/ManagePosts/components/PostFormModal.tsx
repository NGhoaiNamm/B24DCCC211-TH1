import { BLOG_STATUS_OPTIONS } from '@/services/Blog/constants';
import { Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';

interface PostFormModalProps {
	visible: boolean;
	loading: boolean;
	tags: Blog.Tag[];
	initialValues?: Blog.Post;
	onCancel: () => void;
	onSubmit: (payload: Blog.PostInput) => Promise<void>;
}

const defaultValues: Blog.PostInput = {
	title: '',
	slug: '',
	summary: '',
	content: '',
	coverUrl: '',
	tagIds: [],
	status: 'draft',
};

const PostFormModal = ({ visible, loading, tags, initialValues, onCancel, onSubmit }: PostFormModalProps) => {
	const [form] = Form.useForm<Blog.PostInput>();

	useEffect(() => {
		if (!visible) {
			form.resetFields();
			return;
		}
		if (initialValues) {
			form.setFieldsValue({
				title: initialValues.title,
				slug: initialValues.slug,
				summary: initialValues.summary,
				content: initialValues.content,
				coverUrl: initialValues.coverUrl,
				tagIds: initialValues.tagIds,
				status: initialValues.status,
			});
			return;
		}
		form.setFieldsValue(defaultValues);
	}, [visible, initialValues, form]);

	return (
		<Modal
			destroyOnClose
			maskClosable={false}
			title={initialValues ? 'Cập nhật bài viết' : 'Thêm bài viết'}
			visible={visible}
			okText={initialValues ? 'Lưu thay đổi' : 'Thêm mới'}
			cancelText='Hủy'
			confirmLoading={loading}
			onCancel={onCancel}
			onOk={() => form.submit()}
		>
			<Form
				layout='vertical'
				form={form}
				onFinish={async (values) => {
					await onSubmit(values);
				}}
			>
				<Form.Item name='title' label='Tiêu đề' rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
					<Input placeholder='Nhập tiêu đề bài viết' />
				</Form.Item>

				<Form.Item name='slug' label='Slug' rules={[{ required: true, message: 'Vui lòng nhập slug' }]}>
					<Input placeholder='vi-du-slug-bai-viet' />
				</Form.Item>

				<Form.Item name='summary' label='Tóm tắt' rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}>
					<Input.TextArea rows={3} placeholder='Mô tả ngắn cho bài viết' />
				</Form.Item>

				<Form.Item name='content' label='Nội dung' rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
					<Input.TextArea rows={10} placeholder='Nhập nội dung dạng markdown' />
				</Form.Item>

				<Form.Item
					name='coverUrl'
					label='Ảnh đại diện (URL)'
					rules={[
						{ required: true, message: 'Vui lòng nhập URL ảnh' },
						{ type: 'url', message: 'URL ảnh không hợp lệ' },
					]}
				>
					<Input placeholder='https://example.com/cover.jpg' />
				</Form.Item>

				<Form.Item name='tagIds' label='Thẻ'>
					<Select mode='multiple' allowClear placeholder='Chọn thẻ'>
						{tags.map((tag) => (
							<Select.Option key={tag.id} value={tag.id}>
								{tag.name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item name='status' label='Trạng thái' rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
					<Select>
						{BLOG_STATUS_OPTIONS.map((item) => (
							<Select.Option key={item.value} value={item.value}>
								{item.label}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default PostFormModal;
