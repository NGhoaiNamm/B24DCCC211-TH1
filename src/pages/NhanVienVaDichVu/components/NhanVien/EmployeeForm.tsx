import React from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import { Employee } from '@/models/nhanvienvadichvu/employee';

interface EmployeeFormProps {
    editingEmployee?: Employee;
    onSubmit: (values: Employee) => void;
}

export default function EmployeeForm({ editingEmployee, onSubmit }: EmployeeFormProps) {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (editingEmployee) {
            form.setFieldsValue(editingEmployee);
        } else {
            form.resetFields();
        }
    }, [editingEmployee, form]);

    const handleFinish = (values: Omit<Employee, 'id'>) => {
        if (editingEmployee) {
            onSubmit({ ...values, id: editingEmployee.id });
        } else {
            onSubmit({ ...values, id: Date.now().toString() });
        }
        form.resetFields();
    };

    return (
        <Form form={form} layout="inline" onFinish={handleFinish} style={{ marginBottom: 16 }}>
            <Form.Item
                name="name"
                label="Tên"
                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
            >
                <Input placeholder="Tên nhân viên" />
            </Form.Item>
            <Form.Item
                name="maxCustomer"
                label="Số khách tối đa"
                rules={[{ required: true, message: 'Vui lòng nhập số khách!' }]}
            >
                <InputNumber min={1} placeholder="Số khách" />
            </Form.Item>
            <Form.Item
                name="workSchedule"
                label="Lịch làm việc"
                rules={[{ required: true, message: 'Vui lòng nhập lịch làm việc!' }]}
            >
                <Input placeholder="Lịch làm việc" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {editingEmployee ? 'Cập Nhật Nhân Viên' : 'Thêm Nhân Viên'}
                </Button>
            </Form.Item>
        </Form>
    );
}
