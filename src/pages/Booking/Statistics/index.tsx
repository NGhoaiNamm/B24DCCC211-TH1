import { useMemo, useState } from 'react';
import { Table, DatePicker, Tabs, Row, Col } from 'antd';
import moment from 'moment';
import useAppointmentModel from '@/models/nhanvienvadichvu/appointment';
import useEmployeeModel from '@/models/nhanvienvadichvu/employee';
import useServiceModel from '@/models/nhanvienvadichvu/service';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default function Statistics() {
    const { appointments } = useAppointmentModel();
    const { employees } = useEmployeeModel();
    const { services } = useServiceModel();

    const [range, setRange] = useState<[moment.Moment | null, moment.Moment | null]>([null, null]);
    const [groupByMonth, setGroupByMonth] = useState(false);

    const filtered = useMemo(() => {
        if (!range[0] || !range[1]) return appointments;
        return appointments.filter((a) => {
            const d = moment(a.date);
            return d.isBetween(range[0], range[1], undefined, '[]');
        });
    }, [appointments, range]);

    // appointment count by day
    const countByDay = useMemo(() => {
        const map: Record<string, number> = {};
        filtered.forEach((a) => {
            const key = groupByMonth ? moment(a.date).format('YYYY-MM') : moment(a.date).format('YYYY-MM-DD');
            map[key] = (map[key] || 0) + 1;
        });
        return Object.entries(map).map(([day, count]) => ({ day, count }));
    }, [filtered, groupByMonth]);

    // revenue by service
    const revenueByService = useMemo(() => {
        const map: Record<string, number> = {};
        filtered.forEach((a) => {
            map[a.serviceId] = (map[a.serviceId] || 0) + a.price;
        });
        return Object.entries(map).map(([sid, total]) => {
            const svc = services.find((s) => s.id === sid);
            return { service: svc?.name || sid, revenue: total };
        });
    }, [filtered, services]);

    // revenue by employee
    const revenueByEmployee = useMemo(() => {
        const map: Record<string, number> = {};
        filtered.forEach((a) => {
            map[a.employeeId] = (map[a.employeeId] || 0) + a.price;
        });
        return Object.entries(map).map(([eid, total]) => {
            const emp = employees.find((e) => e.id === eid);
            return { employee: emp?.name || eid, revenue: total };
        });
    }, [filtered, employees]);

    const countColumns = [
        { title: groupByMonth ? 'Tháng' : 'Ngày', dataIndex: 'day', key: 'day' },
        { title: 'Số lượng lịch hẹn', dataIndex: 'count', key: 'count' },
    ];

    const revenueServiceColumns = [
        { title: 'Dịch vụ', dataIndex: 'service', key: 'service' },
        {
            title: 'Doanh thu (VND)',
            dataIndex: 'revenue',
            key: 'revenue',
            render: (v: number) => v.toLocaleString(),
        },
    ];

    const revenueEmployeeColumns = [
        { title: 'Nhân viên', dataIndex: 'employee', key: 'employee' },
        {
            title: 'Doanh thu (VND)',
            dataIndex: 'revenue',
            key: 'revenue',
            render: (v: number) => v.toLocaleString(),
        },
    ];

    return (
        <div>
            <h2>Thống kê & Báo cáo</h2>
            <Row style={{ marginBottom: 16 }} gutter={16}>
                <Col>
                    <RangePicker onChange={(vals) => setRange(vals as any)} />
                </Col>
                <Col>
                    <label>
                        <input
                            type="checkbox"
                            checked={groupByMonth}
                            onChange={(e) => setGroupByMonth(e.target.checked)}
                        />{' '}
                        Thống kê theo tháng
                    </label>
                </Col>
            </Row>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Số lượng lịch hẹn" key="1">
                    <Table
                        columns={countColumns}
                        dataSource={countByDay}
                        rowKey="day"
                        pagination={{ pageSize: 10 }}
                    />
                </TabPane>
                <TabPane tab="Doanh thu theo dịch vụ" key="2">
                    <Table
                        columns={revenueServiceColumns}
                        dataSource={revenueByService}
                        rowKey="service"
                        pagination={{ pageSize: 10 }}
                    />
                </TabPane>
                <TabPane tab="Doanh thu theo nhân viên" key="3">
                    <Table
                        columns={revenueEmployeeColumns}
                        dataSource={revenueByEmployee}
                        rowKey="employee"
                        pagination={{ pageSize: 10 }}
                    />
                </TabPane>
            </Tabs>
        </div>
    );
}