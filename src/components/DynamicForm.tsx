import { Input, DatePicker, InputNumber } from 'antd';

export default function DynamicForm({ fields }: any) {
  return (
    <>
      {fields.map((f: any) => {
        if (f.kieu === 'string') {
          return <Input key={f._id} name={f.tenTruong} placeholder={f.tenTruong} />;
        }
        if (f.kieu === 'number') {
          return <InputNumber key={f._id} name={f.tenTruong} />;
        }
        if (f.kieu === 'date') {
          return <DatePicker key={f._id} />;
        }
      })}
    </>
  );
}