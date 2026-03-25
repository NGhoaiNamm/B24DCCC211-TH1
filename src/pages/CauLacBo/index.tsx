import React from 'react';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { useModel, history } from 'umi';
import FormCauLacBo from './components/Form';
import { Tag, Popconfirm, Button, Space, Tooltip, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, TeamOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import type { ICauLacBo } from './typing';

const CauLacBo = () => {
	const { setRecord, setVisibleForm, deleteModel, setIsView, setEdit } = useModel('cauLacBo');

	const handleEdit = (rec: ICauLacBo) => {
		setRecord(rec);
		setEdit(true);
		setIsView(false);
		setVisibleForm(true);
	};

	const handleView = (rec: ICauLacBo) => {
		setRecord(rec);
		setEdit(false);
		setIsView(true);
		setVisibleForm(true);
	};

	const handleDelete = (id: string) => {
		deleteModel(id);
	};

	const columns: IColumn<ICauLacBo>[] = [
		{
			title: 'Ảnh',
			dataIndex: 'anhDaiDien',
			width: 70,
			align: 'center',
			render: (val: string) => val
				? <Avatar src={val} size={40} />
				: <Avatar icon={<UserOutlined />} size={40} />,
		},
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Ngày thành lập',
			dataIndex: 'ngayThanhLap',
			width: 140,
			align: 'center',
			sortable: true,
			render: (val: string) => val ? new Date(val).toLocaleDateString('vi-VN') : '--',
		},
		{
			title: 'Chủ nhiệm',
			dataIndex: 'chuNhiem',
			width: 160,
			filterType: 'string',
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 200,
			render: (val: string) => val ? (
				<div style={{ maxHeight: 60, overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: val }} />
			) : '--',
		},
		{
			title: 'Hoạt động',
			dataIndex: 'hoatDong',
			width: 100,
			align: 'center',
			filterType: 'select',
			filterData: [
				{ label: 'Có', value: 'true' },
				{ label: 'Không', value: 'false' },
			],
			render: (val: boolean) => val
				? <Tag color="success">Có</Tag>
				: <Tag color="default">Không</Tag>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 150,
			render: (rec: ICauLacBo) => (
				<Space size='small'>
					<Tooltip title="Xem chi tiết">
						<Button type="text" icon={<EyeOutlined />} onClick={() => handleView(rec)} />
					</Tooltip>
					<Tooltip title="Xem thành viên">
						<Button type="text" icon={<TeamOutlined />} style={{ color: '#1677ff' }}
							onClick={() => history.push(`/quan-ly-cau-lac-bo/thanh-vien?cauLacBoId=${rec._id}&tenCLB=${encodeURIComponent(rec.ten)}`)}
						/>
					</Tooltip>
					<Tooltip title="Sửa">
						<Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(rec)} />
					</Tooltip>
					<Tooltip title="Xóa">
						<Popconfirm title="Xác nhận xóa câu lạc bộ này?" onConfirm={() => handleDelete(rec._id)}>
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
			widthDrawer={700}
			formType="Drawer"
			destroyModal
		/>
	);
};

export default CauLacBo;
