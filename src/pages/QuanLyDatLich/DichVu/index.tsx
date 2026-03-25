import React, { useState } from 'react';
import { Button, Card, Popconfirm, Space, Table } from 'antd';
import { connect } from 'umi';
import FormDichVu from './components/FormDichVu';

const DichVu = ({ dispatch, list }: any) => {
	const [visible, setVisible] = useState(false);
	const [record, setRecord] = useState(null);

	const columns = [
		{ title: 'Tên dịch vụ', dataIndex: 'name', key: 'name' },
		{ title: 'Giá (VNĐ)', dataIndex: 'price', key: 'price' },
		{ title: 'Thời gian (Phút)', dataIndex: 'duration', key: 'duration' },
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, rec: any) => (
				<Space>
					<Button
						type='primary'
						onClick={() => {
							setRecord(rec);
							setVisible(true);
						}}
					>
						Sửa
					</Button>
					<Popconfirm
						title='Xóa dịch vụ?'
						onConfirm={() => dispatch({ type: 'bookingService/remove', payload: rec.id })}
					>
						<Button danger>Xóa</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card
			title='Quản lý danh sách dịch vụ'
			extra={
				<Button
					type='primary'
					onClick={() => {
						setRecord(null);
						setVisible(true);
					}}
				>
					Thêm dịch vụ
				</Button>
			}
		>
			<Table columns={columns} dataSource={list} rowKey='id' pagination={{ pageSize: 10 }} />
			<FormDichVu visible={visible} onClose={() => setVisible(false)} record={record} dispatch={dispatch} />
		</Card>
	);
};

export default connect(({ bookingService }: any) => ({ list: bookingService?.list || [] }))(DichVu);
