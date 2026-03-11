import { Table, Popconfirm, Button } from 'antd';
import { Employee } from '@/models/nhanvienvadichvu/employee';

interface EmployeeTableProps {
    employees: Employee[];
    onEdit: (employee: Employee) => void;
    onDelete: (id: string) => void;
}

export default function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số khách tối đa/ngày',
            dataIndex: 'maxCustomer',
            key: 'maxCustomer',
        },
        {
            title: 'Lịch làm việc',
            dataIndex: 'workSchedule',
            key: 'workSchedule',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_text: string, record: Employee) => (
                <>
                    <Button type="link" onClick={() => onEdit(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa?"
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
            dataSource={employees}
            rowKey="id"
            pagination={{ pageSize: 10 }}
        />
    );
}
