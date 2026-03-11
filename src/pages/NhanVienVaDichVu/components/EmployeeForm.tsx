import { useState } from "react";

export default function EmployeeForm({ onSubmit }: any) {
    const [name, setName] = useState("");
    const [maxCustomer, setMaxCustomer] = useState(0);
    const [schedule, setSchedule] = useState("");

    const handleSubmit = () => {
        onSubmit({
            id: Date.now().toString(),
            name,
            maxCustomerPerDay: maxCustomer,
            workSchedule: schedule,
        });

        setName("");
        setMaxCustomer(0);
        setSchedule("");
    };

    return (
        <div>
            <h3>Thêm nhân viên</h3>

            <input
                placeholder="Tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                placeholder="Số khách/ngày"
                type="number"
                onChange={(e) => setMaxCustomer(Number(e.target.value))}
            />

            <input
                placeholder="Lịch làm việc"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
            />

            <button onClick={handleSubmit}>Thêm</button>
        </div>
    );
}