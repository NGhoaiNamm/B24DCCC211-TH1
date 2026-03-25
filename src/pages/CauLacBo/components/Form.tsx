import { Button, Form, Input, Switch, DatePicker } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';
import UploadFile from '@/components/Upload/UploadFile';
import TinyEditor from '@/components/TinyEditor';
import type { ICauLacBo } from '../typing';
import dayjs from 'dayjs';

const FormCauLacBo = () => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, addModel, updateModel, isView, getModel } = useModel('cauLacBo');

	useEffect(() => {
		if (record?._id) {
			form.setFieldsValue({
				...record,
				ngayThanhLap: record.ngayThanhLap ? dayjs(record.ngayThanhLap) : undefined,
				hoatDong: record.hoatDong ?? true,
			});
		} else {
			form.resetFields();
			form.setFieldsValue({ hoatDong: true });
		}
	}, [record]);

	const onFinish = async (values: any) => {
		const payload: Partial<ICauLacBo> = {
			...values,
			ngayThanhLap: values.ngayThanhLap ? values.ngayThanhLap.format('YYYY-MM-DD') : undefined,
			anhDaiDien: values.anhDaiDien?.fileList?.[0]?.url || values.anhDaiDien?.fileList?.[0]?.thumbUrl || record?.anhDaiDien,
		};
		if (record?._id) {
			await updateModel(record._id, payload);
		} else {
			await addModel(payload);
		}
		getModel();
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
				rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}
			>
				<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
			</Form.Item>

			<Form.Item label='Ảnh đại diện' name='anhDaiDien'>
				<UploadFile isAvatar buttonDescription='Tải ảnh lên' accept='image/*' />
			</Form.Item>

			<Form.Item
				label='Chủ nhiệm CLB'
				name='chuNhiem'
				rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}
			>
				<Input placeholder='Nhập tên chủ nhiệm' />
			</Form.Item>

			<Form.Item label='Mô tả (HTML)' name='moTa'>
				<TinyEditor height={300} miniToolbar />
			</Form.Item>

			<Form.Item label='Hoạt động' name='hoatDong' valuePropName='checked'>
				<Switch checkedChildren="Có" unCheckedChildren="Không" />
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
