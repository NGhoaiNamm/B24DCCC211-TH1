import { useState, useEffect } from 'react';
import type { IDiemDen } from '@/pages/DuLich/typing';

const STORAGE_KEY = 'duLich_diemDen';

const defaultData: IDiemDen[] = [
	{
		_id: '1',
		ten: 'Vịnh Hạ Long',
		loai: 'bien',
		moTa: '<p>Vịnh Hạ Long là một kỳ quan thiên nhiên thế giới với hàng nghìn đảo đá vôi nhô lên từ mặt biển xanh ngọc bích.</p>',
		hinhAnh: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sung_Sot_cave_Ha_Long_Bay.jpg/800px-Sung_Sot_cave_Ha_Long_Bay.jpg',
		diaChi: 'Quảng Ninh, Việt Nam',
		thoiGianThamQuan: 8,
		chiPhiAnUong: 300000,
		chiPhiLuTru: 800000,
		chiPhiDiChuyen: 500000,
		rating: 5,
		createdAt: new Date().toISOString(),
	},
	{
		_id: '2',
		ten: 'Đà Nẵng',
		loai: 'thanhPho',
		moTa: '<p>Đà Nẵng - thành phố đáng sống nhất Việt Nam với những bãi biển đẹp và ẩm thực phong phú.</p>',
		hinhAnh: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Han-River-Bridge-Da-Nang-Vietnam.jpg/800px-Han-River-Bridge-Da-Nang-Vietnam.jpg',
		diaChi: 'Đà Nẵng, Việt Nam',
		thoiGianThamQuan: 12,
		chiPhiAnUong: 250000,
		chiPhiLuTru: 600000,
		chiPhiDiChuyen: 300000,
		rating: 4,
		createdAt: new Date().toISOString(),
	},
	{
		_id: '3',
		ten: 'Sapa',
		loai: 'nui',
		moTa: '<p>Sapa nổi tiếng với những thửa ruộng bậc thang xanh mướt, những làng dân tộc thiểu số và khí hậu mát mẻ quanh năm.</p>',
		hinhAnh: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Terraced_rice_field_in_Sapa_Vietnam.jpg/800px-Terraced_rice_field_in_Sapa_Vietnam.jpg',
		diaChi: 'Lào Cai, Việt Nam',
		thoiGianThamQuan: 16,
		chiPhiAnUong: 200000,
		chiPhiLuTru: 500000,
		chiPhiDiChuyen: 400000,
		rating: 5,
		createdAt: new Date().toISOString(),
	},
	{
		_id: '4',
		ten: 'Phú Quốc',
		loai: 'bien',
		moTa: '<p>Phú Quốc - hòn đảo ngọc của Việt Nam với bãi biển cát trắng, nước biển trong xanh và hải sản tươi ngon.</p>',
		hinhAnh: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Long_Beach_-_Phu_Quoc.jpg/800px-Long_Beach_-_Phu_Quoc.jpg',
		diaChi: 'Kiên Giang, Việt Nam',
		thoiGianThamQuan: 24,
		chiPhiAnUong: 350000,
		chiPhiLuTru: 1200000,
		chiPhiDiChuyen: 800000,
		rating: 5,
		createdAt: new Date().toISOString(),
	},
	{
		_id: '5',
		ten: 'Hội An',
		loai: 'thanhPho',
		moTa: '<p>Hội An - phố cổ với những ngọn đèn lồng, kiến trúc lịch sử và ẩm thực địa phương đặc sắc.</p>',
		hinhAnh: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hoi_An_-_Japanese_Bridge.jpg/800px-Hoi_An_-_Japanese_Bridge.jpg',
		diaChi: 'Quảng Nam, Việt Nam',
		thoiGianThamQuan: 10,
		chiPhiAnUong: 200000,
		chiPhiLuTru: 700000,
		chiPhiDiChuyen: 250000,
		rating: 4,
		createdAt: new Date().toISOString(),
	},
	{
		_id: '6',
		ten: 'Đà Lạt',
		loai: 'nui',
		moTa: '<p>Đà Lạt - thành phố hoa với khí hậu ôn hòa, rừng thông xanh mướt và nhiều điểm tham quan thú vị.</p>',
		hinhAnh: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Da_Lat_City_-_panoramio_%281%29.jpg/800px-Da_Lat_City_-_panoramio_%281%29.jpg',
		diaChi: 'Lâm Đồng, Việt Nam',
		thoiGianThamQuan: 12,
		chiPhiAnUong: 220000,
		chiPhiLuTru: 550000,
		chiPhiDiChuyen: 350000,
		rating: 4,
		createdAt: new Date().toISOString(),
	},
];

const getInitialData = (): IDiemDen[] => {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) return JSON.parse(stored);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
	return defaultData;
};

export default () => {
	const [danhSach, setDanhSach] = useState<IDiemDen[]>([]);
	const [allData, setAllData] = useState<IDiemDen[]>([]);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(false);
	const [record, setRecord] = useState<Partial<IDiemDen>>({});
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [total, setTotal] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [filterLoai, setFilterLoai] = useState<string[]>([]);
	const [filterRating, setFilterRating] = useState<number>(0);
	const [filterGiaMax, setFilterGiaMax] = useState<number>(0);
	const [sortField, setSortField] = useState<string>('');
	const [sortOrder, setSortOrder] = useState<string>('');
	const [searchText, setSearchText] = useState<string>('');
	const [version, setVersion] = useState<number>(0);

	const getModel = async () => {
		setLoading(true);
		try {
			let data: IDiemDen[] = getInitialData();
			setAllData(data);

			if (searchText) {
				data = data.filter((item) =>
					item.ten.toLowerCase().includes(searchText.toLowerCase()),
				);
			}
			if (filterLoai && filterLoai.length > 0) {
				data = data.filter((item) => filterLoai.includes(item.loai));
			}
			if (filterRating > 0) {
				data = data.filter((item) => item.rating >= filterRating);
			}
			if (filterGiaMax > 0) {
				data = data.filter(
					(item) =>
						item.chiPhiAnUong + item.chiPhiLuTru + item.chiPhiDiChuyen <=
						filterGiaMax,
				);
			}
			if (sortField) {
				data.sort((a: any, b: any) => {
					const order = sortOrder === 'ascend' ? 1 : -1;
					if (a[sortField] < b[sortField]) return -1 * order;
					if (a[sortField] > b[sortField]) return 1 * order;
					return 0;
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

	useEffect(() => {
		getModel();
	}, [
		page,
		limit,
		version,
		searchText,
		filterLoai,
		filterRating,
		filterGiaMax,
		sortField,
		sortOrder,
	]);

	const addModel = async (payload: Partial<IDiemDen>) => {
		const data = getInitialData();
		const newItem: IDiemDen = {
			...payload,
			_id: Date.now().toString(),
			createdAt: new Date().toISOString(),
		} as IDiemDen;
		data.unshift(newItem);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		setVersion((v) => v + 1);
	};

	const updateModel = async (id: string, payload: Partial<IDiemDen>) => {
		const data = getInitialData();
		const idx = data.findIndex((item) => item._id === id);
		if (idx > -1) {
			data[idx] = { ...data[idx], ...payload };
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		}
		setVersion((v) => v + 1);
	};

	const deleteModel = async (id: string) => {
		let data = getInitialData();
		data = data.filter((item) => item._id !== id);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		setVersion((v) => v + 1);
	};

	const getById = (id: string): IDiemDen | undefined => {
		const data = getInitialData();
		return data.find((item) => item._id === id);
	};

	return {
		danhSach,
		allData,
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
		filterLoai,
		setFilterLoai,
		filterRating,
		setFilterRating,
		filterGiaMax,
		setFilterGiaMax,
		sortField,
		setSortField,
		sortOrder,
		setSortOrder,
		searchText,
		setSearchText,
		getModel,
		addModel,
		updateModel,
		deleteModel,
		getById,
	};
};
