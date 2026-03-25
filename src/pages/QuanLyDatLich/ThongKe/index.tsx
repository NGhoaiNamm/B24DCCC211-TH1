import React from 'react';
import { Card, Row, Col, Statistic, Empty } from 'antd';
import { connect } from 'umi';
import ColumnChart from '@/components/Chart/ColumnChart';

const ThongKe = ({ appointmentList, serviceList, employeeList }: any) => {
	const completed = appointmentList.filter((a: any) => a.status === 'Hoàn thành');

	// 1. Chuẩn bị data cho biểu đồ Số lượng (Line/Column)
	const apptsByDate = appointmentList.reduce((acc: any, curr: any) => {
		if (curr.date) {
			acc[curr.date] = (acc[curr.date] || 0) + 1;
		}
		return acc;
	}, {});

	const lineXAxis = Object.keys(apptsByDate); // ['2023-10-01', '2023-10-02']
	const lineYAxis = [lineXAxis.map((date) => apptsByDate[date])]; // [[5, 10]]
	const lineYLabel = ['Số lượng lịch hẹn'];

	// 2. Chuẩn bị data cho biểu đồ Doanh thu (Column)
	const columnXAxis = employeeList.map((emp: any) => emp.name);
	const columnYAxis = [
		employeeList.map((emp: any) => {
			return completed
				.filter((a: any) => a.employeeId === emp.id)
				.reduce((sum: number, app: any) => {
					const srv = serviceList.find((s: any) => s.id === app.serviceId);
					return sum + (srv ? srv.price : 0);
				}, 0);
		}),
	];
	const columnYLabel = ['Doanh thu (VNĐ)'];

	return (
		<div>
			<Row gutter={16} style={{ marginBottom: 24 }}>
				<Col span={8}>
					<Card>
						<Statistic title='Lịch đã hoàn thành' value={completed.length} valueStyle={{ color: '#3f8600' }} />
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<Statistic
							title='Lịch đang chờ duyệt'
							value={appointmentList.filter((a: any) => a.status === 'Chờ duyệt').length}
							valueStyle={{ color: '#faad14' }}
						/>
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<Statistic
							title='Lịch đã hủy'
							value={appointmentList.filter((a: any) => a.status === 'Hủy').length}
							valueStyle={{ color: '#cf1322' }}
						/>
					</Card>
				</Col>
			</Row>
			<Row gutter={16}>
				<Col span={12}>
					<Card title='Thống kê số lượng lịch hẹn theo ngày'>
						{lineXAxis.length > 0 ? (
							<ColumnChart type='line' xAxis={lineXAxis} yAxis={lineYAxis} yLabel={lineYLabel} height={350} />
						) : (
							<Empty description='Chưa có dữ liệu thống kê' />
						)}
					</Card>
				</Col>
				<Col span={12}>
					<Card title='Thống kê doanh thu theo nhân viên'>
						{columnXAxis.length > 0 ? (
							<ColumnChart xAxis={columnXAxis} yAxis={columnYAxis} yLabel={columnYLabel} height={350} />
						) : (
							<Empty description='Chưa có dữ liệu thống kê' />
						)}
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default connect(({ bookingAppointment, bookingService, bookingEmployee }: any) => ({
	appointmentList: bookingAppointment?.list || [],
	serviceList: bookingService?.list || [],
	employeeList: bookingEmployee?.list || [],
}))(ThongKe);
