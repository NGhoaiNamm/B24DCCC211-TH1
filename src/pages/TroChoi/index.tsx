import React from 'react';
import { connect, ConnectProps, Dispatch } from 'umi';
import { TroChoiState } from '@/models/troChoiDoanSo';
import DoanSoForm from './components/DoanSoForm';

// Định nghĩa Props cho Page
interface PageProps extends ConnectProps {
	dispatch: Dispatch;
	trochoiDoanSo: TroChoiState;
}

const TroChoiDoanSoPage: React.FC<PageProps> = (props) => {
	const { dispatch, trochoiDoanSo } = props;

	return (
		<div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
			<DoanSoForm dispatch={dispatch} trochoiDoanSo={trochoiDoanSo} />
		</div>
	);
};

// Kết nối data từ Model vào Props của Page
export default connect(({ trochoiDoanSo }: { trochoiDoanSo: TroChoiState }) => ({
	trochoiDoanSo,
}))(TroChoiDoanSoPage);
