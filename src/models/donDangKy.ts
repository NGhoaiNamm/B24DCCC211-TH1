import { useState } from 'react';

export default () => {
	const [danhSach, setDanhSach] = useState<any[]>([]);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(false);
	const [record, setRecord] = useState<any>({});
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [total, setTotal] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [condition, setCondition] = useState<any>({});
	const [filters, setFilters] = useState<any[]>([]);
	const [sort, setSort] = useState<any>({});
	const [selectedIds, setSelectedIds] = useState<any[]>([]);

	const getModel = async () => {
		setLoading(true);
		try {
			const dataStr = localStorage.getItem('donDangKyData');
			let data = dataStr ? JSON.parse(dataStr) : [];
			if (condition && condition.cauLacBoId) {
				data = data.filter((item: any) => item.cauLacBoId === condition.cauLacBoId);
			}
			if (condition && condition.trangThai) {
				data = data.filter((item: any) => item.trangThai === condition.trangThai);
			}
			if (sort) {
				const sortKey = Object.keys(sort)[0];
				if (sortKey) {
					const order = sort[sortKey] === 1 ? 1 : -1;
					data.sort((a: any, b: any) => {
						if (a[sortKey] < b[sortKey]) return -1 * order;
						if (a[sortKey] > b[sortKey]) return 1 * order;
						return 0;
					});
				}
			}
			if (filters && filters.length > 0) {
				filters.forEach((f) => {
					if (f.values && f.values.length > 0) {
						data = data.filter((item: any) => {
							const val = item[f.field]?.toString()?.toLowerCase() || '';
							return f.values.some((v: string) => val.includes(v.toLowerCase()));
						});
					}
				});
			}
			setTotal(data.length);
			const start = (page - 1) * limit;
			setDanhSach(data.slice(start, start + limit));
		} catch (e) {
			setDanhSach([]);
			setTotal(0);
		}
		setLoading(false);
	};

	const addModel = async (payload: any) => {
		const dataStr = localStorage.getItem('donDangKyData');
		const data = dataStr ? JSON.parse(dataStr) : [];
		const newItem = { ...payload, _id: Date.now().toString(), trangThai: 'Pending' };
		data.unshift(newItem);
		localStorage.setItem('donDangKyData', JSON.stringify(data));
		getModel();
	};

	const updateModel = async (id: string, payload: any) => {
		const dataStr = localStorage.getItem('donDangKyData');
		let data = dataStr ? JSON.parse(dataStr) : [];
		const idx = data.findIndex((item: any) => item._id === id);
		if (idx > -1) {
			data[idx] = { ...data[idx], ...payload };
			localStorage.setItem('donDangKyData', JSON.stringify(data));
		}
		getModel();
	};

	const updateManyStatus = async (ids: string[], status: string, reason?: string) => {
		const dataStr = localStorage.getItem('donDangKyData');
		let data = dataStr ? JSON.parse(dataStr) : [];
		const time = new Date().toLocaleString('vi-VN');
		data = data.map((item: any) => {
			if (ids.includes(item._id)) {
				const note = reason
					? `Admin đã ${status} vào lúc ${time} với lý do: ${reason}`
					: `Admin đã ${status} vào lúc ${time}`;
				return { ...item, trangThai: status, ghiChu: note };
			}
			return item;
		});
		localStorage.setItem('donDangKyData', JSON.stringify(data));
		getModel();
	};

	const updateManyClub = async (ids: string[], cauLacBoId: string) => {
		const dataStr = localStorage.getItem('donDangKyData');
		let data = dataStr ? JSON.parse(dataStr) : [];
		data = data.map((item: any) => {
			if (ids.includes(item._id)) {
				return { ...item, cauLacBoId };
			}
			return item;
		});
		localStorage.setItem('donDangKyData', JSON.stringify(data));
		getModel();
	};

	const deleteModel = async (id: string) => {
		const dataStr = localStorage.getItem('donDangKyData');
		let data = dataStr ? JSON.parse(dataStr) : [];
		data = data.filter((item: any) => item._id !== id);
		localStorage.setItem('donDangKyData', JSON.stringify(data));
		getModel();
	};

	return {
		danhSach,
		setDanhSach,
		visibleForm,
		setVisibleForm,
		edit,
		setEdit,
		isView,
		setIsView,
		record,
		setRecord,
		page,
		setPage,
		limit,
		setLimit,
		total,
		setTotal,
		loading,
		setLoading,
		condition,
		setCondition,
		filters,
		setFilters,
		sort,
		setSort,
		selectedIds,
		setSelectedIds,
		getModel,
		addModel,
		updateModel,
		updateManyStatus,
		updateManyClub,
		deleteModel,
	};
};
