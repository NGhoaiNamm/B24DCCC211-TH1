import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import FormQuyetDinh from './components/Form';
import moment from 'moment';

const QuyetDinh = () => {
  const { handleEdit, deleteModel } = useModel('vanbang.quyetDinh');
  const { danhSach: danhSachSoVanBang } = useModel('vanbang.soVanBang');

  const columns: IColumn<VanBang.IQuyetDinh>[] = [
    {
      title: 'Số Quyết Định',
      dataIndex: 'soQuyetDinh',
      width: 150,
      align: 'center',
    },
    {
      title: 'Ngày Ban Hành',
      dataIndex: 'ngayBanHanh',
      width: 150,
      align: 'center',
      render: (val: string) => (val ? moment(val).format('DD/MM/YYYY') : ''),
    },
    {
      title: 'Trích Yếu',
      dataIndex: 'trichYeu',
      width: 250,
    },
    {
      title: 'Thuộc Sổ Văn Bằng',
      dataIndex: 'soVanBangId',
      width: 200,
      render: (val: string) => {
        const soVanBang = danhSachSoVanBang?.find((s: any) => s._id === val);
        return soVanBang ? soVanBang.tenSo : val;
      },
    },
    {
      title: 'Số lượt tra cứu',
      dataIndex: 'soLuotTraCuu',
      width: 120,
      align: 'center',
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      render: (record: VanBang.IQuyetDinh) => (
        <span>
          <a onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Sửa</a>
          <a onClick={() => deleteModel(record._id)}>Xóa</a>
        </span>
      ),
    },
  ];

  return (
    <TableBase
      title="Quyết Định Tốt Nghiệp"
      modelName="vanbang.quyetDinh"
      columns={columns}
      dependencies={[danhSachSoVanBang]}
      Form={FormQuyetDinh}
      widthDrawer={600}
    />
  );
};

export default QuyetDinh;
