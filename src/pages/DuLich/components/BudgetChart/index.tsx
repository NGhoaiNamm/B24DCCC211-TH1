import React, { useMemo } from 'react';
import { Alert, Statistic, Row, Col } from 'antd';
import ReactApexChart from 'react-apexcharts';
import type { INganSachCategory } from '@/pages/DuLich/typing';

interface Props {
	data: INganSachCategory;
	nganSachTong?: number;
	height?: number;
}

const formatPrice = (price: number) =>
	new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const BudgetChart: React.FC<Props> = ({ data, nganSachTong, height = 320 }) => {
	const categories = [
		{ key: 'anUong', label: 'Ăn uống', color: '#FF6584' },
		{ key: 'diChuyen', label: 'Di chuyển', color: '#43BFEA' },
		{ key: 'luTru', label: 'Lưu trú', color: '#FFBE21' },
		{ key: 'khac', label: 'Khác', color: '#8C6FE6' },
	];

	const series = useMemo(
		() => categories.map((c) => (data as any)[c.key] || 0),
		[data],
	);
	const labels = categories.map((c) => c.label);
	const colors = categories.map((c) => c.color);
	const total = series.reduce((a, b) => a + b, 0);
	const overBudget = nganSachTong !== undefined && total > nganSachTong;

	const options: ApexCharts.ApexOptions = {
		chart: { type: 'donut' },
		labels,
		colors,
		legend: { position: 'bottom' },
		tooltip: {
			y: {
				formatter: (val: number) => formatPrice(val),
			},
		},
		plotOptions: {
			pie: {
				donut: {
					labels: {
						show: true,
						total: {
							show: true,
							label: 'Tổng chi',
							formatter: () => formatPrice(total),
						},
					},
				},
			},
		},
		dataLabels: {
			formatter: (val: number) => `${val.toFixed(1)}%`,
		},
		responsive: [
			{
				breakpoint: 480,
				options: {
					chart: { width: 300 },
					legend: { position: 'bottom' },
				},
			},
		],
	};

	return (
		<div>
			{overBudget && (
				<Alert
					type="warning"
					showIcon
					message="Vượt ngân sách!"
					description={`Tổng chi phí ${formatPrice(total)} vượt quá ngân sách ${formatPrice(nganSachTong!)} (chênh lệch: ${formatPrice(total - nganSachTong!)})`}
					style={{ marginBottom: 16 }}
					banner
				/>
			)}
			{total === 0 ? (
				<div style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
					Chưa có dữ liệu ngân sách
				</div>
			) : (
				<ReactApexChart options={options} series={series} type="donut" height={height} />
			)}
			<Row gutter={16} style={{ marginTop: 16 }}>
				{categories.map((c) => (
					<Col xs={12} sm={6} key={c.key}>
						<Statistic
							title={c.label}
							value={(data as any)[c.key] || 0}
							formatter={(val) => formatPrice(Number(val))}
							valueStyle={{ color: c.color, fontSize: 14 }}
						/>
					</Col>
				))}
			</Row>
			{nganSachTong !== undefined && (
				<div style={{ marginTop: 12, textAlign: 'right', color: overBudget ? '#ff4d4f' : '#52c41a' }}>
					<strong>
						Ngân sách: {formatPrice(nganSachTong)} | Đã dùng: {formatPrice(total)} |{' '}
						{overBudget ? `Vượt: ${formatPrice(total - nganSachTong)}` : `Còn lại: ${formatPrice(nganSachTong - total)}`}
					</strong>
				</div>
			)}
		</div>
	);
};

export default BudgetChart;
