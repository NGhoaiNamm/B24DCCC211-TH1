import { useState, useEffect } from "react";
import { getEmployees, saveEmployees } from "@/services/NhanVienVaDichVu/employee";

export interface Employee {
    id: string;
    name: string;
    maxCustomer: number;
    workSchedule: string;
}

export default function useEmployeeModel() {
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        setEmployees(getEmployees());
    }, []);

    const addEmployee = (employee: Employee) => {
        const newData = [...employees, employee];
        setEmployees(newData);
        saveEmployees(newData);
    };

    const deleteEmployee = (id: string) => {
        const newData = employees.filter((e) => e.id !== id);
        setEmployees(newData);
        saveEmployees(newData);
    };

    return {
        employees,
        addEmployee,
        deleteEmployee,
    };
}