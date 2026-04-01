import { Button, Col, Row, Space, Table } from 'antd';
import { useModel } from 'umi';
import DestinationForm from './DestinationForm';

const typeMap: Record<string, string> = {
  biển: 'blue',
  núi: 'green',
  'thành phố': 'purple',
};

const renderTypeTag = (type: string) => <span style={{ color: typeMap[type] || 'black' }}>{type}</span>;

const AdminManager = () => {
  const {
    destinations,
    isAdminModalVisible,
    adminEditItem,
    setIsAdminModalVisible,
    setAdminEditItem,
    addDestination,
    updateDestination,
    removeDestination,
  } = useModel('quanLyDuLich');

  return (
    <>
      <Row justify='space-between' align='middle' style={{ marginBottom: 12 }}>
        <Col>
          <Button
            type='primary'
            onClick={() => {
              setAdminEditItem(null);
              setIsAdminModalVisible(true);
            }}
          >
            Thêm điểm đến
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={destinations.map((d) => ({ ...d, key: d.id }))}
        pagination={{ pageSize: 6 }}
        columns={[
          { title: 'Tên', dataIndex: 'name', key: 'name' },
          { title: 'Loại', dataIndex: 'type', key: 'type', render: (x) => renderTypeTag(x) },
          {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (v) => new Intl.NumberFormat('vi-VN').format(v),
          },
          { title: 'Rating', dataIndex: 'rating', key: 'rating' },
          {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
              <Space>
                <Button
                  onClick={() => {
                    setAdminEditItem(record);
                    setIsAdminModalVisible(true);
                  }}
                >
                  Sửa
                </Button>
                <Button danger onClick={() => removeDestination(record.id)}>
                  Xóa
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <DestinationForm
        visible={isAdminModalVisible}
        initialValue={adminEditItem}
        onClose={() => setIsAdminModalVisible(false)}
        onSubmit={(values: any) => {
          const payload = {
            id: adminEditItem?.id || `${Date.now()}`,
            name: values.name,
            type: values.type,
            price: Number(values.price),
            rating: Number(values.rating),
            description: values.description || '',
            duration: Number(values.duration),
            costAnUong: Number(values.costAnUong),
            costLuuTru: Number(values.costLuuTru),
            costDiChuyen: Number(values.costDiChuyen),
            image: values.image,
          };

          if (adminEditItem) updateDestination(payload);
          else addDestination(payload);
        }}
      />
    </>
  );
};

export default AdminManager;
