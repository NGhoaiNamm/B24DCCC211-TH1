import React, { useRef, useState } from 'react';
import {
	Table,
	Button,
	Space,
	Popconfirm,
	message,
	Tag,
	Rate,
	Avatar,
	Input,
	Tooltip,
	Typography,
} from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	SearchOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import type { IDiemDen } from '@/pages/DuLich/typing';
import DestinationForm from '../../components/DestinationForm';

const { Title } = Typography;

const LOAI_LABEL: Record<string, { label: string; color: string }> = {
	bien: { label: 'Biển', color: 'blue' },
	nui: { label: 'Núi', color: 'green' },
	thanhPho: { label: 'Thành Phố', color: 'orange' },
};

const formatPrice = (price: number) =>
	new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const AdminDiemDen: React.FC = () => {
	const {
		danhSach,
		loading,
		total,
		page,
		setPage,
		limit,
		setLimit,
		sortField,
		setSortField,
		sortOrder,
		setSortOrder,
		searchText,
		setSearchText,
		filterLoai,
		setFilterLoai,
		addModel,
		updateModel,
		deleteModel,
	} = useModel('diemDen');

	const [visibleForm, setVisibleForm] = useState(false);
	const [editRecord, setEditRecord] = useState<Partial<IDiemDen> | null>(null);
	const searchInput = useRef<any>(null);

	const getColumnSearch = (dataIndex: keyof IDiemDen) => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={searchInput}
					placeholder={`Tìm ${dataIndex}...`}
					value={selectedKeys[0]}
					onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => {
						confirm();
						setSearchText(selectedKeys[0] || '');
					}}
					style={{ marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => {
							confirm();
							setSearchText(selectedKeys[0] || '');
						}}
						icon={<SearchOutlined />}
						size="small"
					>
						Tìm
					</Button>
					<Button
						onClick={() => {
							clearFilters();
							setSearchText('');
						}}
						size="small"
					>
						Xoá
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered: boolean) => (
			<SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
		),
	});

	const columns = [
		{
			title: 'Hình ảnh',
			dataIndex: 'hinhAnh',
			key: 'hinhAnh',
			width: 80,
			render: (url: string, record: IDiemDen) => (
				<Avatar
					src={url}
					shape="square"
					size={56}
					style={{ borderRadius: 8 }}
					onError={() => true}
				>
					{record.ten[0]}
				</Avatar>
			),
		},
		{
			title: 'Tên điểm đến',
			dataIndex: 'ten',
			key: 'ten',
			sorter: true,
			render: (text: string) => <strong>{text}</strong>,
			...getColumnSearch('ten'),
		},
		{
			title: 'Loại',
			dataIndex: 'loai',
			key: 'loai',
			filters: [
				{ text: 'Biển', value: 'bien' },
				{ text: 'Núi', value: 'nui' },
				{ text: 'Thành Phố', value: 'thanhPho' },
			],
			render: (loai: string) => {
				const info = LOAI_LABEL[loai] || { label: loai, color: 'default' };
				return <Tag color={info.color}>{info.label}</Tag>;
			},
		},
		{
			title: 'Đánh giá',
			dataIndex: 'rating',
			key: 'rating',
			sorter: true,
			render: (v: number) => <Rate disabled allowHalf defaultValue={v} style={{ fontSize: 14 }} />,
		},
		{
			title: 'Tổng chi phí',
			key: 'tongChiPhi',
			sorter: (a: IDiemDen, b: IDiemDen) =>
				(a.chiPhiAnUong + a.chiPhiLuTru + a.chiPhiDiChuyen) -
				(b.chiPhiAnUong + b.chiPhiLuTru + b.chiPhiDiChuyen),
			render: (_: any, record: IDiemDen) =>
				formatPrice(record.chiPhiAnUong + record.chiPhiLuTru + record.chiPhiDiChuyen),
		},
		{
			title: 'Ăn uống',
			dataIndex: 'chiPhiAnUong',
			key: 'chiPhiAnUong',
			sorter: true,
			render: (v: number) => formatPrice(v),
			responsive: ['lg'] as any,
		},
		{
			title: 'Lưu trú',
			dataIndex: 'chiPhiLuTru',
			key: 'chiPhiLuTru',
			sorter: true,
			render: (v: number) => formatPrice(v),
			responsive: ['lg'] as any,
		},
		{
			title: 'Di chuyển',
			dataIndex: 'chiPhiDiChuyen',
			key: 'chiPhiDiChuyen',
			sorter: true,
			render: (v: number) => formatPrice(v),
			responsive: ['lg'] as any,
		},
		{
			title: 'TG tham quan',
			dataIndex: 'thoiGianThamQuan',
			key: 'thoiGianThamQuan',
			sorter: true,
			render: (v: number) => `${v} giờ`,
			responsive: ['md'] as any,
		},
		{
			title: 'Thao tác',
			key: 'action',
			fixed: 'right' as any,
			width: 120,
			render: (_: any, record: IDiemDen) => (
				<Space>
					<Tooltip title="Chỉnh sửa">
						<Button
							icon={<EditOutlined />}
							size="small"
							onClick={() => {
								setEditRecord(record);
								setVisibleForm(true);
							}}
						/>
					</Tooltip>
					<Popconfirm
						title="Xoá điểm đến này?"
						onConfirm={() => {
							deleteModel(record._id);
							message.success('Đã xoá!');
						}}
						okText="Xoá"
						cancelText="Huỷ"
					>
						<Tooltip title="Xoá">
							<Button icon={<DeleteOutlined />} size="small" danger />
						</Tooltip>
					</Popconfirm>
				</Space>
			),
		},
	];

	const handleTableChange = (pagination: any, filters: any, sorter: any) => {
		setPage(pagination.current);
		setLimit(pagination.pageSize);
		if (sorter.field) {
			setSortField(sorter.field);
			setSortOrder(sorter.order || '');
		} else {
			setSortField('');
			setSortOrder('');
		}
		if (filters.loai && filters.loai.length > 0) {
			setFilterLoai(filters.loai);
		} else {
			setFilterLoai([]);
		}
	};

	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
				<Title level={3} style={{ margin: 0 }}>
					🗺 Quản lý Điểm Đến
				</Title>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => {
						setEditRecord(null);
						setVisibleForm(true);
					}}
				>
					Thêm điểm đến
				</Button>
			</div>

			<Table
				dataSource={danhSach}
				columns={columns}
				rowKey="_id"
				loading={loading}
				scroll={{ x: 1100 }}
				onChange={handleTableChange}
				pagination={{
					current: page,
					pageSize: limit,
					total,
					showSizeChanger: true,
					pageSizeOptions: ['5', '10', '20'],
					showTotal: (t) => `Tổng ${t} điểm đến`,
				}}
			/>

			<DestinationForm
				visible={visibleForm}
				edit={!!editRecord}
				initialValues={editRecord || {}}
				onCancel={() => {
					setVisibleForm(false);
					setEditRecord(null);
				}}
				onSubmit={async (values) => {
					if (editRecord && editRecord._id) {
						await updateModel(editRecord._id, values);
						message.success('Cập nhật thành công!');
					} else {
						await addModel(values);
						message.success('Thêm điểm đến thành công!');
					}
					setVisibleForm(false);
					setEditRecord(null);
				}}
			/>
		</div>
	);
};

export default AdminDiemDen;
