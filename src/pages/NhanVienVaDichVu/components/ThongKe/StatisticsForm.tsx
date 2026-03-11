import React from 'react';
import { Form, DatePicker, Button } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import moment, { Moment } from 'moment';

interface StatisticsFormProps {
    onFilter: (range?: [Moment, Moment]) => void;
}

export default function StatisticsForm({ onFilter }: StatisticsFormProps) {
    const [form] = Form.useForm();

    const handleFinish = (values: any) => {
        const { range } = values;
        if (range && range.length === 2) {
            onFilter([range[0], range[1]]);
        } else {
            onFilter(undefined);
        }
    };

    const handleReset = () => {
        form.resetFields();
        onFilter(undefined);
    };

    return (
        <Form form={form} layout="inline" onFinish={handleFinish} style={{ marginBottom: 16 }}>
            <Form.Item name="range" label="Khoảng ngày">
                <DatePicker.RangePicker />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Lọc
                </Button>
            </Form.Item>
            <Form.Item>
                <Button htmlType="button" onClick={handleReset}>
                    Reset
                </Button>
            </Form.Item>
        </Form>
    );
}