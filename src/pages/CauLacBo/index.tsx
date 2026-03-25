import React from 'react';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { useModel, history } from 'umi';
import FormCauLacBo from './components/Form';
import { Tag, Popconfirm, Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';

const CauLacBo = () => {
	const { setRecord, setVisibleForm, deleteModel, setIsView, setEdit } = useModel('cauLacBo');

	const handleEdit = (record: any) => {
		setRecord(record);
		setEdit(true);
		setIsView(false);
		setVisibleForm(true);
	};

	const handleDelete = (id: string) => {
		deleteModel(id);
	};

	const columns: IColumn<any>[] = [
		{
			title: 'Ảnh',
			dataIndex: 'anhDaiDien',
			width: 80,
			align: 'center',
			render: (val: string) => val ? <img src={val} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} /> : <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ccc', margin: 'auto' }} />,
		},
		{
			title: 'Tên định danh',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
		},
		{
			title: 'Ngày thiết lập',
			dataIndex: 'ngayThanhLap',
			width: 120,
			align: 'center',
			sortable: true,
		},
		{
			title: 'Chủ nhiệm',
			dataIndex: 'chuNhiem',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Hoạt động',
			dataIndex: 'hoatDong',
			width: 100,
			align: 'center',
			render: (val: boolean) => (val ? <Tag color="success">Có</Tag> : <Tag color="default">Không</Tag>),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 150,
			render: (record: any) => (
				<Space>
					<Tooltip title="Xem thành viên">
						<Button type="text" icon={<TeamOutlined />} onClick={() => history.push(`/quan-ly-cau-lac-bo/thanh-vien?cauLacBoId=${record._id}`)} />
					</Tooltip>
					<Tooltip title="Sửa">
						<Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					</Tooltip>
					<Tooltip title="Xóa">
						<Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record._id)}>
							<Button type="text" danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</Space>
			),
		},
	];

	return (
		<TableBase
			title="Danh sách Câu lạc bộ"
			modelName="cauLacBo"
			columns={columns}
			Form={FormCauLacBo}
			widthDrawer={600}
			formType="Drawer"
		/>
	);
};

export default CauLacBo;
