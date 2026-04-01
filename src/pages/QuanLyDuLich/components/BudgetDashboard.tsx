import { Col, Divider, Progress, Row, Space, Statistic, Typography } from 'antd';
import { useModel } from 'umi';

const { Text } = Typography;

const BudgetDashboard = () => {
  const { totalItineraryBudget, statistics } = useModel('quanLyDuLich');

  const total = Math.max(1, totalItineraryBudget);
  const { anUong, luuTru, diChuyen } = statistics.totalBudgetCategory;

  return (
    <>
      <Row gutter={12}>
        <Col xs={24} sm={12} md={8}>
          <Statistic title='Số lịch trình' value={statistics.totalTrips} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Statistic title='Doanh thu ước tính' value={statistics.totalRevenue} precision={0} />
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Statistic title='Mức chi hiện tại' value={totalItineraryBudget} />
        </Col>
      </Row>
      <Divider />
      <Space direction='vertical' style={{ width: '100%' }}>
        <Text strong>Phân bổ ngân sách (đã dùng trên lịch trình hiện tại)</Text>
        <Progress percent={Math.min(100, Math.round((anUong * 100) / total))} format={() => `Ăn uống: ${anUong.toLocaleString()}`} />
        <Progress percent={Math.min(100, Math.round((luuTru * 100) / total))} format={() => `Lưu trú: ${luuTru.toLocaleString()}`} />
        <Progress percent={Math.min(100, Math.round((diChuyen * 100) / total))} format={() => `Di chuyển: ${diChuyen.toLocaleString()}`} />
      </Space>
      <Divider />
      <Text strong>Địa điểm phổ biến</Text>
      <ul>
        {statistics.popularList.length
          ? statistics.popularList.map((item) => (
              <li key={item.name}>
                {item.name} ({item.count} lượt)
              </li>
            ))
          : <li>Chưa có dữ liệu</li>}
      </ul>
    </>
  );
};

export default BudgetDashboard;
