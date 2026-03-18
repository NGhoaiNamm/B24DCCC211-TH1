declare namespace VanBang {
  export interface ISoVanBang {
    _id: string;
    nam: number;
    tenSo: string;
    soVaoSoHienTai: number; // Tự động tăng
  }

  export interface IQuyetDinh {
    _id: string;
    soQuyetDinh: string;
    ngayBanHanh: string;
    trichYeu: string;
    soVanBangId: string;
    soLuotTraCuu: number;
  }

  export interface ICauHinh {
    _id: string;
    tenTruong: string;
    loaiDuLieu: 'String' | 'Number' | 'Date';
    batBuoc: boolean;
  }

  export interface IThongTinVanBang {
    _id: string;
    soVaoSo: string; // Tự động tăng theo sổ
    soHieuVanBang: string;
    maSinhVien: string;
    hoTen: string;
    ngaySinh: string;
    quyetDinhId: string;
    truongDong: Record<string, any>; // Các trường từ cấu hình
  }
}
