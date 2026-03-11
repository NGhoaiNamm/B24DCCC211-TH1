import { useState, useEffect } from "react";
import { getAppointments, saveAppointments } from "@/services/NhanVienVaDichVu/appointment";

export interface Appointment {
    id: string;
    customerName: string;
    customerPhone: string;
    serviceId: string;
    employeeId: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes?: string;
    createdAt: string;
}

export default function useAppointmentModel() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        setAppointments(getAppointments());
    }, []);

    const addAppointment = (appointment: Appointment) => {
        const newData = [...appointments, appointment];
        setAppointments(newData);
        saveAppointments(newData);
    };

    const updateAppointment = (u: Appointment) => {
        const newData = appointments.map((a) => (a.id === u.id ? u : a));
        setAppointments(newData);
        saveAppointments(newData);
    };

    const deleteAppointment = (id: string) => {
        const newData = appointments.filter((a) => a.id !== id);
        setAppointments(newData);
        saveAppointments(newData);
    };

    const getAppointmentsByDate = (date: string) => {
        return appointments.filter(a => a.date === date);
    };

    const getAppointmentsByEmployee = (employeeId: string) => {
        return appointments.filter(a => a.employeeId === employeeId);
    };

    const checkTimeConflict = (employeeId: string, date: string, time: string, excludeId?: string) => {
        return appointments.some(a =>
            a.employeeId === employeeId &&
            a.date === date &&
            a.time === time &&
            a.status !== 'cancelled' &&
            a.id !== excludeId
        );
    };

    return {
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        getAppointmentsByDate,
        getAppointmentsByEmployee,
        checkTimeConflict,
    };
}