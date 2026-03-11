import React from 'react';
import { Card, Table } from 'antd';

interface DateStatsCardProps {
    data: Array<{ date: string; count: number }>;
}

export default function DateStatsCard({ data }: DateStatsCardProps) {
    return (
        <Card title="Lịch hẹn theo ngày">
            <Table
                dataSource={data}
                columns={[
                    { title: 'Ngày', dataIndex: 'date', key: 'date' },
                    { title: 'Số lượng', dataIndex: 'count', key: 'count' },
                ]}
                pagination={false}
                rowKey="date"
            />
        </Card>
    );
}