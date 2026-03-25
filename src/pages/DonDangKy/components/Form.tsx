import { Button, Form, Input, Select, Radio } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';
import type { IDonDangKy } from '@/pages/CauLacBo/typing';

const FormDonDangKy = () => {
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
			await addModel({ ...values, trangThai: 'Pending' } as Partial<IDonDangKy>);
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

			<Form.Item
				label='Giới tính'
				name='gioiTinh'
				rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
			>
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
				<Input placeholder='Nhập sở trường (VD: âm nhạc, lập trình...)' />
			</Form.Item>

			<Form.Item
				label='Câu lạc bộ đăng ký'
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

			<Form.Item label='Lý do đăng ký' name='lyDo'>
				<Input.TextArea rows={4} placeholder='Mô tả lý do bạn muốn tham gia câu lạc bộ' />
			</Form.Item>

			{record?._id && !isView && (
				<Form.Item label='Trạng thái' name='trangThai'>
					<Select>
						<Select.Option value="Pending">⏳ Pending (Chờ duyệt)</Select.Option>
						<Select.Option value="Approved">✅ Approved (Đã duyệt)</Select.Option>
						<Select.Option value="Rejected">❌ Rejected (Từ chối)</Select.Option>
					</Select>
				</Form.Item>
			)}

			{record?._id && isView && record.ghiChu && (
				<Form.Item label='Ghi chú / Lý do từ chối'>
					<div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: 6 }}>
						{record.ghiChu}
					</div>
				</Form.Item>
			)}

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
