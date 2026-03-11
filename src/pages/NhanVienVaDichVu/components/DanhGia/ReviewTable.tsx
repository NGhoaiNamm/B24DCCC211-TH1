import React from 'react';
import { Table, Button, Popconfirm, Rate } from 'antd';
import { Review } from '@/models/nhanvienvadichvu/review';
import useAppointmentModel from '@/models/nhanvienvadichvu/appointment';
import useEmployeeModel from '@/models/nhanvienvadichvu/employee';
import useServiceModel from '@/models/nhanvienvadichvu/service';

interface ReviewTableProps {
    reviews: Review[];
    onEdit: (rev: Review) => void;
    onDelete: (id: string) => void;
}

export default function ReviewTable({ reviews, onEdit, onDelete }: ReviewTableProps) {
    const { appointments } = useAppointmentModel();
    const { employees } = useEmployeeModel();
    const { services } = useServiceModel();

    const columns = [
        {
            title: 'Khách hàng',
            key: 'customer',
            render: (_: any, record: Review) => {
                const appt = appointments.find(a => a.id === record.appointmentId);
                return appt ? appt.customerName : '-';
            },
        },
        {
            title: 'Nhân viên',
            key: 'employee',
            render: (_: any, record: Review) => {
                const appt = appointments.find(a => a.id === record.appointmentId);
                const emp = appt ? employees.find(e => e.id === appt.employeeId) : undefined;
                return emp ? emp.name : '-';
            },
        },
        {
            title: 'Dịch vụ',
            key: 'service',
            render: (_: any, record: Review) => {
                const appt = appointments.find(a => a.id === record.appointmentId);
                const svc = appt ? services.find(s => s.id === appt.serviceId) : undefined;
                return svc ? svc.name : '-';
            },
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating: number) => <Rate disabled value={rating} />,
        },
        {
            title: 'Nhận xét',
            dataIndex: 'comment',
            key: 'comment',
        },
        {
            title: 'Phản hồi',
            dataIndex: 'response',
            key: 'response',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: Review) => (
                <>
                    <Button type="link" onClick={() => onEdit(record)}>
                        {record.response ? 'Sửa phản hồi' : 'Phản hồi'}
                    </Button>
                    <Popconfirm title="Xóa đánh giá?" onConfirm={() => onDelete(record.id)}>
                        <Button type="link" danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={reviews}
            rowKey="id"
            pagination={{ pageSize: 10 }}
        />
    );
}