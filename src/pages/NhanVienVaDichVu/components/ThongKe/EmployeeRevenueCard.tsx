import React from 'react';
import { Card, Table } from 'antd';

interface EmployeeRevenueCardProps {
    data: Array<{ id: string; name: string; revenue: number }>;
}

export default function EmployeeRevenueCard({ data }: EmployeeRevenueCardProps) {
    return (
        <Card title="Doanh thu theo nhân viên">
            <Table
                dataSource={data}
                columns={[
                    { title: 'Nhân viên', dataIndex: 'name', key: 'name' },
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