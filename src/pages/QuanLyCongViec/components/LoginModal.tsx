import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Form, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';

interface LoginModalProps {
	visible: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible }) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();//gửi dữ liệu lên redux
	const currentUser = useSelector((state: any) => state.quanLyCongViec?.currentUser);//lấy user hiện tại
	const [loading, setLoading] = useState(false);//trạng thái nút bấm

	const onFinish = (values: { username: string }) => {
		setLoading(true);
		setTimeout(() => {
			if (values.username.trim() !== '') {
				dispatch({
					type: 'quanLyCongViec/setLogin',
					payload: values.username.trim()
				});//gửi username lên redux
				message.success(`Đăng nhập thành công! Chào ${values.username}`);
				setLoading(false);
			} else {
				message.error('Vui lòng nhập tên người dùng hợp lệ!');
				setLoading(false);
			}
		}, 500); // Simulate network latency
	};

	return (
		<Modal
			title='Đăng nhập Quản lý Công việc'
			visible={visible}
			footer={null}
			closable={false}
			maskClosable={false}
			keyboard={false}
			centered
		>
			<p>Vui lòng nhập tên người dùng của bạn để bắt đầu, dữ liệu sẽ được lưu tự động trên thiết bị của bạn.</p>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item
					name='username'
					rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
				>
					<Input size='large' prefix={<UserOutlined />} placeholder='Nhập tên người dùng của bạn...' />
				</Form.Item>
				<Form.Item style={{ marginBottom: 0 }}>
					<Button type='primary' htmlType='submit' size='large' block loading={loading}>
						Vào trang Quản lý
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default LoginModal;
