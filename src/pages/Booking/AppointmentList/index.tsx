import { Table, Form, Select, DatePicker, Button, Popconfirm } from 'antd';
import moment from 'moment';
import useEmployeeModel from '@/models/nhanvienvadichvu/employee';
import useServiceModel from '@/models/nhanvienvadichvu/service';
import useAppointmentModel, { Appointment } from '@/models/nhanvienvadichvu/appointment';

export default function AppointmentList() {
    const { employees } = useEmployeeModel();
    const { services } = useServiceModel();
    const { appointments, addAppointment, deleteAppointment } = useAppointmentModel();

    const [form] = Form.useForm();

    const handleFinish = (values: any) => {
        const service = services.find((s) => s.id === values.serviceId);
        const price = service ? service.price : 0;
        addAppointment({
            id: Date.now().toString(),
            date: values.date.format(),
            employeeId: values.employeeId,
            serviceId: values.serviceId,
            price,
        });
        form.resetFields();
    };

    const columns = [
        {
            title: 'Ngày & giờ',
            dataIndex: 'date',
            key: 'date',
            render: (d: string) => moment(d).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: 'Nhân viên',
            dataIndex: 'employeeId',
            key: 'employeeId',
            render: (id: string) => employees.find((e) => e.id === id)?.name || '-',
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'serviceId',
            key: 'serviceId',
            render: (id: string) => services.find((s) => s.id === id)?.name || '-',
        },
        {
            title: 'Giá (VND)',
            dataIndex: 'price',
            key: 'price',
            render: (p: number) => p.toLocaleString(),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: Appointment) => (
                <Popconfirm
                    title="Xóa lịch hẹn này?"
                    onConfirm={() => deleteAppointment(record.id)}
                >
                    <Button type="link" danger>
                        Xóa
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div>
            <h2>Danh sách Lịch hẹn</h2>
            <Form form={form} layout="inline" onFinish={handleFinish} style={{ marginBottom: 16 }}>
                <Form.Item
                    name="employeeId"
                    rules={[{ required: true, message: 'Chọn nhân viên' }]}
                >
                    <Select style={{ width: 160 }} placeholder="Nhân viên">
                        {employees.map((e) => (
                            <Select.Option key={e.id} value={e.id}>
                                {e.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="serviceId"
                    rules={[{ required: true, message: 'Chọn dịch vụ' }]}
                >
                    <Select style={{ width: 160 }} placeholder="Dịch vụ">
                        {services.map((s) => (
                            <Select.Option key={s.id} value={s.id}>
                                {s.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="date"
                    rules={[{ required: true, message: 'Chọn ngày giờ' }]}
                >
                    <DatePicker showTime placeholder="Chọn ngày giờ" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Thêm
                    </Button>
                </Form.Item>
            </Form>
            <Table
                columns={columns}
                dataSource={appointments}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}