import { useState } from "react";

export default function ServiceForm({ onSubmit }: any) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [duration, setDuration] = useState(0);

    const handleSubmit = () => {
        onSubmit({
            id: Date.now().toString(),
            name,
            price,
            duration,
        });

        setName("");
        setPrice(0);
        setDuration(0);
    };

    return (
        <div>
            <h3>Thêm dịch vụ</h3>

            <input
                placeholder="Tên dịch vụ"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="number"
                placeholder="Giá"
                onChange={(e) => setPrice(Number(e.target.value))}
            />

            <input
                type="number"
                placeholder="Thời gian"
                onChange={(e) => setDuration(Number(e.target.value))}
            />

            <button onClick={handleSubmit}>Thêm</button>
        </div>
    );
}