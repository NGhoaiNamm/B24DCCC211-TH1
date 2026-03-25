import { Button, Form, Input, Switch } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';

const FormCauLacBo = () => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, addModel, updateModel, isView } = useModel('cauLacBo');

	useEffect(() => {
		if (record?._id) {
			form.setFieldsValue({
				...record,
				hoatDong: record.hoatDong ?? true,
			});
		} else {
			form.resetFields();
			form.setFieldsValue({ hoatDong: true });
		}
	}, [record]);

	const onFinish = async (values: any) => {
		if (record?._id) {
			await updateModel(record._id, values);
		} else {
			await addModel(values);
		}
		setVisibleForm(false);
	};

	return (
		<Form
			form={form}
			layout='vertical'
			onFinish={onFinish}
			disabled={isView}
			style={{ padding: 24 }}
		>
			<Form.Item
				label='Tên định danh'
				name='ten'
				rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ' }]}
			>
				<Input placeholder='Nhập tên câu lạc bộ' />
			</Form.Item>

			<Form.Item
				label='Ngày thiết lập'
				name='ngayThanhLap'
				rules={[{ required: true, message: 'Vui lòng nhập ngày thành lập' }]}
			>
				<Input type='date' />
			</Form.Item>

			<Form.Item
				label='Ảnh đại diện'
				name='anhDaiDien'
			>
				<Input placeholder='Nhập link ảnh' />
			</Form.Item>

			<Form.Item
				label='Chủ nhiệm'
				name='chuNhiem'
				rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}
			>
				<Input placeholder='Nhập tên chủ nhiệm' />
			</Form.Item>

			<Form.Item label='Mô tả' name='moTa'>
				<Input.TextArea rows={4} placeholder='Mô tả' />
			</Form.Item>

			<Form.Item label='Hoạt động' name='hoatDong' valuePropName='checked'>
				<Switch />
			</Form.Item>

			{!isView && (
				<div style={{ textAlign: 'center', marginTop: 16 }}>
					<Button onClick={() => setVisibleForm(false)} style={{ marginRight: 8 }}>
						Hủy
					</Button>
					<Button type='primary' htmlType='submit'>
						Lưu
					</Button>
				</div>
			)}
		</Form>
	);
};

export default FormCauLacBo;
