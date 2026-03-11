import React from 'react';
import useEmployeeModel, { Employee } from '@/models/nhanvienvadichvu/employee';
import EmployeeForm from './EmployeeForm';
import EmployeeTable from './EmployeeTable';

export default function EmployeeTab() {
    const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployeeModel();
    const [editingEmployee, setEditingEmployee] = React.useState<Employee | undefined>();

    const handleSubmit = (values: Employee) => {
        if (editingEmployee) {
            updateEmployee(values);
            setEditingEmployee(undefined);
        } else {
            addEmployee(values);
        }
    };

    return (
        <>
            <EmployeeForm editingEmployee={editingEmployee} onSubmit={handleSubmit} />
            <EmployeeTable
                employees={employees}
                onEdit={setEditingEmployee}
                onDelete={deleteEmployee}
            />
        </>
    );
}
