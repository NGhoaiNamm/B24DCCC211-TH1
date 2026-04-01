import { Alert, Button, Col, Divider, InputNumber, Progress, Row, Select, Space, Statistic, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';

type SelectType = 'all' | 'biển' | 'núi' | 'thành phố';

const ItineraryPlanner = () => {
  const {
    destinations,
    itineraries,
    selectedItineraryId,
    getCurrentItinerary,
    budgetLimit,
    totalItineraryBudget,
    totalTravelTime,
    setSelectedItineraryId,
    setBudgetLimit,
    addItinerary,
    removeItinerary,
    appendDestinationToItinerary,
    removeItineraryItem,
    reorderItineraryItem,
  } = useModel('quanLyDuLich');

  const [addItemDestId, setAddItemDestId] = useState<string>(destinations[0]?.id || '');
  const [addItemDay, setAddItemDay] = useState<number>(1);

  const itineraryRow: Array<any> = (getCurrentItinerary?.items ?? []).map((item) => {
    const dest = destinations.find((d) => d.id === item.destinationId);
    return {
      key: item.id,
      day: item.day,
      name: dest?.name || 'Không xác định',
      type: dest?.type || '',
      price: dest?.price ?? 0,
      time: dest?.duration ?? 0,
      anUong: dest?.costAnUong ?? 0,
      luuTru: dest?.costLuuTru ?? 0,
      diChuyen: dest?.costDiChuyen ?? 0,
    };
  });

  const itineraryColumns: ColumnsType<any> = [
    { title: 'Ngày', dataIndex: 'day', key: 'day', width: 90 },
    { title: 'Điểm đến', dataIndex: 'name', key: 'name' },
    { title: 'Loại', dataIndex: 'type', key: 'type' },
    { title: 'Giá', dataIndex: 'price', key: 'price', render: (v) => new Intl.NumberFormat('vi-VN').format(v) },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button size='small' onClick={() => reorderItineraryItem(record.key, 'up')}>
            Up
          </Button>
          <Button size='small' onClick={() => reorderItineraryItem(record.key, 'down')}>
            Down
          </Button>
          <Button danger size='small' onClick={() => removeItineraryItem(record.key)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
        <Col xs={24} md={12}>
          <Select value={selectedItineraryId} onChange={(value) => setSelectedItineraryId(value)} style={{ width: '100%' }}>
            {itineraries.map((it) => (
              <Select.Option key={it.id} value={it.id}>
                {it.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={12}>
          <Button
            type='dashed'
            block
            onClick={() => {
              const newName = `Lịch trình ${itineraries.length + 1}`;
              addItinerary(newName);
            }}
          >
            Tạo lịch trình mới
          </Button>
        </Col>
      </Row>

      <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
        <Col xs={24} sm={14} md={10}>
          <Select value={addItemDestId} onChange={(v) => setAddItemDestId(v)} style={{ width: '100%' }}>
            {destinations.map((d) => (
              <Select.Option key={d.id} value={d.id}>
                {d.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={12} sm={6} md={4}>
          <InputNumber min={1} value={addItemDay} style={{ width: '100%' }} onChange={(v) => setAddItemDay(v || 1)} />
        </Col>
        <Col xs={12} sm={4} md={3}>
          <Button type='primary' onClick={() => appendDestinationToItinerary(addItemDestId, addItemDay)}>
            Thêm
          </Button>
        </Col>
        <Col xs={24} sm={24} md={7}>
          <Button danger block onClick={() => removeItinerary(selectedItineraryId)}>
            Xóa lịch trình hiện tại
          </Button>
        </Col>
      </Row>

      <Table pagination={false} columns={itineraryColumns} dataSource={itineraryRow} />
      <Divider />
      <Row gutter={12}>
        <Col xs={24} sm={12} md={8}>
          <Statistic title='Tổng chi phí (ước tính)' value={totalItineraryBudget} suffix='VND' />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Statistic title='Tổng thời gian (phút)' value={totalTravelTime} />
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Progress
            percent={Math.min(100, Math.round((totalItineraryBudget / Math.max(1, budgetLimit)) * 100))}
            status={totalItineraryBudget > budgetLimit ? 'exception' : 'normal'}
          />
          <Statistic title='Ngân sách hiện tại' value={budgetLimit} suffix='VND' />
          <InputNumber
            min={0}
            style={{ width: '100%', marginTop: 8 }}
            value={budgetLimit}
            onChange={(v) => setBudgetLimit(v || budgetLimit)}
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(v: any) => v.replace(/\D/g, '')}
          />
        </Col>
      </Row>
      {totalItineraryBudget > budgetLimit && (
        <Alert style={{ marginTop: 12 }} message='Cảnh báo: ngân sách vượt hạn định!' type='error' showIcon />
      )}
    </>
  );
};

export default ItineraryPlanner;
