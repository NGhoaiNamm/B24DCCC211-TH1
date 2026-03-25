import { Effect, Reducer } from 'umi';
import { message } from 'antd';

const getKey = () => {
	if (typeof window !== 'undefined') return JSON.parse(localStorage.getItem('bookingAppointment') || '[]');
	return [];
};

export interface BookingAppointmentType {
	namespace: 'bookingAppointment';
	state: { list: any[] };
	effects: { add: Effect; updateStatus: Effect };
	reducers: { saveList: Reducer };
}

const Model: BookingAppointmentType = {
	namespace: 'bookingAppointment',
	state: { list: getKey() },
	effects: {
		*add({ payload }, { put, select }) {
			const appointments = yield select((state: any) => state.bookingAppointment.list);
			const employees = yield select((state: any) => state.bookingEmployee.list);

			const targetEmployee = employees.find((e: any) => e.id === payload.employeeId);
			const appsOnDate = appointments.filter(
				(app: any) => app.employeeId === payload.employeeId && app.date === payload.date && app.status !== 'Hủy',
			);

			if (targetEmployee && appsOnDate.length >= targetEmployee.limit) {
				message.error(`Nhân viên đã đạt giới hạn ${targetEmployee.limit} khách trong ngày!`);
				return;
			}

			if (appsOnDate.some((app: any) => app.time === payload.time)) {
				message.error('Nhân viên đã có lịch trùng vào giờ này!');
				return;
			}

			yield put({
				type: 'saveList',
				payload: [...appointments, { ...payload, id: Date.now().toString(), status: 'Chờ duyệt', isReviewed: false }],
			});
			message.success('Đặt lịch thành công!');
		},
		*updateStatus({ payload }, { put, select }) {
			const list = yield select((state: any) => state.bookingAppointment.list);
			yield put({
				type: 'saveList',
				payload: list.map((item: any) => (item.id === payload.id ? { ...item, ...payload } : item)),
			});
		},
	},
	reducers: {
		saveList(state, action) {
			if (typeof window !== 'undefined')
				localStorage.setItem('bookingAppointment', JSON.stringify(action.payload || []));
			return { ...state, list: action.payload || [] };
		},
	},
};
export default Model;
