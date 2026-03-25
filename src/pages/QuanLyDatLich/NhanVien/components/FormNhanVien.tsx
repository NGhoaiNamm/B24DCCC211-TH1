import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

const FormNhanVien = ({ visible, onClose, record, dispatch }: any) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			form.setFieldsValue(record || { name: '', schedule: '', limit: 10 });
		} else {
			form.resetFields();
		}
	}, [visible, record, form]);

	const onFinish = () => {
		form.validateFields().then((values) => {
			if (record) {
				dispatch({ type: 'bookingEmployee/update', payload: { ...values, id: record.id } });
			} else {
				dispatch({ type: 'bookingEmployee/add', payload: values });
			}
			onClose();
		});
	};

	return (
		<Modal
			title={record ? 'Sửa thông tin' : 'Thêm nhân viên'}
			visible={visible}
			onOk={onFinish}
			onCancel={onClose}
			destroyOnClose
		>
			<Form form={form} layout='vertical'>
				<Form.Item name='name' label='Tên nhân viên' rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item name='schedule' label='Lịch làm việc (VD: 9h-17h thứ 6)' rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item name='limit' label='Giới hạn khách / ngày' rules={[{ required: true }]}>
					<InputNumber min={1} style={{ width: '100%' }} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormNhanVien;
