import React, { useEffect, useState } from 'react';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { useModel, useLocation } from 'umi';
import { Button, Space, Modal, Select, message } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import FormThanhVien from './components/Form';
import type { IDonDangKy } from '@/pages/CauLacBo/typing';

const ThanhVien = () => {
	const { setCondition, selectedIds, setSelectedIds, updateManyClub, getModel } = useModel('donDangKy');
	const { danhSach: lstCauLacBo, getModel: getCauLacBo } = useModel('cauLacBo');
	const [modalCLBVisible, setModalCLBVisible] = useState(false);
	const [selectedCLB, setSelectedCLB] = useState<string | null>(null);

	const location = useLocation() as any;
	const cauLacBoId = new URLSearchParams(location.search).get('cauLacBoId');
	const tenCLB = new URLSearchParams(location.search).get('tenCLB');

	useEffect(() => {
		getCauLacBo();
		const initCond: any = { trangThai: 'Approved' };
		if (cauLacBoId) initCond.cauLacBoId = cauLacBoId;
		setCondition(initCond);
		return () => {
			// Cleanup khi rời trang - reset condition
			setCondition({});
		};
	}, [cauLacBoId]);

	const handleChangeCLB = async () => {
		if (!selectedCLB) {
			message.warning('Vui lòng chọn câu lạc bộ muốn chuyển đến');
			return;
		}
		if (!selectedIds || selectedIds.length === 0) {
			message.warning('Chưa chọn thành viên nào');
			return;
		}
		await updateManyClub(selectedIds, selectedCLB);
		setModalCLBVisible(false);
		setSelectedIds([]);
		setSelectedCLB(null);
		getModel();
		message.success(`Đã chuyển ${selectedIds.length} thành viên sang câu lạc bộ mới`);
	};

	const columns: IColumn<IDonDangKy>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			width: 120,
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
			title: 'Sở trường',
			dataIndex: 'soTruong',
			width: 160,
			filterType: 'string',
		},
		{
			title: 'Câu lạc bộ',
			dataIndex: 'cauLacBoId',
			width: 180,
			filterType: 'select',
			filterData: lstCauLacBo.map((c: any) => ({ label: c.ten, value: c._id })),
			render: (val: string) => {
				const clb = lstCauLacBo.find((c: any) => c._id === val);
				return clb ? clb.ten : '--';
			},
		},
	];

	const extraButtons = selectedIds && selectedIds.length > 0 ? (
		<Space style={{ marginLeft: 8 }}>
			<Button type="primary" icon={<SwapOutlined />} onClick={() => setModalCLBVisible(true)}>
				Chuyển CLB cho {selectedIds.length} thành viên
			</Button>
		</Space>
	) as any : undefined;

	return (
		<>
			<TableBase
				title={tenCLB ? `Thành viên CLB: ${decodeURIComponent(tenCLB)}` : 'Quản lý Thành viên Câu lạc bộ'}
				modelName="donDangKy"
				columns={columns}
				Form={FormThanhVien}
				widthDrawer={600}
				formType="Drawer"
				destroyModal
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
				okText="Chuyển CLB"
				cancelText="Hủy"
			>
				<p>Chọn câu lạc bộ muốn chuyển đến:</p>
				<Select
					style={{ width: '100%' }}
					placeholder="Chọn câu lạc bộ"
					onChange={setSelectedCLB}
					value={selectedCLB}
					showSearch
					optionFilterProp='children'
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
