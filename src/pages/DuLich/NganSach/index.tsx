import React, { useState, useEffect } from 'react';
import {
	Select,
	Typography,
	Row,
	Col,
	Card,
	Table,
	InputNumber,
	Button,
	Divider,
	Alert,
	Empty,
	message,
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { INganSachCategory, INganSach, IDiemDen } from '@/pages/DuLich/typing';
import BudgetChart from '../components/BudgetChart';
import styles from '../du-lich.less';

const { Title, Text } = Typography;
const { Option } = Select;

const formatPrice = (price: number) =>
	new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const CATEGORIES = [
	{ key: 'anUong', label: '🍜 Ăn uống' },
	{ key: 'diChuyen', label: '🚗 Di chuyển' },
	{ key: 'luTru', label: '🏨 Lưu trú' },
	{ key: 'khac', label: '💼 Khác' },
];

const NganSach: React.FC = () => {
	const lichTrinhModel = useModel('lichTrinh');
	const diemDenModel = useModel('diemDen');
	const { danhSach, getNganSach, saveNganSach } = lichTrinhModel;

	const [selectedLTId, setSelectedLTId] = useState<string>('');
	const [phanBo, setPhanBo] = useState<INganSachCategory>({
		anUong: 0,
		diChuyen: 0,
		luTru: 0,
		khac: 0,
	});

	const currentLT = danhSach.find((lt) => lt._id === selectedLTId);

	// Calculate actual costs from destinations in this itinerary
	const getActualCosts = (): INganSachCategory => {
		if (!currentLT) return { anUong: 0, diChuyen: 0, luTru: 0, khac: 0 };
		const allIds = currentLT.ngayList.flatMap((n) => n.diemDenIds);
		const uniqueIds = [...new Set(allIds)];
		const destinations: IDiemDen[] = uniqueIds
			.map((id) => diemDenModel.allData.find((d) => d._id === id))
			.filter(Boolean) as IDiemDen[];
		return {
			anUong: destinations.reduce((s, d) => s + d.chiPhiAnUong, 0),
			diChuyen: destinations.reduce((s, d) => s + d.chiPhiDiChuyen, 0),
			luTru: destinations.reduce((s, d) => s + d.chiPhiLuTru, 0),
			khac: 0,
		};
	};

	useEffect(() => {
		if (selectedLTId) {
			const ns = getNganSach(selectedLTId);
			if (ns) {
				setPhanBo(ns.phanBo);
			} else {
				// Auto-populate from destination data
				const actual = getActualCosts();
				setPhanBo(actual);
			}
		}
	}, [selectedLTId]);

	const actual = getActualCosts();
	const totalPhanBo = Object.values(phanBo).reduce((a, b) => a + b, 0);
	const totalActual = Object.values(actual).reduce((a, b) => a + b, 0);

	const handleSave = () => {
		if (!selectedLTId) return;
		const ns: INganSach = {
			_id: Date.now().toString(),
			lichTrinhId: selectedLTId,
			phanBo,
		};
		saveNganSach(ns);
		message.success('Đã lưu phân bổ ngân sách!');
	};

	const tableColumns = [
		{
			title: 'Hạng mục',
			dataIndex: 'cat',
			key: 'cat',
			render: (cat: any) => <strong>{cat.label}</strong>,
		},
		{
			title: 'Ngân sách phân bổ (VNĐ)',
			dataIndex: 'allocated',
			key: 'allocated',
			render: (_: any, row: any) => (
				<InputNumber
					min={0}
					value={(phanBo as any)[row.cat.key]}
					onChange={(val) =>
						setPhanBo((prev) => ({ ...prev, [row.cat.key]: val || 0 }))
					}
					style={{ width: '100%' }}
					formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					parser={(v) => Number(v?.replace(/,/g, '')) as any}
				/>
			),
		},
		{
			title: 'Chi phí thực tế (từ điểm đến)',
			dataIndex: 'actual',
			key: 'actual',
			render: (_: any, row: any) => formatPrice((actual as any)[row.cat.key] || 0),
		},
		{
			title: 'Chênh lệch',
			key: 'diff',
			render: (_: any, row: any) => {
				const diff = (phanBo as any)[row.cat.key] - ((actual as any)[row.cat.key] || 0);
				return (
					<span style={{ color: diff < 0 ? '#ff4d4f' : '#52c41a', fontWeight: 600 }}>
						{diff >= 0 ? '+' : ''}{formatPrice(diff)}
					</span>
				);
			},
		},
	];

	const tableData = CATEGORIES.map((cat) => ({ cat, key: cat.key }));

	return (
		<div>
			<Title level={3}>💰 Quản lý Ngân Sách</Title>

			<Row gutter={16} style={{ marginBottom: 20 }}>
				<Col xs={24} sm={12}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						<Text strong>Chọn lịch trình:</Text>
						<Select
							placeholder="-- Chọn lịch trình --"
							value={selectedLTId || undefined}
							onChange={setSelectedLTId}
							style={{ flex: 1 }}
							showSearch
							optionFilterProp="children"
						>
							{danhSach.map((lt) => (
								<Option key={lt._id} value={lt._id}>
									{lt.tieuDe}
								</Option>
							))}
						</Select>
					</div>
				</Col>
			</Row>

			{!currentLT ? (
				<Empty description="Vui lòng chọn một lịch trình để quản lý ngân sách" />
			) : (
				<Row gutter={24}>
					<Col xs={24} lg={12}>
						<Card title="📊 Biểu đồ phân bổ ngân sách">
							<BudgetChart data={phanBo} nganSachTong={currentLT.nganSachTong} />
						</Card>
					</Col>
					<Col xs={24} lg={12}>
						<Card
							title="📋 Chi tiết ngân sách"
							extra={
								<Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
									Lưu
								</Button>
							}
						>
							{totalPhanBo > currentLT.nganSachTong && (
								<Alert
									type="error"
									showIcon
									message="Vượt tổng ngân sách!"
									description={`Tổng phân bổ ${formatPrice(totalPhanBo)} vượt ngân sách ${formatPrice(currentLT.nganSachTong)}`}
									style={{ marginBottom: 12 }}
								/>
							)}
							{totalActual > currentLT.nganSachTong && (
								<Alert
									type="warning"
									showIcon
									message="Chi phí thực tế vượt ngân sách!"
									description={`Tổng chi phí từ các điểm đến ${formatPrice(totalActual)} vượt ngân sách ${formatPrice(currentLT.nganSachTong)}`}
									style={{ marginBottom: 12 }}
								/>
							)}
							<Table
								dataSource={tableData}
								columns={tableColumns}
								pagination={false}
								className={styles.budgetTable}
								summary={() => (
									<Table.Summary.Row>
										<Table.Summary.Cell index={0}>
											<strong>Tổng cộng</strong>
										</Table.Summary.Cell>
										<Table.Summary.Cell index={1}>
											<strong style={{ color: totalPhanBo > currentLT.nganSachTong ? '#ff4d4f' : '#1890ff' }}>
												{formatPrice(totalPhanBo)}
											</strong>
										</Table.Summary.Cell>
										<Table.Summary.Cell index={2}>
											<strong style={{ color: totalActual > currentLT.nganSachTong ? '#ff4d4f' : '#52c41a' }}>
												{formatPrice(totalActual)}
											</strong>
										</Table.Summary.Cell>
										<Table.Summary.Cell index={3}>
											<strong>
												Ngân sách: {formatPrice(currentLT.nganSachTong)}
											</strong>
										</Table.Summary.Cell>
									</Table.Summary.Row>
								)}
							/>
						</Card>
					</Col>
				</Row>
			)}
		</div>
	);
};

export default NganSach;
