import React from 'react';
import { Card, Table } from 'antd';

interface EmployeeRatingCardProps {
    data: Array<{ id: string; name: string; avgRating: string }>;
}

export default function EmployeeRatingCard({ data }: EmployeeRatingCardProps) {
    return (
        <Card title="Đánh giá trung bình nhân viên">
            <Table
                dataSource={data}
                columns={[
                    { title: 'Nhân viên', dataIndex: 'name', key: 'name' },
                    { title: 'Điểm TB', dataIndex: 'avgRating', key: 'avgRating' },
                ]}
                pagination={false}
                rowKey="id"
            />
        </Card>
    );
}