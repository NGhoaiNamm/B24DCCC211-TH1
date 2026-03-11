import React from 'react';
import { Card, Table } from 'antd';

interface ServiceRevenueCardProps {
    data: Array<{ id: string; name: string; revenue: number }>;
}

export default function ServiceRevenueCard({ data }: ServiceRevenueCardProps) {
    return (
        <Card title="Doanh thu theo dịch vụ">
            <Table
                dataSource={data}
                columns={[
                    { title: 'Dịch vụ', dataIndex: 'name', key: 'name' },
                    {
                        title: 'Doanh thu',
                        dataIndex: 'revenue',
                        key: 'revenue',
                        render: (val: number) => val.toLocaleString() + 'đ',
                    },
                ]}
                pagination={false}
                rowKey="id"
            />
        </Card>
    );
}