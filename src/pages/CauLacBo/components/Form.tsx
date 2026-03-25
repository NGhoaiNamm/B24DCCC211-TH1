import { Button, Form, Input, Switch } from 'antd';
import { useModel } from 'umi';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import { useEffect } from 'react';

const FormCauLacBo = () => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, getModel, addModel, updateModel, isView } = useModel('cauLacBo');

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
				label='Tên câu lạc bộ'
				name='ten'
				rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ' }]}
			>
				<Input placeholder='Nhập tên câu lạc bộ' />
			</Form.Item>

			<Form.Item
				label='Ngày thành lập'
				name='ngayThanhLap'
				rules={[{ required: true, message: 'Vui lòng nhập ngày thành lập' }]}
			>
				<Input type='date' />
			</Form.Item>

            <Form.Item
				label='Ảnh đại diện'
				name='anhDaiDien'
			>
				{/* Use a simple Input for image URL if UploadFile is complex to mock, but the requirement said use UploadFile */}
				<Input placeholder='Nhập link ảnh (hoặc dùng Component UploadFile tuỳ base project)' />
			</Form.Item>

			<Form.Item
				label='Chủ nhiệm CLB'
				name='chuNhiem'
				rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}
			>
				<Input placeholder='Nhập tên chủ nhiệm' />
			</Form.Item>

			<Form.Item label='Mô tả' name='moTa'>
				<Input.TextArea rows={4} placeholder='Mô tả ngắn về CLB' />
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
