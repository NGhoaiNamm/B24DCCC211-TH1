import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

const FormDichVu = ({ visible, onClose, record, dispatch }: any) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			form.setFieldsValue(record || { name: '', price: 0, duration: 30 });
		} else {
			form.resetFields();
		}
	}, [visible, record, form]);

	const onFinish = () => {
		form.validateFields().then((values) => {
			if (record) {
				dispatch({ type: 'bookingService/update', payload: { ...values, id: record.id } });
			} else {
				dispatch({ type: 'bookingService/add', payload: values });
			}
			onClose();
		});
	};

	return (
		<Modal
			title={record ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}
			visible={visible}
			onOk={onFinish}
			onCancel={onClose}
			destroyOnClose
		>
			<Form form={form} layout='vertical'>
				<Form.Item name='name' label='Tên dịch vụ' rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item name='price' label='Giá (VNĐ)' rules={[{ required: true }]}>
					<InputNumber min={0} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='duration' label='Thời gian thực hiện (Phút)' rules={[{ required: true }]}>
					<InputNumber min={1} style={{ width: '100%' }} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormDichVu;
