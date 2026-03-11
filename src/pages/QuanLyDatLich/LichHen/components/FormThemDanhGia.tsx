import React, { useEffect } from 'react';
import { Modal, Form, Input, Rate } from 'antd';

const FormThemDanhGia = ({ visible, onClose, dispatch, record }: any) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			form.resetFields();
		}
	}, [visible, form]);

	const onFinish = () => {
		form.validateFields().then((values) => {
			dispatch({
				type: 'bookingReview/add',
				payload: {
					appointmentId: record.id,
					customerName: record.customerName,
					employeeId: record.employeeId,
					rating: values.rating,
					comment: values.comment,
				},
			});
			onClose();
		});
	};

	return (
		<Modal
			title={`Đánh giá dịch vụ của ${record?.customerName}`}
			visible={visible}
			onOk={onFinish}
			onCancel={onClose}
			destroyOnClose
		>
			<Form form={form} layout='vertical'>
				<Form.Item name='rating' label='Số sao' rules={[{ required: true }]} initialValue={5}>
					<Rate allowHalf />
				</Form.Item>
				<Form.Item name='comment' label='Nhận xét' rules={[{ required: true }]}>
					<Input.TextArea rows={4} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormThemDanhGia;
