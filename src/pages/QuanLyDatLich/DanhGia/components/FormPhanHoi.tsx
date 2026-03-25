import React, { useEffect } from 'react';
import { Modal, Form } from 'antd';
import TinyEditor from '@/components/TinyEditor';

const FormPhanHoi = ({ visible, onClose, dispatch, currentId }: any) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			form.resetFields();
		}
	}, [visible, form]);

	const onFinish = () => {
		form.validateFields().then((values) => {
			dispatch({ type: 'bookingReview/reply', payload: { id: currentId, reply: values.reply } });
			onClose();
		});
	};

	return (
		<Modal
			title='Nhân viên phản hồi đánh giá'
			visible={visible}
			onOk={onFinish}
			onCancel={onClose}
			width={800}
			destroyOnClose
		>
			<Form form={form} layout='vertical'>
				<Form.Item name='reply' label='Nội dung' rules={[{ required: true }]}>
					<TinyEditor />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormPhanHoi;
