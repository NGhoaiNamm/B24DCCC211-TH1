import React, { useState } from 'react';
import { Button, Card, Popconfirm, Space, Table, Rate } from 'antd';
import { connect } from 'umi';
import FormNhanVien from './components/FormNhanVien';

const NhanVien = ({ dispatch, list, reviewList }: any) => {
	const [visible, setVisible] = useState(false);
	const [record, setRecord] = useState(null);

	const getAverageRating = (employeeId: string) => {
		const reviews = reviewList.filter((r: any) => r.employeeId === employeeId);
		if (reviews.length === 0) return 0;
		const total = reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
		return Number((total / reviews.length).toFixed(1));
	};

	const columns = [
		{ title: 'Tên nhân viên', dataIndex: 'name', key: 'name' },
		{ title: 'Lịch làm việc', dataIndex: 'schedule', key: 'schedule' },
		{ title: 'Giới hạn khách/ngày', dataIndex: 'limit', key: 'limit' },
		{
			title: 'Đánh giá',
			key: 'rating',
			render: (_: any, rec: any) => <Rate disabled allowHalf value={getAverageRating(rec.id)} />,
		},
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
						title='Xóa nhân viên?'
						onConfirm={() => dispatch({ type: 'bookingEmployee/remove', payload: rec.id })}
					>
						<Button danger>Xóa</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card
			title='Quản lý nhân viên & dịch vụ'
			extra={
				<Button
					type='primary'
					onClick={() => {
						setRecord(null);
						setVisible(true);
					}}
				>
					Thêm nhân viên
				</Button>
			}
		>
			<Table columns={columns} dataSource={list} rowKey='id' pagination={{ pageSize: 10 }} />
			<FormNhanVien visible={visible} onClose={() => setVisible(false)} record={record} dispatch={dispatch} />
		</Card>
	);
};

export default connect(({ bookingEmployee, bookingReview }: any) => ({
	list: bookingEmployee?.list || [],
	reviewList: bookingReview?.list || [],
}))(NhanVien);
