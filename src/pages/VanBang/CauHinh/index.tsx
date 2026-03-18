import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import FormCauHinh from './components/Form';
import { Tag } from 'antd';

const CauHinh = () => {
  const { handleEdit, deleteModel } = useModel('vanbang.cauHinh');

  const columns: IColumn<VanBang.ICauHinh>[] = [
    {
      title: 'Tên Trường Dữ Liệu',
      dataIndex: 'tenTruong',
      width: 250,
    },
    {
      title: 'Kiểu Dữ Liệu',
      dataIndex: 'loaiDuLieu',
      width: 150,
      align: 'center',
      render: (val: string) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: 'Bắt Buộc',
      dataIndex: 'batBuoc',
      width: 100,
      align: 'center',
      render: (val: boolean) => (val ? <Tag color="success">Có</Tag> : <Tag color="default">Không</Tag>),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      render: (record: VanBang.ICauHinh) => (
        <span>
          <a onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Sửa</a>
          <a onClick={() => deleteModel(record._id)}>Xóa</a>
        </span>
      ),
    },
  ];

  return (
    <TableBase
      title="Cấu Hình Biểu Mẫu Phụ Lục Văn Bằng"
      modelName="vanbang.cauHinh"
      columns={columns}
      Form={FormCauHinh}
      widthDrawer={500}
    />
  );
};

export default CauHinh;
