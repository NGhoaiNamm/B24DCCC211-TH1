import { Row, Col } from 'antd';
import moment, { Moment } from 'moment';
import useAppointmentModel from '@/models/nhanvienvadichvu/appointment';
import useServiceModel from '@/models/nhanvienvadichvu/service';
import useEmployeeModel from '@/models/nhanvienvadichvu/employee';
import useReviewModel from '@/models/nhanvienvadichvu/review';

import DateStatsCard from './DateStatsCard';
import ServiceRevenueCard from './ServiceRevenueCard';
import EmployeeRevenueCard from './EmployeeRevenueCard';
import EmployeeRatingCard from './EmployeeRatingCard';


interface StatisticsTableProps {
    dateRange?: [Moment, Moment];
}

export default function StatisticsTable({ dateRange }: StatisticsTableProps) {
    const { appointments } = useAppointmentModel();
    const { services } = useServiceModel();
    const { employees } = useEmployeeModel();
    const { reviews } = useReviewModel();

    // If a dateRange is provided, filter appointments accordingly
    const filteredAppointments = dateRange
        ? appointments.filter(a => {
            const d = moment(a.date, 'YYYY-MM-DD');
            return d.isBetween(
                dateRange[0].startOf('day'),
                dateRange[1].endOf('day'),
                undefined,
                '[]'
            );
        })
        : appointments;

    // appointments per day
    const byDate = filteredAppointments.reduce((acc: Record<string, number>, a) => {
        acc[a.date] = (acc[a.date] || 0) + 1;
        return acc;
    }, {});
    const dateData = Object.entries(byDate).map(([date, count]) => ({ date, count } as { date: string; count: number }));

    // revenue per service
    const revenuePerService = services.map(s => {
        const total = filteredAppointments
            .filter(a => a.serviceId === s.id && a.status !== 'cancelled')
            .reduce((sum, a) => sum + (s.price || 0), 0);
        return { ...s, revenue: total };
    });

    // revenue per employee
    const revenuePerEmployee = employees.map(e => {
        const total = filteredAppointments
            .filter(a => a.employeeId === e.id && a.status !== 'cancelled')
            .reduce((sum, a) => {
                const svc = services.find(s => s.id === a.serviceId);
                return sum + (svc ? svc.price : 0);
            }, 0);
        return { ...e, revenue: total };
    });

    // average rating per employee
    const ratingPerEmployee = employees.map(e => {
        const empReviews = reviews.filter(r => {
            const appt = filteredAppointments.find(a => a.id === r.appointmentId);
            return appt?.employeeId === e.id;
        });
        const avg =
            empReviews.length > 0
                ? empReviews.reduce((sum, r) => sum + r.rating, 0) / empReviews.length
                : 0;
        return { ...e, avgRating: avg.toFixed(1) };
    });

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <DateStatsCard data={dateData} />
                </Col>
                <Col span={12}>
                    <ServiceRevenueCard data={revenuePerService} />
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col span={12}>
                    <EmployeeRevenueCard data={revenuePerEmployee} />
                </Col>
                <Col span={12}>
                    <EmployeeRatingCard data={ratingPerEmployee} />
                </Col>
            </Row>
        </>
    );
}