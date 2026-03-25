import { Button, Form, Input, Select, Radio } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';
import type { IDonDangKy } from '@/pages/CauLacBo/typing';

const FormThanhVien = () => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, addModel, updateModel, isView, getModel } = useModel('donDangKy');
	const { danhSach: lstCauLacBo, getModel: getCauLacBo } = useModel('cauLacBo');

	useEffect(() => {
		getCauLacBo();
	}, []);

	useEffect(() => {
		if (record?._id) {
			form.setFieldsValue(record);
		} else {
			form.resetFields();
		}
	}, [record]);

	const onFinish = async (values: any) => {
		if (record?._id) {
			await updateModel(record._id as string, values as Partial<IDonDangKy>);
		} else {
			// Thêm trực tiếp vào danh sách với trạng thái Approved
			await addModel({ ...values, trangThai: 'Approved' } as Partial<IDonDangKy>);
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
				label='Họ tên'
				name='hoTen'
				rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
			>
				<Input placeholder='Nhập họ tên' />
			</Form.Item>

			<Form.Item
				label='Email'
				name='email'
				rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}
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

			<Form.Item label='Giới tính' name='gioiTinh' rules={[{ required: true }]}>
				<Radio.Group>
					<Radio value="Nam">Nam</Radio>
					<Radio value="Nữ">Nữ</Radio>
					<Radio value="Khác">Khác</Radio>
				</Radio.Group>
			</Form.Item>

			<Form.Item label='Địa chỉ' name='diaChi'>
				<Input placeholder='Nhập địa chỉ' />
			</Form.Item>

			<Form.Item label='Sở trường' name='soTruong'>
				<Input placeholder='Nhập sở trường' />
			</Form.Item>

			<Form.Item
				label='Câu lạc bộ'
				name='cauLacBoId'
				rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
			>
				<Select placeholder='Chọn câu lạc bộ' showSearch optionFilterProp='children'>
					{lstCauLacBo.map((c: any) => (
						<Select.Option key={c._id} value={c._id}>
							{c.ten}
						</Select.Option>
					))}
				</Select>
			</Form.Item>

			{!isView && (
				<div style={{ textAlign: 'center', marginTop: 16 }}>
					<Button onClick={() => setVisibleForm(false)} style={{ marginRight: 8 }}>Hủy</Button>
					<Button type='primary' htmlType='submit'>Lưu</Button>
				</div>
			)}
		</Form>
	);
};

export default FormThanhVien;
