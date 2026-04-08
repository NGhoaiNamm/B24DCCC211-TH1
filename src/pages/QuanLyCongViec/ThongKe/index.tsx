import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { useSelector } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ReactApexChart from 'react-apexcharts';
import LoginModal from '../components/LoginModal';

const ThongKe: React.FC = () => {
	const { currentUser, danhSach } = useSelector((state: any) => state.quanLyCongViec);

	const totalTasks = danhSach?.length || 0;
	const tasksTodo = danhSach?.filter((t: any) => t.trangThai === 'Todo').length || 0;
	const tasksDoing = danhSach?.filter((t: any) => t.trangThai === 'Doing').length || 0;
	const tasksDone = danhSach?.filter((t: any) => t.trangThai === 'Done').length || 0;

	const pieChartOptions = {
		labels: ['Chưa làm', 'Đang làm', 'Đã xong'],
		colors: ['#d9d9d9', '#1890ff', '#52c41a'],
		legend: { position: 'bottom' as const },
	};
	const pieChartSeries = [tasksTodo, tasksDoing, tasksDone];

	return (
		<PageContainer>
			<LoginModal visible={!currentUser} />
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic title="Tổng số công việc" value={totalTasks} />
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic title="Đã xong" value={tasksDone} valueStyle={{ color: '#52c41a' }} />
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic title="Đang làm" value={tasksDoing} valueStyle={{ color: '#1890ff' }} />
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic title="Chưa làm" value={tasksTodo} valueStyle={{ color: '#d9d9d9' }} />
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col xs={24} md={12}>
					<Card title='Tỉ lệ hoàn thành công việc'>
						{totalTasks > 0 ? (
							<ReactApexChart options={pieChartOptions} series={pieChartSeries} type="pie" height={350} />
						) : (
							<div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>Không có dữ liệu</div>
						)}
					</Card>
				</Col>
			</Row>
		</PageContainer>
	);
};

export default ThongKe;
