import React, { useState } from 'react';
import {
	Row,
	Col, //chia layout/
	Typography,
	Radio,
	Slider,
	Select,
	Input,
	Rate,
	Spin,
	Empty,
	Divider,
	Badge,
} from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import DestinationCard from '../components/DestinationCard';
import styles from '../du-lich.less';

const { Title, Text } = Typography;
const { Option } = Select;

const LOAI_OPTIONS = [
	{ value: '', label: '🗺 Tất cả' },
	{ value: 'bien', label: '🏖 Biển' },
	{ value: 'nui', label: '⛰ Núi' },
	{ value: 'thanhPho', label: '🏙 Thành phố' },
];

const SORT_OPTIONS = [
	{ value: '', label: 'Mặc định' },
	{ value: 'rating_desc', label: 'Đánh giá cao nhất' },
	{ value: 'price_asc', label: 'Giá thấp nhất' },
	{ value: 'price_desc', label: 'Giá cao nhất' },
	{ value: 'ten_asc', label: 'Tên A → Z' },
];

const KhamPha: React.FC = () => {
	const { allData, loading } = useModel('diemDen');
	const [search, setSearch] = useState('');
	const [filterLoai, setFilterLoai] = useState('');
	const [filterRating, setFilterRating] = useState(0);
	const [filterPriceMax, setFilterPriceMax] = useState(5000000);
	const [sort, setSort] = useState('');

	const filtered = allData
		.filter((d) => {
			const matchSearch = d.ten.toLowerCase().includes(search.toLowerCase());
			const matchLoai = filterLoai ? d.loai === filterLoai : true;
			const matchRating = filterRating > 0 ? d.rating >= filterRating : true;
			const totalPrice = d.chiPhiAnUong + d.chiPhiLuTru + d.chiPhiDiChuyen;
			const matchPrice = totalPrice <= filterPriceMax;
			return matchSearch && matchLoai && matchRating && matchPrice;
		})
		.sort((a, b) => {
			if (sort === 'rating_desc') return b.rating - a.rating;
			const pa = a.chiPhiAnUong + a.chiPhiLuTru + a.chiPhiDiChuyen;
			const pb = b.chiPhiAnUong + b.chiPhiLuTru + b.chiPhiDiChuyen;
			if (sort === 'price_asc') return pa - pb;
			if (sort === 'price_desc') return pb - pa;
			if (sort === 'ten_asc') return a.ten.localeCompare(b.ten);
			return 0;
		});

	return (
		<div style={{ padding: '0 0 24px' }}>
			{/* Hero */}
			<div
				style={{
					background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
					borderRadius: 16,
					padding: '40px 32px',
					marginBottom: 24,
					color: '#fff',
				}}
			>
				<Title level={2} style={{ color: '#fff', margin: 0 }}>
					🌏 Khám Phá Điểm Đến
				</Title>
				<Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16 }}>
					Tìm kiếm và lên kế hoạch cho chuyến đi mơ ước của bạn
				</Text>
				<div style={{ marginTop: 20, maxWidth: 480 }}>
					<Input
						prefix={<SearchOutlined style={{ color: 'rgba(255,255,255,0.6)' }} />}
						placeholder="Tìm kiếm địa điểm..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						allowClear
						size="large"
						style={{
							borderRadius: 30,
							background: 'rgba(255,255,255,0.15)',
							border: '1px solid rgba(255,255,255,0.3)',
							color: '#fff',
						}}
					/>
				</div>
			</div>

			{/* Filter bar */}
			<div className={styles.filterBar}>
				<FilterOutlined style={{ color: '#1890ff' }} />
				<strong style={{ marginRight: 4 }}>Lọc:</strong>
				{LOAI_OPTIONS.map((o) => (
					<span
						key={o.value}
						onClick={() => setFilterLoai(o.value)}
						className={`${styles.filterTag} ${filterLoai === o.value ? styles.filterTagActive : ''}`}
					>
						{o.label}
					</span>
				))}
				<Divider type="vertical" />
				<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<Text type="secondary">Đánh giá tối thiểu:</Text>
					<Rate
						allowHalf
						value={filterRating}
						onChange={setFilterRating}
						style={{ fontSize: 16 }}
					/>
					{filterRating > 0 && (
						<span
							onClick={() => setFilterRating(0)}
							style={{ color: '#1890ff', cursor: 'pointer', fontSize: 12 }}
						>
							✕ Xoá
						</span>
					)}
				</span>
				<Divider type="vertical" />
				<span style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 220 }}>
					<Text type="secondary" style={{ whiteSpace: 'nowrap' }}>Giá tối đa:</Text>
					<Slider
						min={500000}
						max={5000000}
						step={100000}
						value={filterPriceMax}
						onChange={setFilterPriceMax}
						style={{ flex: 1 }}
						tipFormatter={(v) =>
							new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v!)
						}
					/>
				</span>
				<Divider type="vertical" />
				<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<Text type="secondary">Sắp xếp:</Text>
					<Select value={sort} onChange={setSort} style={{ minWidth: 160 }}>
						{SORT_OPTIONS.map((o) => (
							<Option key={o.value} value={o.value}>
								{o.label}
							</Option>
						))}
					</Select>
				</span>
			</div>

			{/* Result count */}
			<div style={{ marginBottom: 16 }}>
				<Badge count={filtered.length} overflowCount={999} style={{ backgroundColor: '#1890ff' }}>
					<Text strong style={{ marginRight: 8 }}>Kết quả</Text>
				</Badge>
				<Text type="secondary"> điểm đến phù hợp</Text>
			</div>

			{/* Cards grid */}
			<Spin spinning={loading}>
				{filtered.length === 0 ? (
					<Empty description="Không tìm thấy điểm đến phù hợp" style={{ margin: '60px 0' }} />
				) : (
					<Row gutter={[20, 20]}>
						{filtered.map((d) => (
							<Col xs={24} sm={12} md={8} lg={6} key={d._id}>
								<DestinationCard diemDen={d} />
							</Col>
						))}
					</Row>
				)}
			</Spin>
		</div>
	);
};

export default KhamPha;
