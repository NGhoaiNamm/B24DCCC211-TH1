import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import FormThongTinVanBang from './components/Form';

const ThongTinVanBang = () => {
  const { handleEdit, deleteModel } = useModel('vanbang.thongTinVanBang');
  const { danhSach: danhSachQuyetDinh } = useModel('vanbang.quyetDinh');

  const columns: IColumn<VanBang.IThongTinVanBang>[] = [
    {
      title: 'Số vào sổ',
      dataIndex: 'soVaoSo',
      width: 100,
      align: 'center',
    },
    {
      title: 'Số hiệu VB',
      dataIndex: 'soHieuVanBang',
      width: 120,
      align: 'center',
    },
    {
      title: 'Mã Sinh Viên',
      dataIndex: 'maSinhVien',
      width: 120,
      align: 'center',
    },
    {
      title: 'Họ Tên',
      dataIndex: 'hoTen',
      width: 200,
    },
    {
      title: 'Quyết định',
      dataIndex: 'quyetDinhId',
      width: 200,
      render: (val: string) => {
        const qd = danhSachQuyetDinh?.find((item: any) => item._id === val);
        return qd ? qd.soQuyetDinh : val;
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      render: (record: VanBang.IThongTinVanBang) => (
        <span>
          <a onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Sửa</a>
          <a onClick={() => deleteModel(record._id)}>Xóa</a>
        </span>
      ),
    },
  ];

  return (
    <TableBase
      title="Thông Tin Văn Bằng Sinh Viên"
      modelName="vanbang.thongTinVanBang"
      dependencies={[danhSachQuyetDinh]}
      columns={columns}
      Form={FormThongTinVanBang}
      widthDrawer={800}
    />
  );
};

export default ThongTinVanBang;
