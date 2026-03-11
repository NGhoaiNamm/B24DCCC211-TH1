import { Form, Input, InputNumber, Button } from 'antd';
import { Service } from '@/models/nhanvienvadichvu/service';

interface ServiceFormProps {
    onSubmit: (values: Omit<Service, 'id'>) => void;
}

export default function ServiceForm({ onSubmit }: ServiceFormProps) {
    const [form] = Form.useForm();

    const handleFinish = (values: Omit<Service, 'id'>) => {
        onSubmit(values);
        form.resetFields();
    };

    return (
        <Form form={form} layout="inline" onFinish={handleFinish} style={{ marginBottom: 16 }}>
            <Form.Item
                name="name"
                label="Tên dịch vụ"
                rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
            >
                <Input placeholder="Tên dịch vụ" />
            </Form.Item>
            <Form.Item
                name="price"
                label="Giá"
                rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
            >
                <InputNumber min={0} placeholder="Giá (VND)" />
            </Form.Item>
            <Form.Item
                name="duration"
                label="Thời gian"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
            >
                <InputNumber min={1} placeholder="Thời gian (phút)" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Thêm Dịch Vụ
                </Button>
            </Form.Item>
        </Form>
    );
}
