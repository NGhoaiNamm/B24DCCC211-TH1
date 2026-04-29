import { useState, useEffect } from "react";
import { TimePicker, Button, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import moment, { Moment } from "moment";

export interface ScheduleEntry {
    // day of week as string number (0=Sunday,1=Monday,...6=Saturday)
    day?: string;
    from: string; // HH:mm
    to: string;   // HH:mm
    allDay?: boolean; // if true, ignore times
}

interface Props {
    value?: ScheduleEntry[];
    onChange?: (newVal: ScheduleEntry[]) => void;
}

export default function WorkScheduleSelector({ value = [], onChange }: Props) {
    // internal store uses Moment objects for easier binding to TimePicker
    const [slots, setSlots] = useState<
        Array<{ day: string; from: Moment | null; to: Moment | null; allDay: boolean }>
    >([]);

    // sync incoming value
    useEffect(() => {
        setSlots(
            value.map((v) => ({
                day: v.day || "",
                from: v.from ? moment(v.from, "HH:mm") : null,
                to: v.to ? moment(v.to, "HH:mm") : null,
                allDay: !!v.allDay,
            }))
        );
    }, [value]);

    const triggerChange = (newSlots: typeof slots) => {
        setSlots(newSlots);
        if (onChange) {
            // always propagate the current slots, using empty strings for missing values
            const formatted: ScheduleEntry[] = newSlots.map((s) => ({
                day: s.day,
                from: s.from ? s.from.format("HH:mm") : "",
                to: s.to ? s.to.format("HH:mm") : "",
                allDay: s.allDay,
            }));
            onChange(formatted);
        }
    };

    const addSlot = () => {
        triggerChange([...slots, { day: "", from: null, to: null, allDay: false }]);
    };

    const removeSlot = (idx: number) => {
        const newSlots = slots.filter((_, i) => i !== idx);
        triggerChange(newSlots);
    };

    const updateSlot = 
        (idx: number, field: "day" | "from" | "to" | "allDay", val: Moment | null | boolean | string) => {
        const newSlots = slots.map((s, i) => {
            if (i !== idx) return s;
            return { ...s, [field]: val } as any;
        });
        triggerChange(newSlots);
    };

    return (
        <div className="work-schedule-selector">
            {slots.map((slot, idx) => (
                <Space key={idx} style={{ display: "flex", marginBottom: 8 }} align="start">
                    <select
                        value={slot.day}
                        onChange={(e) => updateSlot(idx, "day", e.target.value)}
                    >
                        <option value="">(chọn ngày)</option>
                        <option value="1">Thứ 2</option>
                        <option value="2">Thứ 3</option>
                        <option value="3">Thứ 4</option>
                        <option value="4">Thứ 5</option>
                        <option value="5">Thứ 6</option>
                        <option value="6">Thứ 7</option>
                        <option value="0">Chủ nhật</option>
                    </select>
                    <TimePicker
                        value={slot.from}
                        format="HH:mm"
                        onChange={(t) => updateSlot(idx, "from", t)}
                        placeholder="From"
                        disabled={slot.allDay}
                    />
                    <TimePicker
                        value={slot.to}
                        format="HH:mm"
                        onChange={(t) => updateSlot(idx, "to", t)}
                        placeholder="To"
                        disabled={slot.allDay}
                    />
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            checked={slot.allDay}
                            onChange={(e) => {
                                const isChecked = e.target.checked;
                                updateSlot(idx, "allDay", isChecked as any);
                                if (isChecked) {
                                    // clear times when full day
                                    updateSlot(idx, "from", null);
                                    updateSlot(idx, "to", null);
                                }
                            }}
                        />
                        <span style={{ marginLeft: 4 }}>Cả ngày</span>
                    </label>
                    <MinusCircleOutlined onClick={() => removeSlot(idx)} />
                </Space>
            ))}
            <Button type="dashed" onClick={addSlot} icon={<PlusOutlined />}>
                Thêm khoảng thời gian
            </Button>
        </div>
    );
}