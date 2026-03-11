import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, TimePicker, Button, message } from 'antd';
import { Appointment } from '@/models/nhanvienvadichvu/appointment';
import useEmployeeModel from '@/models/nhanvienvadichvu/employee';
import useServiceModel from '@/models/nhanvienvadichvu/service';
import dayjs from 'dayjs';

const { Option } = Select;

interface AppointmentFormProps {
    editingAppointment?: Appointment;
    onSubmit: (values: Appointment) => void;
}

export default function AppointmentForm({ editingAppointment, onSubmit }: AppointmentFormProps) {
    const [form] = Form.useForm();
    const { employees } = useEmployeeModel();
    const { services } = useServiceModel();

    React.useEffect(() => {
        if (editingAppointment) {
            form.setFieldsValue({
                ...editingAppointment,
                date: dayjs(editingAppointment.date),
                time: dayjs(editingAppointment.time, 'HH:mm'),
            });
        } else {
            form.resetFields();
        }
    }, [editingAppointment, form]);

    const handleFinish = (values: any) => {
        const appointmentData: Appointment = {
            id: editingAppointment?.id || Date.now().toString(),
            customerName: values.customerName,
            customerPhone: values.customerPhone,
            serviceId: values.serviceId,
            employeeId: values.employeeId,
            date: values.date.format('YYYY-MM-DD'),
            time: values.time.format('HH:mm'),
            status: editingAppointment?.status || 'pending',
            notes: values.notes,
            createdAt: editingAppointment?.createdAt || new Date().toISOString(),
        };

        onSubmit(appointmentData);
        if (!editingAppointment) {
            form.resetFields();
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleFinish}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <Form.Item
                    name="customerName"
                    label="Tên khách hàng"
                    rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
                >
                    <Input placeholder="Nhập tên khách hàng" />
                </Form.Item>

                <Form.Item
                    name="customerPhone"
                    label="Số điện thoại"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại!' },
                        { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                    ]}
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item
                    name="serviceId"
                    label="Dịch vụ"
                    rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}
                >
                    <Select placeholder="Chọn dịch vụ">
                        {services.map(service => (
                            <Option key={service.id} value={service.id}>
                                {service.name} - {service.price.toLocaleString()}đ
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="employeeId"
                    label="Nhân viên phục vụ"
                    rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
                >
                    <Select placeholder="Chọn nhân viên">
                        {employees.map(employee => (
                            <Option key={employee.id} value={employee.id}>
                                {employee.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="date"
                    label="Ngày hẹn"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                >
                    <DatePicker
                        placeholder="Chọn ngày"
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    name="time"
                    label="Giờ hẹn"
                    rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}
                >
                    <TimePicker
                        placeholder="Chọn giờ"
                        format="HH:mm"
                        minuteStep={15}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
            </div>

            <Form.Item name="notes" label="Ghi chú">
                <Input.TextArea placeholder="Ghi chú thêm (không bắt buộc)" rows={2} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" size="large">
                    {editingAppointment ? 'Cập Nhật Lịch Hẹn' : 'Đặt Lịch Hẹn'}
                </Button>
            </Form.Item>
        </Form>
    );
}