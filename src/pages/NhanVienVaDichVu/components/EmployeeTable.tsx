export default function EmployeeTable({ data, onDelete }: any) {
    return (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
                <tr>
                    <th>Tên</th>
                    <th>Khách/ngày</th>
                    <th>Lịch</th>
                    <th>Hành động</th>
                </tr>
            </thead>

            <tbody>
                {data.map((e: any) => (
                    <tr key={e.id}>
                        <td>{e.name}</td>
                        <td>{e.maxCustomerPerDay}</td>
                        <td>{e.workSchedule}</td>
                        <td>
                            <button onClick={() => onDelete(e.id)}>Xóa</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}