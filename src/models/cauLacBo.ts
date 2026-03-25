import { useState, useEffect } from 'react';
import type { ICauLacBo } from '@/pages/CauLacBo/typing';

export default () => {
	const [danhSach, setDanhSach] = useState<ICauLacBo[]>([]);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(false);
	const [record, setRecord] = useState<Partial<ICauLacBo>>({});
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
			const dataStr = localStorage.getItem('cauLacBoData');
			let data: ICauLacBo[] = dataStr ? JSON.parse(dataStr) : [];

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
	}, [page, limit, version, condition, JSON.stringify(filters || []), JSON.stringify(sort || {})]);

	const addModel = async (payload: Partial<ICauLacBo>) => {
		const dataStr = localStorage.getItem('cauLacBoData');
		const data = dataStr ? JSON.parse(dataStr) : [];
		const newItem = { ...payload, _id: Date.now().toString() };
		data.unshift(newItem);
		localStorage.setItem('cauLacBoData', JSON.stringify(data));
		setVersion((v) => v + 1);
	};

	const updateModel = async (id: string, payload: Partial<ICauLacBo>) => {
		const dataStr = localStorage.getItem('cauLacBoData');
		let data = dataStr ? JSON.parse(dataStr) : [];
		const idx = data.findIndex((item: any) => item._id === id);
		if (idx > -1) {
			data[idx] = { ...data[idx], ...payload };
			localStorage.setItem('cauLacBoData', JSON.stringify(data));
		}
		setVersion((v) => v + 1);
	};

	const deleteModel = async (id: string) => {
		const dataStr = localStorage.getItem('cauLacBoData');
		let data = dataStr ? JSON.parse(dataStr) : [];
		data = data.filter((item: any) => item._id !== id);
		localStorage.setItem('cauLacBoData', JSON.stringify(data));
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
		deleteModel,
	};
};
