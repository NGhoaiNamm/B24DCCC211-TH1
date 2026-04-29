import { Form, Input, Modal } from 'antd';
import { useEffect } from 'react';

interface TagFormModalProps {
	visible: boolean;
	loading: boolean;
	initialValues?: Blog.Tag;
	onCancel: () => void;
	onSubmit: (payload: Blog.TagInput) => Promise<void>;
}

const TagFormModal = ({ visible, loading, initialValues, onCancel, onSubmit }: TagFormModalProps) => {
	const [form] = Form.useForm<Blog.TagInput>();

	useEffect(() => {
		if (!visible) {
			form.resetFields();
			return;
		}
		if (initialValues) {
			form.setFieldsValue({
				name: initialValues.name,
				slug: initialValues.slug,
			});
			return;
		}
		form.setFieldsValue({
			name: '',
			slug: '',
		});
	}, [visible, initialValues, form]);

	return (
		<Modal
			destroyOnClose
			maskClosable={false}
			title={initialValues ? 'Cập nhật thẻ' : 'Thêm thẻ'}
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
				<Form.Item name='name' label='Tên thẻ' rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}>
					<Input placeholder='Ví dụ: React' />
				</Form.Item>

				<Form.Item name='slug' label='Slug' rules={[{ required: true, message: 'Vui lòng nhập slug' }]}>
					<Input placeholder='react' />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default TagFormModal;
