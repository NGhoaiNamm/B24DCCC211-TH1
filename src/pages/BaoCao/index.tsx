import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Button, Select, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import ColumnChart from '@/components/Chart/ColumnChart';
import { useModel } from 'umi';
// Use dynamic import for xlsx if needed, but standard import should work if installed
import * as XLSX from 'xlsx';

const BaoCao = () => {
	const { danhSach: lstCauLacBo, getModel: getCauLacBo } = useModel('cauLacBo');
	const { danhSach: lstDonDangKy, getModel: getDonDangKy } = useModel('donDangKy');

	const [stats, setStats] = useState({
		totalCLB: 0,
		pending: 0,
		approved: 0,
		rejected: 0,
	});

	const [chartData, setChartData] = useState({
		xAxis: [] as string[],
		yAxis: [] as number[][],
	});

	const [exportCLB, setExportCLB] = useState<string | null>(null);

	useEffect(() => {
		getCauLacBo();
		getDonDangKy();
	}, []);

	useEffect(() => {
		// Calculate Stats
		const totalCLB = lstCauLacBo.length;
		const pending = lstDonDangKy.filter((x: any) => x.trangThai === 'Pending').length;
		const approved = lstDonDangKy.filter((x: any) => x.trangThai === 'Approved').length;
		const rejected = lstDonDangKy.filter((x: any) => x.trangThai === 'Rejected').length;
		setStats({ totalCLB, pending, approved, rejected });

		// Calculate Chart Data
		const xAxis = lstCauLacBo.map((c: any) => c.ten);
		const pendingData = lstCauLacBo.map((c: any) => lstDonDangKy.filter((d: any) => d.cauLacBoId === c._id && d.trangThai === 'Pending').length);
		const approvedData = lstCauLacBo.map((c: any) => lstDonDangKy.filter((d: any) => d.cauLacBoId === c._id && d.trangThai === 'Approved').length);
		const rejectedData = lstCauLacBo.map((c: any) => lstDonDangKy.filter((d: any) => d.cauLacBoId === c._id && d.trangThai === 'Rejected').length);

		setChartData({
			xAxis,
			yAxis: [pendingData, approvedData, rejectedData],
		});
	}, [lstCauLacBo, lstDonDangKy]);

	const handleExport = () => {
		if (!exportCLB) return;
		const clb = lstCauLacBo.find((c: any) => c._id === exportCLB);
		const members = lstDonDangKy.filter((d: any) => d.cauLacBoId === exportCLB && d.trangThai === 'Approved');
		
		const dataToExport = members.map((m: any, index: number) => ({
			'STT': index + 1,
			'Họ tên': m.hoTen,
			'Email': m.email,
			'Số điện thoại': m.soDienThoai,
			'Giới tính': m.gioiTinh,
			'Địa chỉ': m.diaChi,
			'Sở trường': m.soTruong,
		}));

		const ws = XLSX.utils.json_to_sheet(dataToExport);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'ThanhVien');
		XLSX.writeFile(wb, `Danh_Sach_Thanh_Vien_${clb?.ten || 'CLB'}.xlsx`);
	};

	return (
		<div style={{ padding: 24 }}>
			<Row gutter={[16, 16]}>
				<Col span={6}>
					<Card>
						<Statistic title="Tổng số Câu lạc bộ" value={stats.totalCLB} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title="Đơn Pending" value={stats.pending} valueStyle={{ color: '#faad14' }} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title="Đơn Approved" value={stats.approved} valueStyle={{ color: '#52c41a' }} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title="Đơn Rejected" value={stats.rejected} valueStyle={{ color: '#f5222d' }} />
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: 24 }}>
				<Col span={24}>
					<Card title="Thống kê Đơn đăng ký theo Câu lạc bộ">
						<ColumnChart
							title="Số lượng đơn"
							xAxis={chartData.xAxis}
							yAxis={chartData.yAxis}
							yLabel={['Pending', 'Approved', 'Rejected']}
							colors={['#faad14', '#52c41a', '#f5222d']}
                            formatY={(val: number) => val.toString()}
						/>
					</Card>
				</Col>
			</Row>

			<Row style={{ marginTop: 24 }}>
				<Col span={24}>
					<Card title="Xuất danh sách thành viên (Approved)">
						<Space>
							<Select
								style={{ width: 300 }}
								placeholder="Chọn câu lạc bộ"
								value={exportCLB}
								onChange={setExportCLB}
							>
								{lstCauLacBo.map((c: any) => (
									<Select.Option key={c._id} value={c._id}>
										{c.ten}
									</Select.Option>
								))}
							</Select>
							<Button type="primary" icon={<DownloadOutlined />} onClick={handleExport} disabled={!exportCLB}>
								Xuất file Excel
							</Button>
						</Space>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default BaoCao;
