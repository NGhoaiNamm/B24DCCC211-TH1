import useEmployeeModel, { Employee } from '@/models/nhanvienvadichvu/employee';
import EmployeeForm from './EmployeeForm';
import EmployeeTable from './EmployeeTable';

export default function EmployeeTab() {
    const { employees, addEmployee, deleteEmployee } = useEmployeeModel();

    const handleAddEmployee = (values: Omit<Employee, 'id'>) => {
        addEmployee({ ...values, id: Date.now().toString() });
    };

    return (
        <>
            <EmployeeForm onSubmit={handleAddEmployee} />
            <EmployeeTable employees={employees} onDelete={deleteEmployee} />
        </>
    );
}
