export default function ServiceTable({ data, onDelete }: any) {
    return (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
                <tr>
                    <th>Tên</th>
                    <th>Giá</th>
                    <th>Thời gian</th>
                    <th>Hành động</th>
                </tr>
            </thead>

            <tbody>
                {data.map((s: any) => (
                    <tr key={s.id}>
                        <td>{s.name}</td>
                        <td>{s.price}</td>
                        <td>{s.duration} phút</td>
                        <td>
                            <button onClick={() => onDelete(s.id)}>Xóa</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}