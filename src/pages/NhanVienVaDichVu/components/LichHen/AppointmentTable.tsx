import React from 'react';
import { Table, Popconfirm, Button, Select, Tag } from 'antd';
import { Appointment } from '@/models/nhanvienvadichvu/appointment';
import useEmployeeModel from '@/models/nhanvienvadichvu/employee';
import useServiceModel from '@/models/nhanvienvadichvu/service';

const { Option } = Select;

interface AppointmentTableProps {
    appointments: Appointment[];
    onEdit: (a: Appointment) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: Appointment['status']) => void;
}

export default function AppointmentTable({
    appointments,
    onEdit,
    onDelete,
    onStatusChange,
}: AppointmentTableProps) {
    const { employees } = useEmployeeModel();
    const { services } = useServiceModel();

    const columns = [
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Giờ',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'SĐT',
            dataIndex: 'customerPhone',
            key: 'customerPhone',
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'serviceId',
            key: 'serviceId',
            render: (id: string) => {
                const svc = services.find(s => s.id === id);
                return svc ? svc.name : id;
            },
        },
        {
            title: 'Nhân viên',
            dataIndex: 'employeeId',
            key: 'employeeId',
            render: (id: string) => {
                const emp = employees.find(e => e.id === id);
                return emp ? emp.name : id;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: Appointment['status'], record: Appointment) => (
                <Select
                    value={status}
                    style={{ width: 120 }}
                    onChange={(val) => onStatusChange(record.id, val as Appointment['status'])}
                >
                    <Option value="pending">Chờ duyệt</Option>
                    <Option value="confirmed">Xác nhận</Option>
                    <Option value="completed">Hoàn thành</Option>
                    <Option value="cancelled">Hủy</Option>
                </Select>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: Appointment) => (
                <>
                    <Button type="link" onClick={() => onEdit(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa lịch này?"
                        onConfirm={() => onDelete(record.id)}
                    >
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
            dataSource={appointments}
            rowKey="id"
            pagination={{ pageSize: 10 }}
        />
    );
}