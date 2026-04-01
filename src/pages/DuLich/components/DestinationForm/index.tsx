import React, { useEffect, useState } from 'react';
import {
	Modal,
	Form,
	Input,
	Select,
	InputNumber,
	Rate,
	message,
	Upload,
	Button,
	Divider,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { IDiemDen } from '@/pages/DuLich/typing';
import { Editor } from '@tinymce/tinymce-react';

interface Props {
	visible: boolean;
	onCancel: () => void;
	onSubmit: (values: Partial<IDiemDen>) => void;
	edit?: boolean;
	initialValues?: Partial<IDiemDen>;
}

const { Option } = Select;

const DestinationForm: React.FC<Props> = ({
	visible,
	onCancel,
	onSubmit,
	edit,
	initialValues,
}) => {
	const [form] = Form.useForm();
	const [moTa, setMoTa] = useState<string>('');
	const [imageUrl, setImageUrl] = useState<string>('');
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		if (visible) {
			if (edit && initialValues) {
				form.setFieldsValue(initialValues);
				setMoTa(initialValues.moTa || '');
				setImageUrl(initialValues.hinhAnh || '');
			} else {
				form.resetFields();
				setMoTa('');
				setImageUrl('');
			}
		}
	}, [visible, edit, initialValues]);

	const handleImageUpload = (file: File) => {
		setUploading(true);
		const reader = new FileReader();
		reader.onload = (e) => {
			const base64 = e.target?.result as string;
			setImageUrl(base64);
			setUploading(false);
		};
		reader.readAsDataURL(file);
		return false; // prevent auto upload
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			if (!imageUrl) {
				message.warning('Vui lòng upload hình ảnh điểm đến!');
				return;
			}
			onSubmit({ ...values, moTa, hinhAnh: imageUrl });
		} catch {
			// validation failed
		}
	};

	return (
		<Modal
			title={edit ? 'Cập nhật điểm đến' : 'Thêm điểm đến mới'}
			visible={visible}
			onCancel={onCancel}
			onOk={handleSubmit}
			okText={edit ? 'Cập nhật' : 'Thêm mới'}
			cancelText="Huỷ"
			width={800}
			destroyOnClose
		>
			<Form form={form} layout="vertical">
				<Form.Item
					name="ten"
					label="Tên điểm đến"
					rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
				>
					<Input placeholder="VD: Vịnh Hạ Long..." />
				</Form.Item>

				<Form.Item
					name="loai"
					label="Loại hình"
					rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
				>
					<Select placeholder="Chọn loại hình du lịch">
						<Option value="bien">🏖 Biển</Option>
						<Option value="nui">⛰ Núi</Option>
						<Option value="thanhPho">🏙 Thành phố</Option>
					</Select>
				</Form.Item>

				<Form.Item name="diaChi" label="Địa chỉ">
					<Input placeholder="VD: Quảng Ninh, Việt Nam" />
				</Form.Item>

				<Form.Item label="Hình ảnh">
					<div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
						<Upload
							accept="image/*"
							showUploadList={false}
							beforeUpload={handleImageUpload}
						>
							<Button icon={<UploadOutlined />} loading={uploading}>
								{uploading ? 'Đang xử lý...' : 'Upload ảnh'}
							</Button>
						</Upload>
						<Input
							placeholder="Hoặc nhập URL ảnh..."
							value={imageUrl}
							onChange={(e) => setImageUrl(e.target.value)}
							style={{ flex: 1 }}
						/>
					</div>
					{imageUrl && (
						<img
							src={imageUrl}
							alt="preview"
							style={{ marginTop: 8, maxHeight: 120, maxWidth: '100%', borderRadius: 8 }}
							onError={(e: any) => (e.target.style.display = 'none')}
						/>
					)}
				</Form.Item>

				<Divider style={{ margin: '8px 0' }}>Chi phí ước tính (VNĐ/người)</Divider>

				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
					<Form.Item
						name="chiPhiAnUong"
						label="Ăn uống"
						rules={[{ required: true }]}
					>
						<InputNumber
							min={0}
							style={{ width: '100%' }}
							formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(v) => Number(v?.replace(/,/g, '')) as any}
						/>
					</Form.Item>
					<Form.Item
						name="chiPhiLuTru"
						label="Lưu trú/đêm"
						rules={[{ required: true }]}
					>
						<InputNumber
							min={0}
							style={{ width: '100%' }}
							formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(v) => Number(v?.replace(/,/g, '')) as any}
						/>
					</Form.Item>
					<Form.Item
						name="chiPhiDiChuyen"
						label="Di chuyển"
						rules={[{ required: true }]}
					>
						<InputNumber
							min={0}
							style={{ width: '100%' }}
							formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(v) => Number(v?.replace(/,/g, '')) as any}
						/>
					</Form.Item>
				</div>

				<Form.Item
					name="thoiGianThamQuan"
					label="Thời gian tham quan (giờ)"
					rules={[{ required: true }]}
				>
					<InputNumber min={1} max={168} style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					name="rating"
					label="Đánh giá"
					rules={[{ required: true }]}
				>
					<Rate allowHalf />
				</Form.Item>

				<Form.Item label="Mô tả">
					<Editor
						apiKey="no-api-key"
						value={moTa}
						onEditorChange={(content) => setMoTa(content)}
						init={{
							height: 250,
							menubar: false,
							plugins: ['lists', 'link', 'image', 'code', 'table'],
							toolbar:
								'undo redo | bold italic underline | bullist numlist | link | code',
							content_style:
								'body { font-family: Arial, sans-serif; font-size: 14px }',
						}}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default DestinationForm;
