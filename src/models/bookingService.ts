import { Effect, Reducer } from 'umi';

const getKey = () => {
	if (typeof window !== 'undefined') return JSON.parse(localStorage.getItem('bookingService') || '[]');
	return [];
};

export interface BookingServiceType {
	namespace: 'bookingService';
	state: { list: any[] };
	effects: { add: Effect; update: Effect; remove: Effect };
	reducers: { saveList: Reducer };
}

const Model: BookingServiceType = {
	namespace: 'bookingService',
	state: { list: getKey() },
	effects: {
		*add({ payload }, { put, select }) {
			const list = yield select((state: any) => state.bookingService.list);
			yield put({ type: 'saveList', payload: [...list, { ...payload, id: Date.now().toString() }] });
		},
		*update({ payload }, { put, select }) {
			const list = yield select((state: any) => state.bookingService.list);
			yield put({ type: 'saveList', payload: list.map((item: any) => (item.id === payload.id ? payload : item)) });
		},
		*remove({ payload }, { put, select }) {
			const list = yield select((state: any) => state.bookingService.list);
			yield put({ type: 'saveList', payload: list.filter((item: any) => item.id !== payload) });
		},
	},
	reducers: {
		saveList(state, action) {
			if (typeof window !== 'undefined') localStorage.setItem('bookingService', JSON.stringify(action.payload || []));
			return { ...state, list: action.payload || [] };
		},
	},
};
export default Model;
