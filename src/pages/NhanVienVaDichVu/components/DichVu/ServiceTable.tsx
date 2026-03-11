import { Table, Popconfirm, Button } from 'antd';
import { Service } from '@/models/nhanvienvadichvu/service';

interface ServiceTableProps {
    services: Service[];
    onDelete: (id: string) => void;
}

export default function ServiceTable({ services, onDelete }: ServiceTableProps) {
    const columns = [
        {
            title: 'Tên dịch vụ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price.toLocaleString()} VND`,
        },
        {
            title: 'Thời gian (phút)',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_text: string, record: Service) => (
                <Popconfirm
                    title="Bạn có chắc muốn xóa?"
                    onConfirm={() => onDelete(record.id)}
                >
                    <Button type="link" danger>
                        Xóa
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={services}
            rowKey="id"
            pagination={{ pageSize: 10 }}
        />
    );
}
