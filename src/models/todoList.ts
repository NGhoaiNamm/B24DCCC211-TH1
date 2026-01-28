import { Reducer, Effect } from 'umi';

// 1. Export Interface để các file khác dùng lại (QUAN TRỌNG)
export interface CongViec {
	id: number;
	noiDung: string;
	hoanThanh: boolean;
}

export interface TodoListState {
	danhSach: CongViec[];
}

export interface TodoListModelType {
	namespace: 'todoList';
	state: TodoListState;
	reducers: {
		taiDuLieu: Reducer<TodoListState>;
		themCongViec: Reducer<TodoListState>;
		xoaCongViec: Reducer<TodoListState>;
		capNhatCongViec: Reducer<TodoListState>;
	};
	effects: {
		khoiTao: Effect;
	};
}

const luuLocalStorage = (data: CongViec[]) => {
	localStorage.setItem('todo_data', JSON.stringify(data));
};

const TodoListModel: TodoListModelType = {
	namespace: 'todoList',
	state: {
		danhSach: [],
	},
	effects: {
		*khoiTao(_, { put }) {
			const data = localStorage.getItem('todo_data');
			if (data) {
				try {
					yield put({
						type: 'taiDuLieu',
						payload: JSON.parse(data),
					});
				} catch (e) {
					console.error('Lỗi parse dữ liệu cũ:', e);
				}
			}
		},
	},
	reducers: {
		taiDuLieu(state, { payload }) {
			return { ...state, danhSach: payload };
		},
		themCongViec(state, { payload }) {
			// Xử lý an toàn nếu danhSach bị undefined
			const danhSachCu = state?.danhSach || [];
			const danhSachMoi = [...danhSachCu, { id: Date.now(), noiDung: payload, hoanThanh: false }];
			luuLocalStorage(danhSachMoi);
			return { ...state, danhSach: danhSachMoi };
		},
		xoaCongViec(state, { payload }) {
			const danhSachCu = state?.danhSach || [];
			const danhSachMoi = danhSachCu.filter((item) => item.id !== payload);
			luuLocalStorage(danhSachMoi);
			return { ...state, danhSach: danhSachMoi };
		},
		capNhatCongViec(state, { payload }) {
			const danhSachCu = state?.danhSach || [];
			const danhSachMoi = danhSachCu.map((item) => (item.id === payload.id ? { ...item, ...payload } : item));
			luuLocalStorage(danhSachMoi);
			return { ...state, danhSach: danhSachMoi };
		},
	},
};

export default TodoListModel;
