import React, { useEffect, useState } from 'react';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import FormDonDangKy from './components/Form';
import { Tag, Popconfirm, Button, Space, Tooltip, Modal, Input, message, Timeline } from 'antd';
import {
	EditOutlined, DeleteOutlined, CheckCircleOutlined,
	CloseCircleOutlined, EyeOutlined, HistoryOutlined,
} from '@ant-design/icons';
import type { IDonDangKy } from '@/pages/CauLacBo/typing';

const DonDangKy = () => {
	const {
		setRecord, setVisibleForm, deleteModel, setIsView, setEdit,
		updateManyStatus, selectedIds, setSelectedIds, getModel, setCondition,
	} = useModel('donDangKy');
	const { danhSach: lstCauLacBo, getModel: getCauLacBo } = useModel('cauLacBo');

	const [rejectModalVisible, setRejectModalVisible] = useState(false);
	const [rejectReason, setRejectReason] = useState('');
	const [currentActionIds, setCurrentActionIds] = useState<string[]>([]);
	const [historyModalVisible, setHistoryModalVisible] = useState(false);
	const [historyRecord, setHistoryRecord] = useState<IDonDangKy | null>(null);

	useEffect(() => {
		// Reset condition để không bị ảnh hưởng từ trang Thành Viên
		setCondition({});
		getCauLacBo();
		return () => {
			// Cleanup khi rời trang
			setCondition({});
		};
	}, []);

	const handleEdit = (rec: IDonDangKy) => {
		setRecord(rec);
		setEdit(true);
		setIsView(false);
		setVisibleForm(true);
	};

	const handleView = (rec: IDonDangKy) => {
		setRecord(rec);
		setEdit(false);
		setIsView(true);
		setVisibleForm(true);
	};

	const handleDelete = (id: string) => {
		deleteModel(id);
	};

	const handleApprove = (ids: string[]) => {
		Modal.confirm({
			title: `Xác nhận duyệt ${ids.length} đơn đăng ký`,
			content: 'Bạn có chắc chắn muốn duyệt các đơn đăng ký đã chọn?',
			okText: 'Duyệt',
			cancelText: 'Hủy',
			onOk: async () => {
				await updateManyStatus(ids, 'Approved');
				setSelectedIds([]);
				message.success(`Đã duyệt ${ids.length} đơn đăng ký!`);
			},
		});
	};

	const handleRejectClick = (ids: string[]) => {
		setCurrentActionIds(ids);
		setRejectReason('');
		setRejectModalVisible(true);
	};

	const submitReject = async () => {
		if (!rejectReason.trim()) {
			message.error('Vui lòng nhập lý do từ chối!');
			return;
		}
		await updateManyStatus(currentActionIds, 'Rejected', rejectReason);
		setRejectModalVisible(false);
		setSelectedIds([]);
		message.success(`Đã từ chối ${currentActionIds.length} đơn đăng ký`);
	};

	const showHistory = (rec: IDonDangKy) => {
		setHistoryRecord(rec);
		setHistoryModalVisible(true);
	};

	const columns: IColumn<IDonDangKy>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 140,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 170,
			filterType: 'string',
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			width: 110,
			filterType: 'string',
		},
		{
			title: 'Giới tính',
			dataIndex: 'gioiTinh',
			width: 90,
			align: 'center',
			filterType: 'select',
			filterData: [
				{ label: 'Nam', value: 'Nam' },
				{ label: 'Nữ', value: 'Nữ' },
				{ label: 'Khác', value: 'Khác' },
			],
		},
		{
			title: 'Câu lạc bộ',
			dataIndex: 'cauLacBoId',
			width: 160,
			filterType: 'select',
			filterData: lstCauLacBo.map((c: any) => ({ label: c.ten, value: c._id })),
			render: (val: string) => {
				const clb = lstCauLacBo.find((c: any) => c._id === val);
				return clb ? clb.ten : <span style={{ color: '#aaa' }}>--</span>;
			},
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 120,
			align: 'center',
			filterType: 'select',
			filterData: [
				{ label: 'Pending', value: 'Pending' },
				{ label: 'Approved', value: 'Approved' },
				{ label: 'Rejected', value: 'Rejected' },
			],
			render: (val: string) => {
				if (val === 'Approved') return <Tag color="success">✅ Approved</Tag>;
				if (val === 'Rejected') return <Tag color="error">❌ Rejected</Tag>;
				return <Tag color="warning">⏳ Pending</Tag>;
			},
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 180,
			render: (val: string) => val
				? <span style={{ fontSize: 12, color: '#888' }}>{val.slice(0, 60)}...</span>
				: '--',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 220,
			render: (rec: IDonDangKy) => (
				<Space size='small'>
					<Tooltip title="Xem chi tiết">
						<Button type="text" icon={<EyeOutlined />} onClick={() => handleView(rec)} />
					</Tooltip>
					<Tooltip title="Sửa">
						<Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(rec)} />
					</Tooltip>
					<Tooltip title="Duyệt đơn này">
						<Button type="text" style={{ color: '#52c41a' }} icon={<CheckCircleOutlined />}
							onClick={() => handleApprove([rec._id])} disabled={rec.trangThai === 'Approved'}
						/>
					</Tooltip>
					<Tooltip title="Từ chối đơn này">
						<Button type="text" danger icon={<CloseCircleOutlined />}
							onClick={() => handleRejectClick([rec._id])} disabled={rec.trangThai === 'Rejected'}
						/>
					</Tooltip>
					<Tooltip title="Lịch sử thao tác">
						<Button type="text" icon={<HistoryOutlined />} onClick={() => showHistory(rec)} />
					</Tooltip>
					<Tooltip title="Xóa">
						<Popconfirm title="Xác nhận xóa đơn đăng ký này?" onConfirm={() => handleDelete(rec._id)}>
							<Button type="text" danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</Space>
			),
		},
	];

	const extraButtons = selectedIds && selectedIds.length > 0 ? (
		<Space style={{ marginLeft: 8 }}>
			<Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleApprove(selectedIds)}>
				Duyệt {selectedIds.length} đơn đã chọn
			</Button>
			<Button danger icon={<CloseCircleOutlined />} onClick={() => handleRejectClick(selectedIds)}>
				Từ chối {selectedIds.length} đơn đã chọn
			</Button>
		</Space>
	) as any : undefined;

	return (
		<>
			<TableBase
				title="Quản lý Đơn đăng ký thành viên"
				modelName="donDangKy"
				columns={columns}
				Form={FormDonDangKy}
				widthDrawer={650}
				formType="Drawer"
				destroyModal
				rowSelection
				otherButtons={extraButtons}
			/>

			{/* Modal từ chối */}
			<Modal
				title={`Từ chối ${currentActionIds.length} đơn đăng ký`}
				visible={rejectModalVisible}
				onOk={submitReject}
				onCancel={() => setRejectModalVisible(false)}
				okText="Xác nhận từ chối"
				okButtonProps={{ danger: true }}
				cancelText="Hủy"
			>
				<p>Vui lòng nhập lý do từ chối <strong>(bắt buộc)</strong>:</p>
				<Input.TextArea
					rows={4}
					value={rejectReason}
					onChange={(e) => setRejectReason(e.target.value)}
					placeholder="VD: Hồ sơ chưa đầy đủ thông tin..."
					showCount
					maxLength={500}
				/>
			</Modal>

			{/* Modal lịch sử thao tác */}
			<Modal
				title="Lịch sử thao tác"
				visible={historyModalVisible}
				onCancel={() => setHistoryModalVisible(false)}
				footer={[
					<Button key="close" onClick={() => setHistoryModalVisible(false)}>Đóng</Button>,
				]}
			>
				{historyRecord?.lichSuThaoTac && historyRecord.lichSuThaoTac.length > 0 ? (
					<Timeline>
						{historyRecord.lichSuThaoTac.map((ls, idx) => (
							<Timeline.Item
								key={idx}
								color={ls.hanhDong === 'Approved' ? 'green' : 'red'}
							>
								<strong>{ls.hanhDong}</strong> lúc {ls.thoiGian}
								{ls.lyDo && <div style={{ color: '#888', fontSize: 12 }}>Lý do: {ls.lyDo}</div>}
							</Timeline.Item>
						))}
					</Timeline>
				) : (
					<p style={{ color: '#aaa', textAlign: 'center' }}>Chưa có lịch sử thao tác nào</p>
				)}
			</Modal>
		</>
	);
};

export default DonDangKy;
