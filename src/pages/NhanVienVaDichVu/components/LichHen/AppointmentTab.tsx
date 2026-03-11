import React, { useState } from 'react';
import useAppointmentModel, { Appointment } from '@/models/nhanvienvadichvu/appointment';
import AppointmentForm from './AppointmentForm';
import AppointmentTable from './AppointmentTable';
import { message } from 'antd';

export default function AppointmentTab() {
    const {
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        checkTimeConflict
    } = useAppointmentModel();

    const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>();

    const handleSubmit = (values: Appointment) => {
        // Check for time conflicts
        const hasConflict = checkTimeConflict(
            values.employeeId,
            values.date,
            values.time,
            editingAppointment?.id
        );

        if (hasConflict) {
            message.error('Thời gian này đã có lịch hẹn với nhân viên này!');
            return;
        }

        if (editingAppointment) {
            updateAppointment(values);
            setEditingAppointment(undefined);
            message.success('Cập nhật lịch hẹn thành công!');
        } else {
            addAppointment(values);
            message.success('Đặt lịch hẹn thành công!');
        }
    };

    const handleStatusChange = (id: string, status: Appointment['status']) => {
        const appointment = appointments.find(a => a.id === id);
        if (appointment) {
            updateAppointment({ ...appointment, status });
            message.success('Cập nhật trạng thái thành công!');
        }
    };

    return (
        <div>
            <h3>Quản lý lịch hẹn</h3>
            <AppointmentForm
                editingAppointment={editingAppointment}
                onSubmit={handleSubmit}
            />
            <AppointmentTable
                appointments={appointments}
                onEdit={setEditingAppointment}
                onDelete={deleteAppointment}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
}