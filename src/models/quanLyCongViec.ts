import { Effect, Reducer } from 'umi';

export interface CongViecNhom {
	id: string;
	tenCongViec: string;
	nguoiDuocGiao: string;
	mucDoUuTien: 'Low' | 'Medium' | 'High';
	thoiHan: string; // ISO string date
	trangThai: 'Todo' | 'Doing' | 'Done';
}

export interface QuanLyCongViecState {
	currentUser: string | null;
	danhSach: CongViecNhom[];
}

export interface QuanLyCongViecModelType {
	namespace: 'quanLyCongViec';
	state: QuanLyCongViecState;
	reducers: {
		setLogin: Reducer<QuanLyCongViecState>;
		setLogout: Reducer<QuanLyCongViecState>;
		taiDuLieuTasks: Reducer<QuanLyCongViecState>;
		themCongViec: Reducer<QuanLyCongViecState>;
		capNhatCongViec: Reducer<QuanLyCongViecState>;
		xoaCongViec: Reducer<QuanLyCongViecState>;
	};
	effects: {
		khoiTao: Effect;
	};
}

const luuLocalStorageTasks = (data: CongViecNhom[]) => {
	localStorage.setItem('quanlycongviec_tasks', JSON.stringify(data));
};

const QuanLyCongViecModel: QuanLyCongViecModelType = {
	namespace: 'quanLyCongViec',
	state: {
		currentUser: null,
		danhSach: [],
	},

	effects: {
		*khoiTao(_, { put }) {
			const currentUser = localStorage.getItem('quanlycongviec_user');
			if (currentUser) {
				yield put({
					type: 'setLogin',
					payload: currentUser,
				});
			}

			const tasksData = localStorage.getItem('quanlycongviec_tasks');
			if (tasksData) {
				try {
					yield put({
						type: 'taiDuLieuTasks',
						payload: JSON.parse(tasksData),
					});
				} catch (e) {
					console.error('Lỗi parse dữ liệu công việc:', e);
				}
			}
		},
	},

	reducers: {
		setLogin(state, { payload }) {
			localStorage.setItem('quanlycongviec_user', payload);
			return { currentUser: payload, danhSach: state?.danhSach || [] };
		},
		setLogout(state) {
			localStorage.removeItem('quanlycongviec_user');
			return { currentUser: null, danhSach: state?.danhSach || [] };
		},
		taiDuLieuTasks(state, { payload }) {
			return { currentUser: state?.currentUser || null, danhSach: payload };
		},
		themCongViec(state, { payload }) {
			const danhSachMoi = [...(state?.danhSach || []), payload];
			luuLocalStorageTasks(danhSachMoi);
			return { currentUser: state?.currentUser || null, danhSach: danhSachMoi };
		},
		capNhatCongViec(state, { payload }) {
			const danhSachMoi = (state?.danhSach || []).map((item) =>
				item.id === payload.id ? { ...item, ...payload } : item,
			);
			luuLocalStorageTasks(danhSachMoi);
			return { currentUser: state?.currentUser || null, danhSach: danhSachMoi };
		},
		xoaCongViec(state, { payload }) {
			const danhSachMoi = (state?.danhSach || []).filter((item) => item.id !== payload);
			luuLocalStorageTasks(danhSachMoi);
			return { currentUser: state?.currentUser || null, danhSach: danhSachMoi };
		},
	},
};

export default QuanLyCongViecModel;
