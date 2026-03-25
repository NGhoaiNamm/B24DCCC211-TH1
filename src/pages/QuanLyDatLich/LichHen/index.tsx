import React, { useState } from 'react';
import { Button, Card, Select, Table, Space, Tag } from 'antd';
import { connect } from 'umi';
import FormLichHen from './components/FormLichHen';
import FormThemDanhGia from './components/FormThemDanhGia';

const { Option } = Select;

const LichHen = ({ dispatch, appointmentList, employeeList, serviceList }: any) => {
	const [visible, setVisible] = useState(false);
	const [reviewVisible, setReviewVisible] = useState(false);
	const [currentApp, setCurrentApp] = useState(null);

	const columns = [
		{ title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
		{
			title: 'Dịch vụ',
			key: 'serviceId',
			render: (_: any, rec: any) => serviceList.find((s: any) => s.id === rec.serviceId)?.name || '',
		},
		{
			title: 'Nhân viên',
			key: 'employeeId',
			render: (_: any, rec: any) => employeeList.find((e: any) => e.id === rec.employeeId)?.name || '',
		},
		{ title: 'Ngày', dataIndex: 'date', key: 'date' },
		{ title: 'Giờ', dataIndex: 'time', key: 'time' },
		{
			title: 'Trạng thái',
			key: 'status',
			render: (_: any, rec: any) => {
				const colors: Record<string, string> = {
					'Chờ duyệt': 'orange',
					'Xác nhận': 'blue',
					'Hoàn thành': 'green',
					Hủy: 'red',
				};
				return <Tag color={colors[rec.status] || 'default'}>{rec.status}</Tag>;
			},
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, rec: any) => (
				<Space>
					<Select
						value={rec.status}
						style={{ width: 130 }}
						onChange={(v) => dispatch({ type: 'bookingAppointment/updateStatus', payload: { id: rec.id, status: v } })}
					>
						<Option value='Chờ duyệt'>Chờ duyệt</Option>
						<Option value='Xác nhận'>Xác nhận</Option>
						<Option value='Hoàn thành'>Hoàn thành</Option>
						<Option value='Hủy'>Hủy</Option>
					</Select>
					{rec.status === 'Hoàn thành' && !rec.isReviewed && (
						<Button
							type='primary'
							size='small'
							onClick={() => {
								setCurrentApp(rec);
								setReviewVisible(true);
							}}
						>
							Đánh giá
						</Button>
					)}
				</Space>
			),
		},
	];

	return (
		<Card
			title='Quản lý lịch hẹn'
			extra={
				<Button type='primary' onClick={() => setVisible(true)}>
					Đặt lịch
				</Button>
			}
		>
			<Table columns={columns} dataSource={appointmentList} rowKey='id' pagination={{ pageSize: 10 }} />
			<FormLichHen
				visible={visible}
				onClose={() => setVisible(false)}
				dispatch={dispatch}
				employeeList={employeeList}
				serviceList={serviceList}
			/>
			<FormThemDanhGia
				visible={reviewVisible}
				onClose={() => setReviewVisible(false)}
				dispatch={dispatch}
				record={currentApp}
			/>
		</Card>
	);
};

export default connect(({ bookingAppointment, bookingEmployee, bookingService }: any) => ({
	appointmentList: bookingAppointment?.list || [],
	employeeList: bookingEmployee?.list || [],
	serviceList: bookingService?.list || [],
}))(LichHen);
