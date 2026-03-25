import { Button, Form, Input, Select, Radio } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';

const FormDonDangKy = () => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, addModel, updateModel, isView } = useModel('donDangKy');
	const { danhSach: lstCauLacBo } = useModel('cauLacBo');

	useEffect(() => {
		if (record?._id) {
			form.setFieldsValue(record);
		} else {
			form.resetFields();
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
				label='Họ tên'
				name='hoTen'
				rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
			>
				<Input placeholder='Nhập họ tên' />
			</Form.Item>

			<Form.Item
				label='Email'
				name='email'
				rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}
			>
				<Input placeholder='Nhập email' />
			</Form.Item>

			<Form.Item
				label='Số điện thoại'
				name='soDienThoai'
				rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
			>
				<Input placeholder='Nhập số điện thoại' />
			</Form.Item>

			<Form.Item label='Giới tính' name='gioiTinh' rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
				<Radio.Group>
					<Radio value="Nam">Nam</Radio>
					<Radio value="Nữ">Nữ</Radio>
				</Radio.Group>
			</Form.Item>

			<Form.Item label='Địa chỉ' name='diaChi'>
				<Input placeholder='Nhập địa chỉ' />
			</Form.Item>
			
			<Form.Item label='Sở trường' name='soTruong'>
				<Input placeholder='Nhập sở trường' />
			</Form.Item>
			
			<Form.Item label='Câu lạc bộ' name='cauLacBoId' rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}>
				<Select placeholder='Chọn câu lạc bộ'>
					{lstCauLacBo.map((c: any) => (
						<Select.Option key={c._id} value={c._id}>
							{c.ten}
						</Select.Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item label='Lý do đăng ký' name='lyDo'>
				<Input.TextArea rows={4} placeholder='Lý do đăng ký' />
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

export default FormDonDangKy;
