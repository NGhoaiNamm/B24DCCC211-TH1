import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Alert, Statistic, Row, Col, Tag, Typography } from 'antd';
import { Dispatch } from 'umi';
import { TroChoiState } from '@/models/troChoiDoanSo'; // Import interface từ model

const { Text } = Typography;

interface Props {
	dispatch: Dispatch;
	trochoiDoanSo: TroChoiState;
}

const DoanSoForm: React.FC<Props> = ({ dispatch, trochoiDoanSo }) => {
	// Lấy dữ liệu từ props
	const { thongBao, soLanDaDoan, daKetThuc, lichSuDoan } = trochoiDoanSo;
	const [soNhap, setSoNhap] = useState<string>('');

	// Khởi tạo game khi component được mount
	useEffect(() => {
		dispatch({ type: 'trochoiDoanSo/khoiTaoLai' });
	}, [dispatch]);

	const xuLyDoan = () => {
		const giaTri = parseInt(soNhap);
		if (isNaN(giaTri) || giaTri < 1 || giaTri > 100) {
			alert('Vui lòng nhập số hợp lệ từ 1 đến 100!');
			return;
		}

		dispatch({
			type: 'trochoiDoanSo/kiemTraSo',
			payload: giaTri,
		});
		setSoNhap('');
	};

	const choiLai = () => {
		dispatch({ type: 'trochoiDoanSo/khoiTaoLai' });
		setSoNhap('');
	};

	// Xác định màu sắc Alert
	const alertType = daKetThuc ? (thongBao.includes('đúng') ? 'success' : 'error') : 'info';

	return (
		<Card
			title={
				<Text strong style={{ fontSize: 18 }}>
					Bài 1: Trò Chơi Đoán Số
				</Text>
			}
			style={{ maxWidth: 600, margin: '0 auto', marginTop: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
		>
			<Alert message={thongBao} type={alertType} showIcon style={{ marginBottom: 20 }} />

			<Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
				<Col span={12}>
					<Statistic
						title='Lượt đã đoán'
						value={soLanDaDoan}
						suffix='/ 10'
						valueStyle={{ color: soLanDaDoan > 8 ? '#cf1322' : '#3f8600' }}
					/>
				</Col>
				<Col span={12} style={{ textAlign: 'right' }}>
					<Text strong>Lịch sử:</Text>
					<div style={{ marginTop: 8 }}>
						{lichSuDoan.map((so, index) => (
							<Tag key={index} color='blue' style={{ marginBottom: 4 }}>
								{so}
							</Tag>
						))}
					</div>
				</Col>
			</Row>

			<div style={{ display: 'flex', gap: 10 }}>
				<Input
					placeholder='Nhập số (1-100)'
					value={soNhap}
					onChange={(e) => setSoNhap(e.target.value)}
					onPressEnter={!daKetThuc ? xuLyDoan : undefined}
					disabled={daKetThuc}
					type='number'
					size='large'
				/>
				{!daKetThuc ? (
					<Button type='primary' onClick={xuLyDoan} size='large' disabled={!soNhap}>
						Đoán
					</Button>
				) : (
					<Button type='primary' danger onClick={choiLai} size='large'>
						Chơi lại
					</Button>
				)}
			</div>
		</Card>
	);
};

export default DoanSoForm;
