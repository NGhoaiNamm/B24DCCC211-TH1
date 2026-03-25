import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Button, Select, Space, Divider } from 'antd';
import { DownloadOutlined, TeamOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import ColumnChart from '@/components/Chart/ColumnChart';
import { useModel } from 'umi';
import * as XLSX from 'xlsx';
import type { ICauLacBo, IDonDangKy } from '@/pages/CauLacBo/typing';

const BaoCao = () => {
	const { danhSach: lstCauLacBo, getModel: getCauLacBo } = useModel('cauLacBo');
	const { getModel: getDonDangKy } = useModel('donDangKy');

	const [allDonDangKy, setAllDonDangKy] = useState<IDonDangKy[]>([]);
	const [exportCLB, setExportCLB] = useState<string | null>(null);

	useEffect(() => {
		getCauLacBo();
		getDonDangKy();
		// Tải toàn bộ data không qua pagination để thống kê
		const dataStr = localStorage.getItem('donDangKyData');
		const data: IDonDangKy[] = dataStr ? JSON.parse(dataStr) : [];
		setAllDonDangKy(data);
	}, []);

	// Tự động reload khi CLB thay đổi
	useEffect(() => {
		const dataStr = localStorage.getItem('donDangKyData');
		const data: IDonDangKy[] = dataStr ? JSON.parse(dataStr) : [];
		setAllDonDangKy(data);
	}, [lstCauLacBo]);

	const totalCLB = lstCauLacBo.length;
	const pending = allDonDangKy.filter((x) => x.trangThai === 'Pending').length;
	const approved = allDonDangKy.filter((x) => x.trangThai === 'Approved').length;
	const rejected = allDonDangKy.filter((x) => x.trangThai === 'Rejected').length;

	// Dữ liệu chart
	const xAxis = lstCauLacBo.map((c: ICauLacBo) => c.ten);
	const pendingData = lstCauLacBo.map((c: ICauLacBo) =>
		allDonDangKy.filter((d) => d.cauLacBoId === c._id && d.trangThai === 'Pending').length
	);
	const approvedData = lstCauLacBo.map((c: ICauLacBo) =>
		allDonDangKy.filter((d) => d.cauLacBoId === c._id && d.trangThai === 'Approved').length
	);
	const rejectedData = lstCauLacBo.map((c: ICauLacBo) =>
		allDonDangKy.filter((d) => d.cauLacBoId === c._id && d.trangThai === 'Rejected').length
	);

	const handleExport = () => {
		if (!exportCLB) return;
		const clb = lstCauLacBo.find((c: ICauLacBo) => c._id === exportCLB);
		const members = allDonDangKy.filter((d) => d.cauLacBoId === exportCLB && d.trangThai === 'Approved');

		const dataToExport = members.map((m, index) => ({
			'STT': index + 1,
			'Họ tên': m.hoTen,
			'Email': m.email,
			'Số điện thoại': m.soDienThoai,
			'Giới tính': m.gioiTinh,
			'Địa chỉ': m.diaChi || '',
			'Sở trường': m.soTruong || '',
			'Câu lạc bộ': clb?.ten || '',
		}));

		const ws = XLSX.utils.json_to_sheet(dataToExport);

		// Tự động điều chỉnh độ rộng cột
		const colWidths = [
			{ wch: 5 }, { wch: 25 }, { wch: 25 }, { wch: 15 },
			{ wch: 10 }, { wch: 30 }, { wch: 25 }, { wch: 20 },
		];
		ws['!cols'] = colWidths;

		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Danh sách thành viên');
		XLSX.writeFile(wb, `Thanh_Vien_${(clb?.ten || 'CLB').replace(/\s/g, '_')}.xlsx`);
	};

	return (
		<div style={{ padding: 24 }}>
			<h2 style={{ marginBottom: 24 }}>Báo cáo & Thống kê</h2>

			{/* Thống kê số lượng */}
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title="Tổng số Câu lạc bộ"
							value={totalCLB}
							prefix={<TeamOutlined style={{ color: '#1677ff' }} />}
							valueStyle={{ color: '#1677ff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title="Đơn đang chờ duyệt (Pending)"
							value={pending}
							prefix={<ClockCircleOutlined />}
							valueStyle={{ color: '#faad14' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title="Đơn đã duyệt (Approved)"
							value={approved}
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title="Đơn từ chối (Rejected)"
							value={rejected}
							prefix={<CloseCircleOutlined />}
							valueStyle={{ color: '#f5222d' }}
						/>
					</Card>
				</Col>
			</Row>

			{/* Biểu đồ cột */}
			<Row style={{ marginTop: 24 }}>
				<Col span={24}>
					<Card title="Số đơn đăng ký theo Câu lạc bộ">
						{lstCauLacBo.length > 0 ? (
							<ColumnChart
								title="Thống kê đơn đăng ký"
								xAxis={xAxis}
								yAxis={[pendingData, approvedData, rejectedData]}
								yLabel={['Pending', 'Approved', 'Rejected']}
								colors={['#faad14', '#52c41a', '#f5222d']}
								formatY={(val: number) => val.toString()}
								height={380}
							/>
						) : (
							<p style={{ textAlign: 'center', color: '#aaa' }}>Chưa có dữ liệu câu lạc bộ</p>
						)}
					</Card>
				</Col>
			</Row>

			{/* Xuất Excel */}
			<Row style={{ marginTop: 24 }}>
				<Col span={24}>
					<Card
						title={<><FileTextOutlined /> Xuất danh sách thành viên ra Excel</>}
					>
						<p style={{ color: '#888', marginBottom: 16 }}>
							Chỉ xuất các thành viên có trạng thái <strong>Approved</strong>.
						</p>
						<Space>
							<Select
								style={{ width: 320 }}
								placeholder="Chọn câu lạc bộ muốn xuất"
								value={exportCLB}
								onChange={setExportCLB}
								showSearch
								optionFilterProp='children'
							>
								{lstCauLacBo.map((c: ICauLacBo) => {
									const count = allDonDangKy.filter((d) => d.cauLacBoId === c._id && d.trangThai === 'Approved').length;
									return (
										<Select.Option key={c._id} value={c._id}>
											{c.ten} ({count} thành viên)
										</Select.Option>
									);
								})}
							</Select>
							<Button
								type="primary"
								icon={<DownloadOutlined />}
								onClick={handleExport}
								disabled={!exportCLB}
							>
								Xuất file Excel (.xlsx)
							</Button>
						</Space>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default BaoCao;
