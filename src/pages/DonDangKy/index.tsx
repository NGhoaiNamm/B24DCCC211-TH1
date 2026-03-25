import React, { useEffect, useState } from 'react';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import FormDonDangKy from './components/Form';
import { Tag, Popconfirm, Button, Space, Tooltip, Modal, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, HistoryOutlined } from '@ant-design/icons';

const DonDangKy = () => {
	const { setRecord, setVisibleForm, deleteModel, setIsView, setEdit, updateManyStatus, selectedIds, setSelectedIds } = useModel('donDangKy');
    const { danhSach: lstCauLacBo, getModel: getCauLacBo } = useModel('cauLacBo');
    
    const [isRejectModalKV, setRejectModalVisible] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [currentActionIds, setCurrentActionIds] = useState<string[]>([]);
	const [historyModalVisible, setHistoryModalVisible] = useState(false);
	const [historyNote, setHistoryNote] = useState('');

    useEffect(() => {
        getCauLacBo();
    }, []);

	const handleEdit = (record: any) => {
		setRecord(record);
        setEdit(true);
        setIsView(false);
		setVisibleForm(true);
	};
    
    const handleView = (record: any) => {
		setRecord(record);
        setEdit(false);
        setIsView(true);
		setVisibleForm(true);
	};

	const handleDelete = (id: string) => {
		deleteModel(id);
	};
    
    const handleApprove = (ids: string[]) => {
        Modal.confirm({
            title: 'Khác nhận duyệt',
            content: `Bạn có chắc chắn muốn duyệt ${ids.length} đơn đăng ký này?`,
            onOk: () => {
                updateManyStatus(ids, 'Approved');
                setSelectedIds([]);
                message.success('Đã duyệt đơn đăng ký!');
            }
        });
    };
    
    const handleRejectClick = (ids: string[]) => {
        setCurrentActionIds(ids);
        setRejectReason('');
        setRejectModalVisible(true);
    };

    const submitReject = () => {
        if (!rejectReason.trim()) {
            message.error('Vui lòng nhập lý do từ chối');
            return;
        }
        updateManyStatus(currentActionIds, 'Rejected', rejectReason);
        setRejectModalVisible(false);
        setSelectedIds([]);
        message.success('Đã từ chối đơn đăng ký');
    };

	const showHistory = (note: string) => {
		setHistoryNote(note || 'Không có lịch sử thao tác');
		setHistoryModalVisible(true);
	};

	const columns: IColumn<any>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 150,
            search: 'search',
            filterType: 'string',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 150,
            search: 'search',
            filterType: 'string',
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			width: 120,
            search: 'search',
            filterType: 'string',
		},
		{
			title: 'Giới tính',
			dataIndex: 'gioiTinh',
			width: 100,
            align: 'center',
            filterType: 'select',
            filterData: [
                { text: 'Nam', value: 'Nam' },
                { text: 'Nữ', value: 'Nữ' },
            ],
		},
        {
			title: 'Câu lạc bộ',
			dataIndex: 'cauLacBoId',
			width: 150,
            render: (val: string) => {
                const clb = lstCauLacBo.find((c: any) => c._id === val);
                return clb ? clb.ten : val;
            },
            filterType: 'select',
            filterData: lstCauLacBo.map((c: any) => ({ text: c.ten, value: c._id })),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 120,
			align: 'center',
            filterType: 'select',
            filterData: [
                { text: 'Pending', value: 'Pending' },
                { text: 'Approved', value: 'Approved' },
                { text: 'Rejected', value: 'Rejected' },
            ],
			render: (val: string) => {
                if (val === 'Approved') return <Tag color="success">Approved</Tag>;
                if (val === 'Rejected') return <Tag color="error">Rejected</Tag>;
                return <Tag color="warning">Pending</Tag>;
            },
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 200,
			render: (record: any) => (
				<Space>
                    <Tooltip title="Xem chi tiết">
                        <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record)} />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
					<Tooltip title="Xóa">
                        <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record._id)}>
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
					<Tooltip title="Lịch sử duyệt">
						<Button type="text" icon={<HistoryOutlined />} onClick={() => showHistory(record.ghiChu)} />
					</Tooltip>
				</Space>
			),
		},
	];

    const extraButtons = selectedIds && selectedIds.length > 0 ? (
        <Space style={{ marginLeft: 8 }}>
            <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleApprove(selectedIds)}>
                Duyệt {selectedIds.length} đơn
            </Button>
            <Button danger icon={<CloseCircleOutlined />} onClick={() => handleRejectClick(selectedIds)}>
                Từ chối {selectedIds.length} đơn
            </Button>
        </Space>
    ) : null;

	return (
        <>
            <TableBase
                title="Quản lý Đơn đăng ký thành viên"
                modelName="donDangKy"
                columns={columns}
                Form={FormDonDangKy}
                widthDrawer={600}
                formType="Drawer"
                rowSelection
                otherButtons={extraButtons}
            />
            
            <Modal
                title="Từ chối đơn đăng ký"
                visible={isRejectModalKV}
                onOk={submitReject}
                onCancel={() => setRejectModalVisible(false)}
            >
                <p>Vui lòng nhập lý do từ chối:</p>
                <Input.TextArea 
                    rows={4} 
                    value={rejectReason} 
                    onChange={(e) => setRejectReason(e.target.value)} 
                    placeholder="Lý do từ chối (bắt buộc)" 
                />
            </Modal>

			<Modal
				title="Lịch sử thao tác"
				visible={historyModalVisible}
				onCancel={() => setHistoryModalVisible(false)}
				footer={[
					<Button key="close" onClick={() => setHistoryModalVisible(false)}>Đóng</Button>
				]}
			>
				<p>{historyNote}</p>
			</Modal>
        </>
	);
};

export default DonDangKy;
