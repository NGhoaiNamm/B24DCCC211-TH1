import { Form, Input, Button } from 'antd';
import { useModel } from '@umijs/max';
import DynamicForm from '@/components/DynamicForm';

export default () => {
  const { cauHinh, getCauHinh, createVanBang } = useModel('vanBang');

  useEffect(() => {
    getCauHinh();
  }, []);

  const onFinish = async (values: any) => {
    await createVanBang(values);
  };

  return (
    <Form onFinish={onFinish}>
      <Input name="soHieu" placeholder="Số hiệu" />
      <Input name="msv" placeholder="Mã sinh viên" />
      <Input name="hoTen" placeholder="Họ tên" />

      {/* dynamic */}
      <DynamicForm fields={cauHinh} />

      <Button htmlType="submit">Thêm</Button>
    </Form>
  );
};