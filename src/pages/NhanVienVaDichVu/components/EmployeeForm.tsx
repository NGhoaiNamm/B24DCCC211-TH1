import { Form, Input, InputNumber, Button } from 'antd';
import { Employee } from '@/models/nhanvienvadichvu/employee';

interface EmployeeFormProps {
    onSubmit: (values: Omit<Employee, 'id'>) => void;
}

export default function EmployeeForm({ onSubmit }: EmployeeFormProps) {
    const [form] = Form.useForm();

    const handleFinish = (values: Omit<Employee, 'id'>) => {
        onSubmit(values);
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
                name="maxCustomerPerDay"
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
                    Thêm Nhân Viên
                </Button>
            </Form.Item>
        </Form>
    );
}
