import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, TimePicker } from 'antd';
import MyDatePicker from '@/components/MyDatePicker';
import moment from 'moment';

const { Option } = Select;

const FormLichHen = ({ visible, onClose, dispatch, employeeList, serviceList }: any) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			form.resetFields();
		}
	}, [visible, form]);

	const onFinish = () => {
		form.validateFields().then((values) => {
			dispatch({
				type: 'bookingAppointment/add',
				payload: {
					...values,
					date: values.date ? moment(values.date).format('YYYY-MM-DD') : '',
					time: values.time ? values.time.format('HH:mm') : '',
				},
			});
			onClose();
		});
	};

	return (
		<Modal title='Đặt lịch hẹn' visible={visible} onOk={onFinish} onCancel={onClose} destroyOnClose>
			<Form form={form} layout='vertical'>
				<Form.Item name='customerName' label='Tên khách hàng' rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item name='serviceId' label='Dịch vụ' rules={[{ required: true }]}>
					<Select>
						{serviceList.map((srv: any) => (
							<Option key={srv.id} value={srv.id}>
								{srv.name} - {srv.price}đ
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item name='employeeId' label='Nhân viên phục vụ' rules={[{ required: true }]}>
					<Select>
						{employeeList.map((emp: any) => (
							<Option key={emp.id} value={emp.id}>
								{emp.name}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item name='date' label='Ngày' rules={[{ required: true }]}>
					<MyDatePicker />
				</Form.Item>
				<Form.Item name='time' label='Giờ' rules={[{ required: true }]}>
					<TimePicker format='HH:mm' style={{ width: '100%' }} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormLichHen;
