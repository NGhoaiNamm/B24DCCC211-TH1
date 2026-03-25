// Interface cho Câu lạc bộ
export interface ICauLacBo {
  _id: string;
  ten: string;
  ngayThanhLap: string;
  anhDaiDien?: string;
  moTa?: string; // HTML content từ TinyEditor
  chuNhiem: string;
  hoatDong: boolean;
}

// Interface cho Đơn đăng ký thành viên
export interface IDonDangKy {
  _id: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  gioiTinh: 'Nam' | 'Nữ' | 'Khác';
  diaChi?: string;
  soTruong?: string;
  cauLacBoId: string;
  lyDo?: string;
  trangThai: 'Pending' | 'Approved' | 'Rejected';
  ghiChu?: string; // Lý do từ chối hoặc lịch sử thao tác
  lichSuThaoTac?: ILichSuThaoTac[];
}

// Interface cho lịch sử thao tác
export interface ILichSuThaoTac {
  hanhDong: string; // Approved | Rejected
  thoiGian: string;
  lyDo?: string;
}
