import { Table, Form, Input, Select, Button, Popconfirm, Space, Rate, Modal } from 'antd';
import { useHistory } from 'umi';
import { useState } from 'react';
import useReviewModel from '@/models/nhanvienvadichvu/review';
import useAppointmentModel from '@/models/nhanvienvadichvu/appointment';
import useEmployeeModel from '@/models/nhanvienvadichvu/employee';
import useServiceModel from '@/models/nhanvienvadichvu/service';

export default function Reviews() {
    const history = useHistory();
    const { reviews, addReview, deleteReview } = useReviewModel();
    const { appointments } = useAppointmentModel();
    const { employees } = useEmployeeModel();
    const { services } = useServiceModel();
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleAddReview = (values: any) => {
        addReview({
            id: Date.now().toString(),
            appointmentId: values.appointmentId,
            rating: values.rating,
            comment: values.comment,
            date: new Date().toISOString(),
        });
        form.resetFields();
        setIsModalVisible(false);
    };

    const getAppointmentDetails = (appointmentId: string) => {
        const appt = appointments.find((a) => a.id === appointmentId);
        if (!appt) return { employee: '-', service: '-' };
        const emp = employees.find((e) => e.id === appt.employeeId);
        const svc = services.find((s) => s.id === appt.serviceId);
        return {
            employee: emp?.name || '-',
            service: svc?.name || '-',
        };
    };

    const columns = [
        {
            title: 'Ngày đánh giá',
            dataIndex: 'date',
            key: 'date',
            render: (d: string) => new Date(d).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Lịch hẹn',
            dataIndex: 'appointmentId',
            key: 'appointmentId',
            render: (id: string) => {
                const details = getAppointmentDetails(id);
                return `${details.employee} - ${details.service}`;
            },
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            render: (r: number) => <Rate disabled defaultValue={r} />,
        },
        {
            title: 'Bình luận',
            dataIndex: 'comment',
            key: 'comment',
            render: (c: string) => <span>{c.substring(0, 50)}{c.length > 50 ? '...' : ''}</span>,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: any) => (
                <Popconfirm
                    title="Xóa đánh giá này?"
                    onConfirm={() => deleteReview(record.id)}
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
            <Space style={{ marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Đánh giá & Phản hồi</h2>
                <Button
                    type="primary"
                    onClick={() => setIsModalVisible(true)}
                >
                    Thêm đánh giá
                </Button>
                <Button onClick={() => history.push('/booking-management/appointments')}>
                    Quay lại lịch hẹn
                </Button>
            </Space>

            <Modal
                title="Thêm đánh giá"
                visible={isModalVisible}
                onOk={() => form.submit()}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical" onFinish={handleAddReview}>
                    <Form.Item
                        name="appointmentId"
                        label="Chọn lịch hẹn"
                        rules={[{ required: true, message: 'Vui lòng chọn lịch hẹn' }]}
                    >
                        <Select placeholder="Chọn lịch hẹn">
                            {appointments.map((a) => {
                                const details = getAppointmentDetails(a.id);
                                return (
                                    <Select.Option key={a.id} value={a.id}>
                                        {`${details.employee} - ${details.service} (${new Date(a.date).toLocaleDateString('vi-VN')})`}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="rating"
                        label="Đánh giá sao"
                        rules={[{ required: true, message: 'Vui lòng đánh giá' }]}
                    >
                        <Rate />
                    </Form.Item>

                    <Form.Item
                        name="comment"
                        label="Bình luận"
                        rules={[{ required: true, message: 'Vui lòng nhập bình luận' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Nhập phản hồi của bạn..." />
                    </Form.Item>
                </Form>
            </Modal>

            <Table
                columns={columns}
                dataSource={reviews}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}