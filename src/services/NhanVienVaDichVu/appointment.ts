import { Appointment } from "@/models/nhanvienvadichvu/appointment";

const STORAGE_KEY = 'appointments_data';

export function getAppointments(): Appointment[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error('Failed to parse appointments from storage', e);
        return [];
    }
}

export function saveAppointments(data: Appointment[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}