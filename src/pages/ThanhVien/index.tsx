import React, { useEffect, useState } from 'react';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { useModel, useLocation } from 'umi';
import { Tag, Modal, Button, Space, Tooltip, Select } from 'antd';
import { ExportOutlined, SwapOutlined } from '@ant-design/icons';

const ThanhVien = () => {
    const { getModel: getDonDangKy, setCondition, condition, selectedIds, setSelectedIds, updateManyClub } = useModel('donDangKy');
    const { danhSach: lstCauLacBo, getModel: getCauLacBo } = useModel('cauLacBo');
    const [modalCLBVisible, setModalCLBVisible] = useState(false);
    const [selectedCLB, setSelectedCLB] = useState<string | null>(null);
    
    // Parse URL to see if we navigate from Club page
    const location = useLocation() as any;
    const searchParams = new URLSearchParams(location.search);
    const cauLacBoId = searchParams.get('cauLacBoId');

    useEffect(() => {
        getCauLacBo();
        const initCond: any = { trangThai: 'Approved' };
        if (cauLacBoId) initCond.cauLacBoId = cauLacBoId;
        setCondition(initCond);
    }, [cauLacBoId]);
    
    // Reset condition when leaving if needed or let umi handles it

    const handleChangeCLB = () => {
        if (!selectedCLB) return;
        updateManyClub(selectedIds, selectedCLB);
        setModalCLBVisible(false);
        setSelectedIds([]);
        setSelectedCLB(null);
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
			width: 80,
            align: 'center',
            filterType: 'select',
            filterData: [
                { text: 'Nam', value: 'Nam' },
                { text: 'Nữ', value: 'Nữ' },
            ],
		},
        {
			title: 'Sở trường',
			dataIndex: 'soTruong',
			width: 150,
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
	];

    const extraButtons = selectedIds && selectedIds.length > 0 ? (
        <Space style={{ marginLeft: 8 }}>
            <Button type="primary" icon={<SwapOutlined />} onClick={() => setModalCLBVisible(true)}>
                Chuyển CLB cho {selectedIds.length} thành viên
            </Button>
        </Space>
    ) : null;

	return (
        <>
            <TableBase
                title="Quản lý Thành viên Câu lạc bộ"
                modelName="donDangKy"
                columns={columns}
                rowSelection
                otherButtons={extraButtons}
            />
            
            <Modal
                title={`Chuyển CLB cho ${selectedIds?.length || 0} thành viên`}
                visible={modalCLBVisible}
                onOk={handleChangeCLB}
                onCancel={() => {
                    setModalCLBVisible(false);
                    setSelectedCLB(null);
                }}
            >
                <p>Chọn câu lạc bộ muốn chuyển đến:</p>
                <Select
                    style={{ width: '100%' }}
                    placeholder="Chọn câu lạc bộ"
                    onChange={setSelectedCLB}
                    value={selectedCLB}
                >
                    {lstCauLacBo.map((c: any) => (
                        <Select.Option key={c._id} value={c._id}>
                            {c.ten}
                        </Select.Option>
                    ))}
                </Select>
            </Modal>
        </>
	);
};

export default ThanhVien;
