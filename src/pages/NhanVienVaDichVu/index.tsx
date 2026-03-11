
import React from 'react';
import { Tabs } from 'antd';
import EmployeeTab from './components/NhanVien/EmployeeTab';
import ServiceTab from './components/DichVu/ServiceTab';
import AppointmentTab from './components/LichHen/AppointmentTab';
import ReviewTab from './components/DanhGia/ReviewTab';
import StatisticsTab from './components/ThongKe/StatisticsTab';

const { TabPane } = Tabs;

export default function NhanVienVaDichVu() {
    return (
        <Tabs defaultActiveKey="employees" type="card">
            <TabPane tab="Nhân viên" key="employees">
                <EmployeeTab />
            </TabPane>
            <TabPane tab="Dịch vụ" key="services">
                <ServiceTab />
            </TabPane>
            <TabPane tab="Lịch hẹn" key="appointments">
                <AppointmentTab />
            </TabPane>
            <TabPane tab="Đánh giá" key="reviews">
                <ReviewTab />
            </TabPane>
            <TabPane tab="Thống kê" key="statistics">
                <StatisticsTab />
            </TabPane>
        </Tabs>
    );
}