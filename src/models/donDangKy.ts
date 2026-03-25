import { useState, useEffect } from 'react';
import type { IDonDangKy, ILichSuThaoTac } from '@/pages/CauLacBo/typing';

export default () => {
	const [danhSach, setDanhSach] = useState<IDonDangKy[]>([]);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(false);
	const [record, setRecord] = useState<Partial<IDonDangKy>>({});
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [total, setTotal] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [condition, setCondition] = useState<any>({});
	const [filters, setFilters] = useState<any[]>([]);
	const [sort, setSort] = useState<any>({});
	const [selectedIds, setSelectedIds] = useState<any[]>([]);
	const [version, setVersion] = useState<number>(0);

	const getModel = async () => {
		setLoading(true);
		try {
			const dataStr = localStorage.getItem('donDangKyData');
			let data: IDonDangKy[] = dataStr ? JSON.parse(dataStr) : [];

			if (condition?.cauLacBoId) {
				data = data.filter((item) => item.cauLacBoId === condition.cauLacBoId);
			}
			if (condition?.trangThai) {
				data = data.filter((item) => item.trangThai === condition.trangThai);
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

			setTotal(data.length);
			const start = (page - 1) * limit;
			setDanhSach(data.slice(start, start + limit));
		} catch (e) {
			setDanhSach([]);
			setTotal(0);
		}
		setLoading(false);
	};

	useEffect(() => {
		getModel();
	}, [page, limit, version, JSON.stringify(condition || {}), JSON.stringify(filters || []), JSON.stringify(sort || {})]);

	const addModel = async (payload: Partial<IDonDangKy>) => {
		const dataStr = localStorage.getItem('donDangKyData');
		const data = dataStr ? JSON.parse(dataStr) : [];
		const newItem: IDonDangKy = {
			...payload,
			_id: Date.now().toString(),
			trangThai: (payload.trangThai as any) || 'Pending',
			lichSuThaoTac: [],
		} as IDonDangKy;
		data.unshift(newItem);
		localStorage.setItem('donDangKyData', JSON.stringify(data));
		setVersion((v) => v + 1);
	};

	const updateModel = async (id: string, payload: Partial<IDonDangKy>) => {
		const dataStr = localStorage.getItem('donDangKyData');
		let data = dataStr ? JSON.parse(dataStr) : [];
		const idx = data.findIndex((item: any) => item._id === id);
		if (idx > -1) {
			data[idx] = { ...data[idx], ...payload };
			localStorage.setItem('donDangKyData', JSON.stringify(data));
		}
		setVersion((v) => v + 1);
	};

	const updateManyStatus = async (ids: string[], status: 'Approved' | 'Rejected', reason?: string) => {
		const dataStr = localStorage.getItem('donDangKyData');
		let data: IDonDangKy[] = dataStr ? JSON.parse(dataStr) : [];
		const time = new Date().toLocaleString('vi-VN');
		data = data.map((item) => {
			if (ids.includes(item._id)) {
				const lichSuEntry: ILichSuThaoTac = {
					hanhDong: status,
					thoiGian: time,
					lyDo: reason,
				};
				const ghiChu = reason
					? `Admin đã ${status} vào lúc ${time} với lý do: ${reason}`
					: `Admin đã ${status} vào lúc ${time}`;
				return {
					...item,
					trangThai: status,
					ghiChu,
					lichSuThaoTac: [...(item.lichSuThaoTac || []), lichSuEntry],
				};
			}
			return item;
		});
		localStorage.setItem('donDangKyData', JSON.stringify(data));
		setVersion((v) => v + 1);
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
		setVersion((v) => v + 1);
	};

	const deleteModel = async (id: string) => {
		const dataStr = localStorage.getItem('donDangKyData');
		let data = dataStr ? JSON.parse(dataStr) : [];
		data = data.filter((item: any) => item._id !== id);
		localStorage.setItem('donDangKyData', JSON.stringify(data));
		setVersion((v) => v + 1);
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
