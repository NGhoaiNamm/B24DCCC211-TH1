import { useState, useEffect } from 'react';
import type { ILichTrinh, ILichTrinhNgay, INganSach } from '@/pages/DuLich/typing';

const STORAGE_KEY = 'duLich_lichTrinh';
const NGAN_SACH_KEY = 'duLich_nganSach';

export default () => {
	const [danhSach, setDanhSach] = useState<ILichTrinh[]>([]);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);
	const [record, setRecord] = useState<Partial<ILichTrinh>>({});
	const [loading, setLoading] = useState<boolean>(false);
	const [version, setVersion] = useState<number>(0);
	const [selectedId, setSelectedId] = useState<string>('');
	const [searchText, setSearchText] = useState<string>('');

	const getAllData = (): ILichTrinh[] => {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	};

	const saveAll = (data: ILichTrinh[]) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	};

	const getModel = async () => {
		setLoading(true);
		try {
			let data = getAllData();
			if (searchText) {
				data = data.filter((item) =>
					item.tieuDe.toLowerCase().includes(searchText.toLowerCase()),
				);
			}
			setDanhSach(data);
		} catch (e) {
			setDanhSach([]);
		}
		setLoading(false);
	};

	useEffect(() => {
		getModel();
	}, [version, searchText]);

	const addModel = async (payload: Partial<ILichTrinh>): Promise<ILichTrinh> => {
		const data = getAllData();
		const newItem: ILichTrinh = {
			...payload,
			_id: Date.now().toString(),
			ngayList: payload.ngayList || [],
			createdAt: new Date().toISOString(),
		} as ILichTrinh;
		data.unshift(newItem);
		saveAll(data);
		setVersion((v) => v + 1);
		return newItem;
	};

	const updateModel = async (id: string, payload: Partial<ILichTrinh>) => {
		const data = getAllData();
		const idx = data.findIndex((item) => item._id === id);
		if (idx > -1) {
			data[idx] = { ...data[idx], ...payload };
			saveAll(data);
		}
		setVersion((v) => v + 1);
	};

	const deleteModel = async (id: string) => {
		let data = getAllData();
		data = data.filter((item) => item._id !== id);
		saveAll(data);
		// also remove budget
		let nganSachList: INganSach[] = getNganSachAll();
		nganSachList = nganSachList.filter((n) => n.lichTrinhId !== id);
		localStorage.setItem(NGAN_SACH_KEY, JSON.stringify(nganSachList));
		setVersion((v) => v + 1);
	};

	const getById = (id: string): ILichTrinh | undefined => {
		return getAllData().find((item) => item._id === id);
	};

	// Add a destination to a specific day
	const addDiemDenToNgay = (lichTrinhId: string, ngay: number, diemDenId: string) => {
		const data = getAllData();
		const idx = data.findIndex((item) => item._id === lichTrinhId);
		if (idx > -1) {
			const lt = data[idx];
			let ngayEntry = lt.ngayList.find((n) => n.ngay === ngay);
			if (!ngayEntry) {
				ngayEntry = { ngay, diemDenIds: [] };
				lt.ngayList.push(ngayEntry);
			}
			if (!ngayEntry.diemDenIds.includes(diemDenId)) {
				ngayEntry.diemDenIds.push(diemDenId);
			}
			saveAll(data);
			setVersion((v) => v + 1);
		}
	};

	// Remove destination from a day
	const removeDiemDenFromNgay = (lichTrinhId: string, ngay: number, diemDenId: string) => {
		const data = getAllData();
		const idx = data.findIndex((item) => item._id === lichTrinhId);
		if (idx > -1) {
			const lt = data[idx];
			const ngayEntry = lt.ngayList.find((n) => n.ngay === ngay);
			if (ngayEntry) {
				ngayEntry.diemDenIds = ngayEntry.diemDenIds.filter((id) => id !== diemDenId);
			}
			saveAll(data);
			setVersion((v) => v + 1);
		}
	};

	// Reorder destinations within a day
	const reorderDiemDen = (lichTrinhId: string, ngay: number, newIds: string[]) => {
		const data = getAllData();
		const idx = data.findIndex((item) => item._id === lichTrinhId);
		if (idx > -1) {
			const lt = data[idx];
			const ngayEntry = lt.ngayList.find((n) => n.ngay === ngay);
			if (ngayEntry) {
				ngayEntry.diemDenIds = newIds;
			}
			saveAll(data);
			setVersion((v) => v + 1);
		}
	};

	// Budget (ngan sach)
	const getNganSachAll = (): INganSach[] => {
		const stored = localStorage.getItem(NGAN_SACH_KEY);
		return stored ? JSON.parse(stored) : [];
	};

	const getNganSach = (lichTrinhId: string): INganSach | undefined => {
		return getNganSachAll().find((n) => n.lichTrinhId === lichTrinhId);
	};

	const saveNganSach = (ns: INganSach) => {
		const all = getNganSachAll();
		const idx = all.findIndex((n) => n.lichTrinhId === ns.lichTrinhId);
		if (idx > -1) {
			all[idx] = ns;
		} else {
			all.push(ns);
		}
		localStorage.setItem(NGAN_SACH_KEY, JSON.stringify(all));
		setVersion((v) => v + 1);
	};

	return {
		danhSach,
		setDanhSach,
		visibleForm,
		setVisibleForm,
		edit,
		setEdit,
		record,
		setRecord,
		loading,
		selectedId,
		setSelectedId,
		searchText,
		setSearchText,
		getModel,
		addModel,
		updateModel,
		deleteModel,
		getById,
		getAllData,
		addDiemDenToNgay,
		removeDiemDenFromNgay,
		reorderDiemDen,
		getNganSach,
		getNganSachAll,
		saveNganSach,
	};
};
