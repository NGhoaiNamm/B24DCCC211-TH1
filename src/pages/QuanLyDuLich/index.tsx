import { Tabs } from 'antd';
import DestinationCardList from './components/DestinationCardList';
import ItineraryPlanner from './components/ItineraryPlanner';
import BudgetDashboard from './components/BudgetDashboard';
import AdminManager from './components/AdminManager';

const { TabPane } = Tabs;

const Page = () => (
  <div style={{ padding: 12 }}>
    <Tabs defaultActiveKey='1' type='card' size='large'>
      <TabPane tab='Khám phá điểm đến' key='1'>
        <DestinationCardList />
      </TabPane>
      <TabPane tab='Tạo lịch trình' key='2'>
        <ItineraryPlanner />
      </TabPane>
      <TabPane tab='Quản lý ngân sách' key='3'>
        <BudgetDashboard />
      </TabPane>
      <TabPane tab='Admin' key='4'>
        <AdminManager />
      </TabPane>
    </Tabs>
  </div>
);

export default Page;
