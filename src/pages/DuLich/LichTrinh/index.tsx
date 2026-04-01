import React, { useState, useEffect } from 'react';
import {
	Row,
	Col,
	Typography,
	Button,
	Table,
	Modal,
	Form,
	Input,
	DatePicker,
	InputNumber,
	Popconfirm,
	Tag,
	Card,
	Tooltip,
	message,
	Divider,
	Empty,
	Space,
} from 'antd';
import {
	PlusOutlined,
	DeleteOutlined,
	EditOutlined,
	CalendarOutlined,
	DragOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { IDiemDen, ILichTrinh } from '@/pages/DuLich/typing';
import DestinationSelector from '../components/DestinationSelector';
import styles from '../du-lich.less';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const formatPrice = (price: number) =>
	new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const LichTrinh: React.FC = () => {
	const lichTrinhModel = useModel('lichTrinh');
	const diemDenModel = useModel('diemDen');
	const {
		danhSach,
		loading,
		selectedId,
		setSelectedId,
		addModel,
		updateModel,
		deleteModel,
		addDiemDenToNgay,
		removeDiemDenFromNgay,
		reorderDiemDen,
		getById,
		searchText,
		setSearchText,
	} = lichTrinhModel;

	const [form] = Form.useForm();
	const [visibleForm, setVisibleForm] = useState(false);
	const [editRecord, setEditRecord] = useState<Partial<ILichTrinh> | null>(null);
	const [selectorDay, setSelectorDay] = useState<number | null>(null);
	const [currentLT, setCurrentLT] = useState<ILichTrinh | null>(null);

	useEffect(() => {
		if (selectedId) {
			const lt = getById(selectedId);
			setCurrentLT(lt || null);
		} else {
			setCurrentLT(null);
		}
	}, [selectedId, danhSach]);

	const getDayCount = (lt: ILichTrinh) => {
		const start = moment(lt.ngayBatDau);
		const end = moment(lt.ngayKetThuc);
		return end.diff(start, 'days') + 1;
	};

	const getDiemDenForDay = (lt: ILichTrinh, ngay: number): IDiemDen[] => {
		const ngayEntry = lt.ngayList.find((n) => n.ngay === ngay);
		if (!ngayEntry) return [];
		return ngayEntry.diemDenIds
			.map((id) => diemDenModel.allData.find((d) => d._id === id))
			.filter(Boolean) as IDiemDen[];
	};

	const calcDayBudget = (diemDens: IDiemDen[]) => {
		return diemDens.reduce(
			(acc, d) => acc + d.chiPhiAnUong + d.chiPhiLuTru + d.chiPhiDiChuyen,
			0,
		);
	};

	const calcTotalBudget = (lt: ILichTrinh) => {
		const dayCount = getDayCount(lt);
		let total = 0;
		for (let i = 1; i <= dayCount; i++) {
			total += calcDayBudget(getDiemDenForDay(lt, i));
		}
		return total;
	};

	const handleAddOrEdit = async () => {
		try {
			const values = await form.validateFields();
			const payload: Partial<ILichTrinh> = {
				tieuDe: values.tieuDe,
				ngayBatDau: values.dates[0].toISOString(),
				ngayKetThuc: values.dates[1].toISOString(),
				nganSachTong: values.nganSachTong,
			};
			if (editRecord && editRecord._id) {
				await updateModel(editRecord._id, payload);
				message.success('Cập nhật lịch trình thành công!');
			} else {
				const newLT = await addModel(payload);
				setSelectedId(newLT._id);
				message.success('Tạo lịch trình mới thành công!');
			}
			setVisibleForm(false);
			form.resetFields();
			setEditRecord(null);
		} catch {}
	};

	const handleEdit = (record: ILichTrinh) => {
		setEditRecord(record);
		form.setFieldsValue({
			tieuDe: record.tieuDe,
			dates: [moment(record.ngayBatDau), moment(record.ngayKetThuc)],
			nganSachTong: record.nganSachTong,
		});
		setVisibleForm(true);
	};

	const handleDragEnd = (result: any, ngay: number) => {
		if (!result.destination || !currentLT) return;
		const ngayEntry = currentLT.ngayList.find((n) => n.ngay === ngay);
		if (!ngayEntry) return;
		const newIds = Array.from(ngayEntry.diemDenIds);
		const [removed] = newIds.splice(result.source.index, 1);
		newIds.splice(result.destination.index, 0, removed);
		reorderDiemDen(currentLT._id, ngay, newIds);
	};

	const columns = [
		{
			title: 'Tên lịch trình',
			dataIndex: 'tieuDe',
			key: 'tieuDe',
			sorter: (a: ILichTrinh, b: ILichTrinh) => a.tieuDe.localeCompare(b.tieuDe),
			render: (text: string, record: ILichTrinh) => (
				<a onClick={() => setSelectedId(record._id)} style={{ fontWeight: 600 }}>
					{text}
				</a>
			),
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }: any) => (
				<div style={{ padding: 8 }}>
					<Input
						placeholder="Tìm kiếm..."
						value={selectedKeys[0]}
						onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
						onPressEnter={confirm}
						style={{ marginBottom: 8, display: 'block' }}
					/>
					<Button type="primary" onClick={confirm} size="small" style={{ marginRight: 8 }}>
						Tìm
					</Button>
					<Button onClick={() => { setSelectedKeys([]); confirm(); }} size="small">
						Xoá
					</Button>
				</div>
			),
		},
		{
			title: 'Ngày đi',
			dataIndex: 'ngayBatDau',
			key: 'ngayBatDau',
			sorter: (a: ILichTrinh, b: ILichTrinh) =>
				new Date(a.ngayBatDau).getTime() - new Date(b.ngayBatDau).getTime(),
			render: (v: string) => moment(v).format('DD/MM/YYYY'),
		},
		{
			title: 'Ngày về',
			dataIndex: 'ngayKetThuc',
			key: 'ngayKetThuc',
			render: (v: string) => moment(v).format('DD/MM/YYYY'),
		},
		{
			title: 'Số ngày',
			key: 'soNgay',
			render: (_: any, record: ILichTrinh) => (
				<Tag color="blue">{getDayCount(record)} ngày</Tag>
			),
		},
		{
			title: 'Ngân sách',
			dataIndex: 'nganSachTong',
			sorter: (a: ILichTrinh, b: ILichTrinh) => a.nganSachTong - b.nganSachTong,
			render: (v: number) => <span style={{ color: '#52c41a', fontWeight: 600 }}>{formatPrice(v)}</span>,
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: ILichTrinh) => (
				<Space>
					<Tooltip title="Chỉnh sửa">
						<Button
							icon={<EditOutlined />}
							size="small"
							onClick={() => handleEdit(record)}
						/>
					</Tooltip>
					<Popconfirm
						title="Xoá lịch trình này?"
						onConfirm={() => {
							deleteModel(record._id);
							if (selectedId === record._id) setSelectedId('');
							message.success('Đã xoá!');
						}}
						okText="Xoá"
						cancelText="Huỷ"
					>
						<Button icon={<DeleteOutlined />} size="small" danger />
					</Popconfirm>
				</Space>
			),
		},
	];

	const dayCount = currentLT ? getDayCount(currentLT) : 0;

	return (
		<div>
			<Row gutter={24}>
				{/* Left: List */}
				<Col xs={24} lg={9}>
					<Card
						title={<><CalendarOutlined /> Danh sách lịch trình</>}
						extra={
							<Button
								type="primary"
								icon={<PlusOutlined />}
								onClick={() => {
									setEditRecord(null);
									form.resetFields();
									setVisibleForm(true);
								}}
							>
								Tạo mới
							</Button>
						}
						bodyStyle={{ padding: '12px 0' }}
					>
						<div style={{ padding: '0 12px 12px' }}>
							<Input
								prefix={<span>🔍</span>}
								placeholder="Tìm lịch trình..."
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								allowClear
							/>
						</div>
						<Table
							dataSource={danhSach}
							columns={columns.filter((c) => ['tieuDe', 'ngayBatDau', 'soNgay', 'action'].includes(c.key as string))}
							rowKey="_id"
							loading={loading}
							size="small"
							pagination={false}
							rowClassName={(record) =>
								record._id === selectedId ? 'ant-table-row-selected' : ''
							}
							onRow={(record) => ({
								onClick: () => setSelectedId(record._id),
								style: { cursor: 'pointer' },
							})}
						/>
					</Card>
				</Col>

				{/* Right: Day planner */}
				<Col xs={24} lg={15}>
					{!currentLT ? (
						<Card>
							<Empty description="Chọn một lịch trình để lên kế hoạch" />
						</Card>
					) : (
						<Card
							title={
								<div>
									<Title level={4} style={{ margin: 0 }}>
										🗺 {currentLT.tieuDe}
									</Title>
									<Text type="secondary">
										{moment(currentLT.ngayBatDau).format('DD/MM/YYYY')} →{' '}
										{moment(currentLT.ngayKetThuc).format('DD/MM/YYYY')} |{' '}
										Ngân sách: {formatPrice(currentLT.nganSachTong)}
									</Text>
								</div>
							}
							extra={
								<Tag color={calcTotalBudget(currentLT) > currentLT.nganSachTong ? 'red' : 'green'}>
									Đã dự tính: {formatPrice(calcTotalBudget(currentLT))}
								</Tag>
							}
						>
							{Array.from({ length: dayCount }, (_, i) => i + 1).map((ngay) => {
								const destinations = getDiemDenForDay(currentLT, ngay);
								const dayBudget = calcDayBudget(destinations);
								const ngayEntry = currentLT.ngayList.find((n) => n.ngay === ngay);
								const orderedIds = ngayEntry?.diemDenIds || [];

								return (
									<Card
										key={ngay}
										className={styles.dayCard}
										size="small"
										title={
											<div className={styles.dayHeader}>
												<span>
													<strong>Ngày {ngay}</strong>{' '}
													<Text type="secondary">
														({moment(currentLT.ngayBatDau).add(ngay - 1, 'days').format('DD/MM')})
													</Text>
												</span>
												<span>
													<Text style={{ color: '#1890ff', fontSize: 12, marginRight: 8 }}>
														💰 {formatPrice(dayBudget)}
													</Text>
													<Button
														icon={<PlusOutlined />}
														size="small"
														onClick={() => setSelectorDay(ngay)}
													>
														Thêm điểm đến
													</Button>
												</span>
											</div>
										}
									>
										{destinations.length === 0 ? (
											<Text type="secondary" style={{ fontSize: 13 }}>
												Chưa có điểm đến. Nhấn "+ Thêm điểm đến" để bổ sung.
											</Text>
										) : (
											<DragDropContext onDragEnd={(r) => handleDragEnd(r, ngay)}>
												<Droppable droppableId={`day-${ngay}`} direction="horizontal">
													{(provided) => (
														<div
															ref={provided.innerRef}
															{...provided.droppableProps}
															style={{ display: 'flex', flexWrap: 'wrap', minHeight: 40 }}
														>
															{orderedIds.map((id, index) => {
																const d = diemDenModel.allData.find((x) => x._id === id);
																if (!d) return null;
																return (
																	<Draggable key={id} draggableId={id} index={index}>
																		{(prov) => (
																			<div
																				ref={prov.innerRef}
																				{...prov.draggableProps}
																				{...prov.dragHandleProps}
																				className={styles.destinationChip}
																			>
																				<img
																					src={d.hinhAnh}
																					className={styles.chipImg}
																					onError={(e: any) =>
																						(e.target.style.display = 'none')
																					}
																				/>
																				<DragOutlined style={{ fontSize: 10, color: '#aaa' }} />
																				{d.ten}
																				<DeleteOutlined
																					style={{ color: '#ff4d4f', cursor: 'pointer' }}
																					onClick={() =>
																						removeDiemDenFromNgay(currentLT._id, ngay, id)
																					}
																				/>
																			</div>
																		)}
																	</Draggable>
																);
															})}
															{provided.placeholder}
														</div>
													)}
												</Droppable>
											</DragDropContext>
										)}
									</Card>
								);
							})}

							<Divider />
							<Row gutter={16}>
								<Col>
									<Text strong>Tổng chi phí ước tính: </Text>
									<Text
										style={{
											color:
												calcTotalBudget(currentLT) > currentLT.nganSachTong
													? '#ff4d4f'
													: '#52c41a',
											fontWeight: 700,
											fontSize: 16,
										}}
									>
										{formatPrice(calcTotalBudget(currentLT))}
									</Text>
								</Col>
								<Col>
									<Text strong>Ngân sách: </Text>
									<Text style={{ fontWeight: 700, fontSize: 16 }}>
										{formatPrice(currentLT.nganSachTong)}
									</Text>
								</Col>
							</Row>
						</Card>
					)}
				</Col>
			</Row>

			{/* Create/Edit Modal */}
			<Modal
				title={editRecord ? 'Chỉnh sửa lịch trình' : 'Tạo lịch trình mới'}
				visible={visibleForm}
				onOk={handleAddOrEdit}
				onCancel={() => { setVisibleForm(false); setEditRecord(null); }}
				okText={editRecord ? 'Cập nhật' : 'Tạo mới'}
				cancelText="Huỷ"
				destroyOnClose
			>
				<Form form={form} layout="vertical">
					<Form.Item name="tieuDe" label="Tên lịch trình" rules={[{ required: true }]}>
						<Input placeholder="VD: Khám phá miền Bắc 5N4Đ" />
					</Form.Item>
					<Form.Item name="dates" label="Ngày đi - Ngày về" rules={[{ required: true }]}>
						<RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
					</Form.Item>
					<Form.Item name="nganSachTong" label="Ngân sách tổng (VNĐ)" rules={[{ required: true }]}>
						<InputNumber
							min={0}
							style={{ width: '100%' }}
							formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(v) => Number(v?.replace(/,/g, '')) as any}
						/>
					</Form.Item>
				</Form>
			</Modal>

			{/* Destination Selector */}
			<DestinationSelector
				visible={selectorDay !== null}
				onCancel={() => setSelectorDay(null)}
				excludeIds={
					currentLT && selectorDay
						? currentLT.ngayList.find((n) => n.ngay === selectorDay)?.diemDenIds || []
						: []
				}
				onSelect={(ids) => {
					if (currentLT && selectorDay !== null) {
						ids.forEach((id) => addDiemDenToNgay(currentLT._id, selectorDay, id));
						message.success(`Đã thêm ${ids.length} điểm đến vào Ngày ${selectorDay}`);
					}
					setSelectorDay(null);
				}}
			/>
		</div>
	);
};

export default LichTrinh;
