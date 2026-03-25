import React, { useState } from 'react';
import { Button, Card, Rate, Table } from 'antd';
import { connect } from 'umi';
import FormPhanHoi from './components/FormPhanHoi';

const DanhGia = ({ dispatch, list, employeeList }: any) => {
	const [visible, setVisible] = useState(false);
	const [currentId, setCurrentId] = useState<string | null>(null);

	const columns = [
		{ title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
		{
			title: 'Nhân viên phục vụ',
			key: 'employeeId',
			render: (_: any, rec: any) => employeeList.find((e: any) => e.id === rec.employeeId)?.name || '',
		},
		{
			title: 'Đánh giá',
			key: 'rating',
			render: (_: any, rec: any) => <Rate disabled allowHalf defaultValue={rec.rating} />,
		},
		{ title: 'Nội dung', dataIndex: 'comment', key: 'comment' },
		{
			title: 'Phản hồi từ nhân viên',
			dataIndex: 'reply',
			key: 'reply',
			render: (val: string) => <div dangerouslySetInnerHTML={{ __html: val }} />,
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, rec: any) => (
				<Button
					type='link'
					onClick={() => {
						setCurrentId(rec.id);
						setVisible(true);
					}}
				>
					Trả lời
				</Button>
			),
		},
	];

	return (
		<Card title='Đánh giá dịch vụ & nhân viên'>
			<Table columns={columns} dataSource={list} rowKey='id' pagination={{ pageSize: 10 }} />
			<FormPhanHoi visible={visible} onClose={() => setVisible(false)} dispatch={dispatch} currentId={currentId} />
		</Card>
	);
};

export default connect(({ bookingReview, bookingEmployee }: any) => ({
	list: bookingReview?.list || [],
	employeeList: bookingEmployee?.list || [],
}))(DanhGia);
