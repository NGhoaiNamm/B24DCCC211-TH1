import { Effect, Reducer } from 'umi';
import { message } from 'antd';

const getKey = () => {
	if (typeof window !== 'undefined') return JSON.parse(localStorage.getItem('bookingReview') || '[]');
	return [];
};

export interface BookingReviewType {
	namespace: 'bookingReview';
	state: { list: any[] };
	effects: { add: Effect; reply: Effect };
	reducers: { saveList: Reducer };
}

const Model: BookingReviewType = {
	namespace: 'bookingReview',
	state: { list: getKey() },
	effects: {
		*add({ payload }, { put, select }) {
			const list = yield select((state: any) => state.bookingReview.list);
			yield put({
				type: 'saveList',
				payload: [...list, { ...payload, id: Date.now().toString(), reply: '' }],
			});
			yield put({
				type: 'bookingAppointment/updateStatus',
				payload: { id: payload.appointmentId, isReviewed: true },
			});
			message.success('Gửi đánh giá thành công!');
		},
		*reply({ payload }, { put, select }) {
			const list = yield select((state: any) => state.bookingReview.list);
			yield put({
				type: 'saveList',
				payload: list.map((item: any) => (item.id === payload.id ? { ...item, reply: payload.reply } : item)),
			});
			message.success('Phản hồi thành công!');
		},
	},
	reducers: {
		saveList(state, action) {
			if (typeof window !== 'undefined') localStorage.setItem('bookingReview', JSON.stringify(action.payload || []));
			return { ...state, list: action.payload || [] };
		},
	},
};
export default Model;
