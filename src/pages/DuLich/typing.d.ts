export type DiemDenLoai = 'bien' | 'nui' | 'thanhPho';

export interface IDiemDen {
	_id: string;
	ten: string;
	loai: DiemDenLoai;
	moTa: string; // HTML from TinyEditor
	hinhAnh: string; // base64 or URL
	diaChi?: string;
	thoiGianThamQuan: number; // hours
	chiPhiAnUong: number; // VND per person
	chiPhiLuTru: number; // VND per night
	chiPhiDiChuyen: number; // VND estimated
	rating: number; // 1-5
	createdAt: string;
}

export interface ILichTrinhNgay {
	ngay: number; // 1-based day index
	diemDenIds: string[];
}

export interface ILichTrinh {
	_id: string;
	tieuDe: string;
	ngayBatDau: string; // ISO date string
	ngayKetThuc: string;
	ngayList: ILichTrinhNgay[];
	nganSachTong: number; // total budget VND
	createdAt: string;
}

export interface INganSachCategory {
	anUong: number;
	diChuyen: number;
	luTru: number;
	khac: number;
}

export interface INganSach {
	_id: string;
	lichTrinhId: string;
	phanBo: INganSachCategory; // user allocated amounts
}
