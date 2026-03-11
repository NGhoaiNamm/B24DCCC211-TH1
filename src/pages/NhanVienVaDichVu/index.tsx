import React, { useState } from 'react';
import { Tabs, Form, Input, InputNumber, Button, Table, Space, Popconfirm } from 'antd';
import useEmployeeModel, { Employee } from '@/models/nhanvienvadichvu/employee';
import useServiceModel, { Service } from '@/models/nhanvienvadichvu/service';

const { TabPane } = Tabs;

export default function NhanVienVaDichVu() {
    const { employees, addEmployee, deleteEmployee } = useEmployeeModel();
    const { services, addService, deleteService } = useServiceModel();

    const [employeeForm] = Form.useForm();
    const [serviceForm] = Form.useForm();

    const handleAddEmployee = (values: Employee) => {
        addEmployee({ ...values, id: Date.now().toString() });
        employeeForm.resetFields();
    };

    const handleAddService = (values: Service) => {
        addService({ ...values, id: Date.now().toString() });
        serviceForm.resetFields();
    };

    const employeeColumns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số khách tối đa/ngày',
            dataIndex: 'maxCustomerPerDay',
            key: 'maxCustomerPerDay',
        },
        {
            title: 'Lịch làm việc',
            dataIndex: 'workSchedule',
            key: 'workSchedule',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text: string, record: Employee) => (
                <Popconfirm
                    title="Bạn có chắc muốn xóa?"
                    onConfirm={() => deleteEmployee(record.id)}
                >
                    <Button type="link" danger>
                        Xóa
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    const serviceColumns = [
        {
            title: 'Tên dịch vụ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price.toLocaleString()} VND`,
        },
        {
            title: 'Thời gian (phút)',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text: string, record: Service) => (
                <Popconfirm
                    title="Bạn có chắc muốn xóa?"
                    onConfirm={() => deleteService(record.id)}
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
            <h2>Quản lý Nhân Viên và Dịch Vụ</h2>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Nhân Viên" key="1">
                    <Form
                        form={employeeForm}
                        layout="inline"
                        onFinish={handleAddEmployee}
                        style={{ marginBottom: 16 }}
                    >
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
                    <Table
                        columns={employeeColumns}
                        dataSource={employees}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                    />
                </TabPane>
                <TabPane tab="Dịch Vụ" key="2">
                    <Form
                        form={serviceForm}
                        layout="inline"
                        onFinish={handleAddService}
                        style={{ marginBottom: 16 }}
                    >
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
                    <Table
                        columns={serviceColumns}
                        dataSource={services}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                    />
                </TabPane>
            </Tabs>
        </div>
    );
}