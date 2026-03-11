import { useState, useEffect } from "react";
import { getAppointments, saveAppointments } from "@/services/NhanVienVaDichVu/appointment";

export interface Appointment {
    id: string;
    date: string; // ISO string
    employeeId: string;
    serviceId: string;
    price: number;
}

export default function useAppointmentModel() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        setAppointments(getAppointments());
    }, []);

    const addAppointment = (appt: Appointment) => {
        const newData = [...appointments, appt];
        setAppointments(newData);
        saveAppointments(newData);
    };

    const deleteAppointment = (id: string) => {
        const newData = appointments.filter((a) => a.id !== id);
        setAppointments(newData);
        saveAppointments(newData);
    };

    return {
        appointments,
        addAppointment,
        deleteAppointment,
    };
}