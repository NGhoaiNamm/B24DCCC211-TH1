import React from 'react';
import { Card, Rate, Tag, Tooltip } from 'antd';
import {
	EnvironmentOutlined,
	ClockCircleOutlined,
	DollarOutlined,
	PlusCircleOutlined,
} from '@ant-design/icons';
import type { IDiemDen } from '@/pages/DuLich/typing';
import styles from '../../du-lich.less';

const { Meta } = Card;

const LOAI_LABEL: Record<string, { label: string; color: string }> = {
	bien: { label: 'Biển', color: 'blue' },
	nui: { label: 'Núi', color: 'green' },
	thanhPho: { label: 'Thành Phố', color: 'orange' },
};

interface Props {
	diemDen: IDiemDen;
	onSelect?: () => void;
	showSelectButton?: boolean;
}

const formatPrice = (price: number) =>
	new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const DestinationCard: React.FC<Props> = ({ diemDen, onSelect, showSelectButton }) => {
	const loaiInfo = LOAI_LABEL[diemDen.loai] || { label: diemDen.loai, color: 'default' };
	const totalCost = diemDen.chiPhiAnUong + diemDen.chiPhiLuTru + diemDen.chiPhiDiChuyen;

	return (
		<Card
			hoverable
			className={styles.destinationCard}
			cover={
				<div className={styles.cardImgWrapper}>
					<img
						alt={diemDen.ten}
						src={diemDen.hinhAnh}
						className={styles.cardImg}
						onError={(e: any) => {
							e.target.src =
								'https://via.placeholder.com/400x220?text=No+Image';
						}}
					/>
					<Tag color={loaiInfo.color} className={styles.cardBadge}>
						{loaiInfo.label}
					</Tag>
					{showSelectButton && (
						<div className={styles.cardSelectOverlay} onClick={onSelect}>
							<PlusCircleOutlined style={{ fontSize: 36, color: '#fff' }} />
							<div style={{ color: '#fff', marginTop: 4, fontWeight: 600 }}>
								Thêm vào lịch trình
							</div>
						</div>
					)}
				</div>
			}
			actions={[
				<Tooltip title="Thời gian tham quan">
					<ClockCircleOutlined key="time" />{' '}
					<span style={{ fontSize: 12 }}>{diemDen.thoiGianThamQuan}h</span>
				</Tooltip>,
				<Tooltip title="Chi phí ước tính">
					<DollarOutlined key="cost" />{' '}
					<span style={{ fontSize: 12 }}>{formatPrice(totalCost)}</span>
				</Tooltip>,
			]}
		>
			<Meta
				title={
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<span className={styles.cardTitle}>{diemDen.ten}</span>
					</div>
				}
				description={
					<div>
						{diemDen.diaChi && (
							<div className={styles.cardAddress}>
								<EnvironmentOutlined /> {diemDen.diaChi}
							</div>
						)}
						<Rate
							disabled
							allowHalf
							defaultValue={diemDen.rating}
							style={{ fontSize: 14, marginTop: 4 }}
						/>
					</div>
				}
			/>
		</Card>
	);
};

export default DestinationCard;
