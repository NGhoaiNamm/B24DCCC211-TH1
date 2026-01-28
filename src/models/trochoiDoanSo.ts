import { Reducer } from 'umi';

// Định nghĩa kiểu dữ liệu cho State
export interface TroChoiState {
	soBiMat: number;
	soLanDaDoan: number;
	thongBao: string;
	daKetThuc: boolean;
	lichSuDoan: number[];
}

export interface TroChoiModelType {
	namespace: 'trochoiDoanSo';
	state: TroChoiState;
	reducers: {
		khoiTaoLai: Reducer<TroChoiState>;
		kiemTraSo: Reducer<TroChoiState>;
	};
}

const TroChoiModel: TroChoiModelType = {
	namespace: 'trochoiDoanSo',
	state: {
		soBiMat: 0,
		soLanDaDoan: 0,
		thongBao: '',
		daKetThuc: false,
		lichSuDoan: [],
	},
	reducers: {
		khoiTaoLai(state) {
			return {
				...state,
				soBiMat: Math.floor(Math.random() * 100) + 1,
				soLanDaDoan: 0,
				thongBao: 'Hệ thống đã sinh số mới (1-100). Mời bạn đoán!',
				daKetThuc: false,
				lichSuDoan: [],
			};
		},
		kiemTraSo(state, { payload }) {
			const soNguoiChoi = payload;
			const { soBiMat, soLanDaDoan, lichSuDoan } = state!;

			const lanDoanMoi = soLanDaDoan + 1;
			let thongBaoMoi = '';
			let ketThuc = false;

			if (soNguoiChoi === soBiMat) {
				thongBaoMoi = `Chúc mừng! Bạn đã đoán đúng số ${soBiMat}.`;
				ketThuc = true;
			} else if (lanDoanMoi >= 10) {
				thongBaoMoi = `Bạn đã hết lượt! Số đúng là ${soBiMat}.`;
				ketThuc = true;
			} else if (soNguoiChoi < soBiMat) {
				thongBaoMoi = 'Bạn đoán quá thấp!';
			} else {
				thongBaoMoi = 'Bạn đoán quá cao!';
			}

			return {
				...state,
				soLanDaDoan: lanDoanMoi,
				thongBao: thongBaoMoi,
				daKetThuc: ketThuc,
				lichSuDoan: [...lichSuDoan, soNguoiChoi],
			};
		},
	},
};

export default TroChoiModel;
