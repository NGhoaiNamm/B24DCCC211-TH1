import React, { useState } from 'react';
import { Modal, Input, Row, Col, Empty, Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { IDiemDen } from '@/pages/DuLich/typing';
import DestinationCard from '../DestinationCard';
import styles from '../../du-lich.less';

interface Props {
	visible: boolean;
	onCancel: () => void;
	onSelect: (ids: string[]) => void;
	excludeIds?: string[];
	multiple?: boolean;
}

const DestinationSelector: React.FC<Props> = ({
	visible,
	onCancel,
	onSelect,
	excludeIds = [],
	multiple = true,
}) => {
	const { allData } = useModel('diemDen');
	const [search, setSearch] = useState('');
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [filterLoai, setFilterLoai] = useState<string>('');

	const filtered = allData.filter((d) => {
		const matchSearch = d.ten.toLowerCase().includes(search.toLowerCase());
		const matchLoai = filterLoai ? d.loai === filterLoai : true;
		const notExcluded = !excludeIds.includes(d._id);
		return matchSearch && matchLoai && notExcluded;
	});

	const handleToggle = (id: string) => {
		if (multiple) {
			setSelectedIds((prev) =>
				prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
			);
		} else {
			setSelectedIds([id]);
		}
	};

	const handleOk = () => {
		onSelect(selectedIds);
		setSelectedIds([]);
		setSearch('');
	};

	const loaiOptions = [
		{ value: '', label: 'Tất cả' },
		{ value: 'bien', label: 'Biển' },
		{ value: 'nui', label: 'Núi' },
		{ value: 'thanhPho', label: 'Thành phố' },
	];

	return (
		<Modal
			title="Chọn điểm đến"
			visible={visible}
			onCancel={() => { setSelectedIds([]); onCancel(); }}
			onOk={handleOk}
			okText={`Thêm${selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}`}
			cancelText="Huỷ"
			width={900}
			bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
			okButtonProps={{ disabled: selectedIds.length === 0 }}
		>
			<div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
				<Input
					prefix={<SearchOutlined />}
					placeholder="Tìm kiếm điểm đến..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					style={{ flex: 1, minWidth: 200 }}
					allowClear
				/>
				<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
					{loaiOptions.map((o) => (
						<span
							key={o.value}
							onClick={() => setFilterLoai(o.value)}
							className={`${styles.filterTag} ${filterLoai === o.value ? styles.filterTagActive : ''}`}
						>
							{o.label}
						</span>
					))}
				</div>
			</div>
			{filtered.length === 0 ? (
				<Empty description="Không tìm thấy điểm đến" />
			) : (
				<Row gutter={[16, 16]}>
					{filtered.map((d) => (
						<Col xs={24} sm={12} md={8} key={d._id}>
							<div
								className={`${styles.selectorCard} ${selectedIds.includes(d._id) ? styles.selectorCardSelected : ''}`}
								onClick={() => handleToggle(d._id)}
							>
								{multiple && (
									<Checkbox
										checked={selectedIds.includes(d._id)}
										className={styles.selectorCheckbox}
									/>
								)}
								<DestinationCard diemDen={d} />
							</div>
						</Col>
					))}
				</Row>
			)}
		</Modal>
	);
};

export default DestinationSelector;
