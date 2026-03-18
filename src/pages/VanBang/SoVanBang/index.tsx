import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import FormSoVanBang from './components/Form';

const SoVanBang = () => {
  const { handleEdit, deleteModel } = useModel('vanbang.soVanBang');

  const columns: IColumn<VanBang.ISoVanBang>[] = [
    {
      title: 'Năm',
      dataIndex: 'nam',
      width: 100,
      align: 'center',
    },
    {
      title: 'Tên Sổ',
      dataIndex: 'tenSo',
      width: 300,
    },
    {
      title: 'Số vào sổ hiện tại',
      dataIndex: 'soVaoSoHienTai',
      width: 150,
      align: 'center',
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      render: (record: VanBang.ISoVanBang) => (
        <span>
          <a onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Sửa</a>
          <a onClick={() => deleteModel(record._id)}>Xóa</a>
        </span>
      ),
    },
  ];

  return (
    <TableBase
      title="Sổ Văn Bằng"
      modelName="vanbang.soVanBang"
      columns={columns}
      Form={FormSoVanBang}
      widthDrawer={600}
    />
  );
};

export default SoVanBang;
