import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import moment from 'moment';

const { Option } = Select;

interface TaskFormProps {
	visible: boolean;
	onCancel: () => void;
	onSubmit: (values: any) => void;
	initialValues?: any;
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible) {
			if (initialValues) {
				form.setFieldsValue({
					...initialValues,
					thoiHan: initialValues.thoiHan ? moment(initialValues.thoiHan) : null,
				});
			} else {
				form.resetFields();
			}
		}
	}, [visible, initialValues, form]);

	const handleFinish = (values: any) => {
		onSubmit({
			...values,
			thoiHan: values.thoiHan ? values.thoiHan.toISOString() : null,
		});
	};

	return (
		<Modal
			title={initialValues ? 'Chỉnh sửa Công việc' : 'Thêm mới Công việc'}
			visible={visible}
			onCancel={onCancel}
			footer={null}
			destroyOnClose
		>
			<Form form={form} layout='vertical' onFinish={handleFinish} preserve={false}>
				<Form.Item
					name='tenCongViec'
					label='Tên công việc'
					rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}
				>
					<Input placeholder='Nhập tên công việc' />
				</Form.Item>
				<Form.Item
					name='nguoiDuocGiao'
					label='Người được giao'
					rules={[{ required: true, message: 'Vui lòng nhập người được giao!' }]}
				>
					<Input placeholder='Nhập tên người được giao' />
				</Form.Item>
				<Form.Item
					name='mucDoUuTien'
					label='Mức độ ưu tiên'
					rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên!' }]}
					initialValue='Medium'
				>
					<Select>
						<Option value='High'>Cao</Option>
						<Option value='Medium'>Trung bình</Option>
						<Option value='Low'>Thấp</Option>
					</Select>
				</Form.Item>
				<Form.Item
					name='trangThai'
					label='Trạng thái'
					rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
					initialValue='Todo'
				>
					<Select>
						<Option value='Todo'>Chưa làm</Option>
						<Option value='Doing'>Đang làm</Option>
						<Option value='Done'>Đã xong</Option>
					</Select>
				</Form.Item>
				<Form.Item
					name='thoiHan'
					label='Thời hạn hoàn thành'
					rules={[{ required: true, message: 'Vui lòng chọn thời hạn!' }]}
				>
					<DatePicker showTime format='YYYY-MM-DD HH:mm:ss' style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
					<Button onClick={onCancel} style={{ marginRight: 8 }}>
						Hủy
					</Button>
					<Button type='primary' htmlType='submit'>
						Lưu
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default TaskForm;
