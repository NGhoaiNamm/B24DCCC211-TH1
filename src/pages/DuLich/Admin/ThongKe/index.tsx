import React, { useMemo } from 'react';
import { Row, Col, Card, Statistic, Table, Typography, Divider } from 'antd';
import {
	CompassOutlined,
	CalendarOutlined,
	DollarOutlined,
	EnvironmentOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import type { IDiemDen, ILichTrinh } from '@/pages/DuLich/typing';
import styles from '../../du-lich.less';

const { Title } = Typography;

const formatPrice = (price: number) =>
	new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const ThongKe: React.FC = () => {
	const { allData: allDiemDen } = useModel('diemDen');
	const { getAllData, getNganSachAll } = useModel('lichTrinh');

	const allLichTrinh: ILichTrinh[] = useMemo(() => getAllData(), []);
	const allNganSach = useMemo(() => getNganSachAll(), []);

	// --- Stats ---
	const totalLichTrinh = allLichTrinh.length;
	const totalDiemDen = allDiemDen.length;
	const totalRevenue = allLichTrinh.reduce((s, lt) => s + lt.nganSachTong, 0);

	// --- Monthly chart ---
	const monthlyMap: Record<string, number> = {};
	for (let i = 0; i < 12; i++) {
		monthlyMap[moment().subtract(11 - i, 'months').format('MM/YYYY')] = 0;
	}
	allLichTrinh.forEach((lt) => {
		const key = moment(lt.createdAt).format('MM/YYYY');
		if (key in monthlyMap) monthlyMap[key]++;
	});
	const monthlyLabels = Object.keys(monthlyMap);
	const monthlySeries = Object.values(monthlyMap);

	const monthlyChartOptions: ApexCharts.ApexOptions = {
		chart: { type: 'bar', toolbar: { show: false } },
		colors: ['#1890ff'],
		xaxis: { categories: monthlyLabels },
		yaxis: { labels: { formatter: (v) => `${Math.round(v)}` } },
		plotOptions: { bar: { borderRadius: 6, columnWidth: '55%' } },
		dataLabels: { enabled: true },
		title: { text: 'Số lịch trình tạo theo tháng', align: 'left', style: { fontSize: '14px' } },
	};

	// --- Popular destinations ---
	const destCountMap: Record<string, number> = {};
	allLichTrinh.forEach((lt) => {
		const allIds = lt.ngayList.flatMap((n) => n.diemDenIds);
		const uniqueIds = [...new Set(allIds)];
		uniqueIds.forEach((id) => {
			destCountMap[id] = (destCountMap[id] || 0) + 1;
		});
	});
	const popularDests = Object.entries(destCountMap)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 10)
		.map(([id, count]) => {
			const d = allDiemDen.find((x) => x._id === id);
			return { ten: d?.ten || 'Không rõ', count };
		});

	const popularChartOptions: ApexCharts.ApexOptions = {
		chart: { type: 'bar', toolbar: { show: false } },
		colors: ['#52c41a'],
		xaxis: { categories: popularDests.map((d) => d.ten) },
		plotOptions: { bar: { borderRadius: 6, horizontal: true } },
		dataLabels: { enabled: true },
		title: { text: 'Top 10 điểm đến phổ biến', align: 'left', style: { fontSize: '14px' } },
	};

	// --- Budget by category ---
	const totalCats = { anUong: 0, diChuyen: 0, luTru: 0, khac: 0 };
	allNganSach.forEach((ns) => {
		totalCats.anUong += ns.phanBo.anUong;
		totalCats.diChuyen += ns.phanBo.diChuyen;
		totalCats.luTru += ns.phanBo.luTru;
		totalCats.khac += ns.phanBo.khac;
	});

	// Also compute from destinations in itineraries
	const destTotals = { anUong: 0, diChuyen: 0, luTru: 0 };
	allLichTrinh.forEach((lt) => {
		const allIds = lt.ngayList.flatMap((n) => n.diemDenIds);
		const uniqueIds = [...new Set(allIds)];
		uniqueIds.forEach((id) => {
			const d = allDiemDen.find((x) => x._id === id);
			if (d) {
				destTotals.anUong += d.chiPhiAnUong;
				destTotals.diChuyen += d.chiPhiDiChuyen;
				destTotals.luTru += d.chiPhiLuTru;
			}
		});
	});

	const catSeries = [destTotals.anUong, destTotals.diChuyen, destTotals.luTru];
	const catLabels = ['Ăn uống', 'Di chuyển', 'Lưu trú'];
	const catColors = ['#FF6584', '#43BFEA', '#FFBE21'];

	const catChartOptions: ApexCharts.ApexOptions = {
		chart: { type: 'donut' },
		labels: catLabels,
		colors: catColors,
		legend: { position: 'bottom' },
		tooltip: { y: { formatter: (v) => formatPrice(v) } },
		title: { text: 'Phân bổ chi phí theo hạng mục', align: 'left', style: { fontSize: '14px' } },
		dataLabels: { formatter: (v: number) => `${v.toFixed(1)}%` },
	};

	// --- Popular destinations table ---
	const popularTableCols = [
		{ title: '#', key: 'rank', render: (_: any, __: any, index: number) => index + 1, width: 50 },
		{
			title: 'Điểm đến',
			dataIndex: 'ten',
			key: 'ten',
			render: (text: string) => <strong>{text}</strong>,
		},
		{
			title: 'Số lịch trình',
			dataIndex: 'count',
			key: 'count',
			sorter: (a: any, b: any) => b.count - a.count,
			render: (v: number) => <span style={{ color: '#1890ff', fontWeight: 600 }}>{v}</span>,
		},
	];

	return (
		<div>
			<Title level={3}>📊 Thống Kê Tổng Quan</Title>

			{/* Summary stats */}
			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={8}>
					<Card className={styles.statCard}>
						<Statistic
							title="Tổng lịch trình"
							value={totalLichTrinh}
							prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card className={styles.statCard}>
						<Statistic
							title="Tổng điểm đến"
							value={totalDiemDen}
							prefix={<EnvironmentOutlined style={{ color: '#52c41a' }} />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card className={styles.statCard}>
						<Statistic
							title="Tổng ngân sách kế hoạch"
							value={totalRevenue}
							prefix={<DollarOutlined style={{ color: '#faad14' }} />}
							formatter={(val) => formatPrice(Number(val))}
							valueStyle={{ color: '#faad14', fontSize: 18 }}
						/>
					</Card>
				</Col>
			</Row>

			{/* Charts row 1 */}
			<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
				<Col xs={24} lg={14}>
					<Card>
						<ReactApexChart
							options={monthlyChartOptions}
							series={[{ name: 'Số lịch trình', data: monthlySeries }]}
							type="bar"
							height={300}
						/>
					</Card>
				</Col>
				<Col xs={24} lg={10}>
					<Card>
						{catSeries.every((v) => v === 0) ? (
							<div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
								Chưa có dữ liệu chi phí
							</div>
						) : (
							<ReactApexChart
								options={catChartOptions}
								series={catSeries}
								type="donut"
								height={300}
							/>
						)}
					</Card>
				</Col>
			</Row>

			{/* Popular destinations */}
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={12}>
					<Card title="🏆 Top điểm đến phổ biến (biểu đồ)">
						{popularDests.length === 0 ? (
							<div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
								Chưa có dữ liệu
							</div>
						) : (
							<ReactApexChart
								options={popularChartOptions}
								series={[{ name: 'Số lịch trình', data: popularDests.map((d) => d.count) }]}
								type="bar"
								height={Math.max(200, popularDests.length * 38)}
							/>
						)}
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card title="📋 Bảng điểm đến phổ biến">
						<Table
							dataSource={popularDests}
							columns={popularTableCols}
							rowKey="ten"
							pagination={false}
							locale={{ emptyText: 'Chưa có dữ liệu lịch trình' }}
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default ThongKe;
